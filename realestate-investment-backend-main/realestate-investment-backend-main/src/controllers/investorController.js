const User = require("../models/User");
const Investment = require("../models/Investment");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { NotFoundError, ValidationError, ExternalServiceError } = require("../utils/errors");
const { sendEmail } = require("../utils/email");

const getInvestors = asyncHandler(async (req, res) => {
  const query = { role: "investor" };
  if (req.query.status) {
    query.status = req.query.status;
  }

  const investors = await User.find(query).sort({ createdAt: -1 });
  return sendSuccess(res, investors, "Investors fetched");
});

const getInvestorById = asyncHandler(async (req, res) => {
  const investor = await User.findOne({ _id: req.params.id, role: "investor" });
  if (!investor) {
    throw new NotFoundError("Investor not found");
  }

  const investments = await Investment.find({ investorId: investor._id }).populate("propertyId");

  return sendSuccess(
    res,
    {
      investor,
      investments
    },
    "Investor detail fetched"
  );
});

const updateInvestorStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const investor = await User.findOne({ _id: req.params.id, role: "investor" });
  if (!investor) {
    throw new NotFoundError("Investor not found");
  }

  investor.status = status;
  await investor.save();

  const sendStatusEmail = async (mailOptions) => {
    try {
      await sendEmail(mailOptions);
    } catch (error) {
      if (error instanceof ExternalServiceError) {
        // eslint-disable-next-line no-console
        console.error(
          JSON.stringify({
            level: "warn",
            message: "Investor status updated but email delivery failed",
            investorId: investor._id.toString(),
            email: investor.email,
            status,
            requestId: res.locals.requestId || null,
            timestamp: new Date().toISOString()
          })
        );
        return;
      }

      throw error;
    }
  };

  if (status === "active") {
    await sendStatusEmail({
      to: investor.email,
      subject: "Your Hive investor account is approved",
      html: `<p>Hi ${investor.fullName},</p><p>Your account has been approved. You can now log in using your registered email.</p>`,
      text: `Hi ${investor.fullName}, your account has been approved.`
    });
  }

  if (status === "blocked") {
    await sendStatusEmail({
      to: investor.email,
      subject: "Account status updated",
      html: `<p>Hi ${investor.fullName},</p><p>Your investor account is currently blocked. Please contact support.</p>`,
      text: `Hi ${investor.fullName}, your account is blocked. Please contact support.`
    });
  }

  return sendSuccess(res, investor, "Investor status updated");
});

const deleteInvestor = asyncHandler(async (req, res) => {
  const investor = await User.findOne({ _id: req.params.id, role: "investor" });
  if (!investor) {
    throw new NotFoundError("Investor not found");
  }

  if (investor.status === "active") {
    throw new ValidationError("Active investors cannot be deleted directly");
  }

  await investor.deleteOne();
  await Investment.deleteMany({ investorId: investor._id });

  return sendSuccess(res, null, "Investor deleted");
});

module.exports = {
  getInvestors,
  getInvestorById,
  updateInvestorStatus,
  deleteInvestor
};
