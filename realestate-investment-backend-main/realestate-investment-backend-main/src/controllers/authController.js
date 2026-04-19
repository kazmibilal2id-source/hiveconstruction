const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { signJwt } = require("../utils/jwt");
const { sendEmail } = require("../utils/email");
const env = require("../config/env");
const {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ExternalServiceError
} = require("../utils/errors");

const COOKIE_NAME = "accessToken";

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, CNIC, address, role } = req.body;

  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { CNIC }]
  });

  if (existing) {
    throw new ConflictError("User with this email or CNIC already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    CNIC,
    address,
    otp,
    otpExpires,
    role: role || "investor",
    status: "pending"
  });

  let emailDelivery = "sent";

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your email - Hive Construction Ventures",
      html: `<p>Hi ${user.fullName},</p><p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
      text: `Hi ${user.fullName}, your verification code is: ${otp}`
    });
  } catch (error) {
    if (error instanceof ExternalServiceError) {
      emailDelivery = "failed";

      // eslint-disable-next-line no-console
      console.error(
        JSON.stringify({
          level: "warn",
          message: "Registration email delivery failed; continuing without blocking signup",
          userId: user._id.toString(),
          email: user.email,
          requestId: res.locals.requestId || null,
          timestamp: new Date().toISOString()
        })
      );
    } else {
      throw error;
    }
  }

  const successMessage =
    emailDelivery === "failed"
      ? "Registration successful. Admin approval is pending. Confirmation email could not be delivered right now."
      : "Registration successful. Await admin approval.";

  return sendSuccess(
    res,
    {
      user: user.toJSON()
    },
    successMessage,
    201,
    { emailDelivery }
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase();
  const isEnvAdminLogin =
    Boolean(env.admin.email) &&
    Boolean(env.admin.password) &&
    normalizedEmail === env.admin.email &&
    password === env.admin.password;

  if (isEnvAdminLogin) {
    const token = signJwt({
      sub: "env-admin",
      email: env.admin.email,
      role: "admin",
      status: "active"
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/"
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          _id: "env-admin",
          fullName: "Hive Admin",
          email: env.admin.email,
          phone: "",
          CNIC: "",
          address: "",
          role: "admin",
          status: "active"
        }
      },
      "Login successful"
    );
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  if (user.status !== "active") {
    throw new AuthenticationError("Account is not active. Please contact support.");
  }

  const token = signJwt({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    status: user.status
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/"
  });

  return sendSuccess(res, { token, user: user.toJSON() }, "Login successful");
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.nodeEnv === "production",
    path: "/"
  });

  return sendSuccess(res, null, "Logout successful");
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new NotFoundError("No user found for this email");
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${env.frontendUrl}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `<p>Hi ${user.fullName},</p><p>Reset your password using this link: <a href="${resetUrl}">${resetUrl}</a></p>`,
    text: `Reset your password using this link: ${resetUrl}`
  });

  return sendSuccess(res, null, "Password reset link sent");
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  }).select("+password");

  if (!user) {
    throw new AuthenticationError("Reset token is invalid or expired");
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return sendSuccess(res, null, "Password reset successful");
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
    otp,
    otpExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new AuthenticationError("Invalid or expired OTP");
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  user.status = "active"; // Auto-activate on successful OTP verification
  await user.save();

  return sendSuccess(res, null, "Email verified successfully. You can now login.");
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyOtp
};
