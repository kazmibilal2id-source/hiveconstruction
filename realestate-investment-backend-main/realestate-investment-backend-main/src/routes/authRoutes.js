const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyOtp
} = require("../controllers/authController");
const { validate } = require("../middleware/validate");
const { authRateLimiter } = require("../middleware/rateLimit");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema
} = require("../validators/authValidator");

const router = express.Router();

router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/forgot-password", authRateLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimiter, validate(resetPasswordSchema), resetPassword);
router.post("/verify-otp", authRateLimiter, validate(verifyOtpSchema), verifyOtp);

module.exports = router;
