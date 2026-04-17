const WithdrawalRequest = require("../models/WithdrawalRequest");
const Investment = require("../models/Investment");
const Property = require("../models/Property");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { AuthorizationError, NotFoundError } = require("../utils/errors");
const { calculateInvestorReturn } = require("../utils/calculations");
const { sendEmail } = require("../utils/email");

const requestWithdrawal = asyncHandler(async (req, res) => {
  const { investmentId, reason, currentMarketValue } = req.body;

  const investment = await Investment.findById(investmentId);
  if (!investment) {
    throw new NotFoundError("Investment not found");
  }

  if (investment.investorId.toString() !== req.user.id) {
    throw new AuthorizationError("IDOR protection: investment does not belong to current user");
  }

  const property = await Property.findById(investment.propertyId);
  if (!property) {
    throw new NotFoundError("Property not found for this investment");
  }

  const allInvestments = await Investment.find({
    propertyId: property._id,
    status: { $ne: "withdrawn" }
  });

  const totalInvestedByAllInvestors = allInvestments.reduce((sum, item) => sum + item.amount, 0);

  const calculatedReturn = calculateInvestorReturn(
    investment,
    property,
    currentMarketValue || property.totalCost,
    totalInvestedByAllInvestors
  );

  const request = await WithdrawalRequest.create({
    investorId: req.user.id,
    investmentId,
    reason,
    calculatedReturn
  });

  const admins = await User.find({ role: "admin", status: "active" }).select("_id");
  if (admins.length) {
    await Notification.insertMany(
      admins.map((admin) => ({
        recipientId: admin._id,
        message: `New withdrawal request submitted for investment ${investmentId}`,
        type: "withdrawal_request"
      }))
    );
  }

  return sendSuccess(res, request, "Withdrawal request submitted", 201);
});

const getWithdrawals = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { investorId: req.user.id };

  const requests = await WithdrawalRequest.find(query)
    .populate("investorId", "fullName email")
    .populate("investmentId", "amount status propertyId")
    .sort({ createdAt: -1 });

  return sendSuccess(res, requests, "Withdrawal requests fetched");
});

const updateWithdrawalStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;

  const request = await WithdrawalRequest.findById(req.params.id)
    .populate("investorId", "fullName email")
    .populate("investmentId", "amount status");

  if (!request) {
    throw new NotFoundError("Withdrawal request not found");
  }

  request.status = status;
  request.adminNote = adminNote;
  await request.save();

  if (status === "approved") {
    const investment = await Investment.findById(request.investmentId._id);
    if (investment) {
      investment.status = "withdrawn";
      investment.exitType = "early";
      investment.profitReceived = Math.max(request.calculatedReturn - investment.amount, 0);
      await investment.save();
    }
  }

  await Notification.create({
    recipientId: request.investorId._id,
    message: `Your withdrawal request has been ${status}.`,
    type: "withdrawal_status"
  });

  if (request.investorId?.email) {
    await sendEmail({
      to: request.investorId.email,
      subject: "Withdrawal Request Update",
      html: `<p>Hi ${request.investorId.fullName},</p><p>Your withdrawal request is <strong>${status}</strong>.</p>`,
      text: `Your withdrawal request is ${status}.`
    });
  }

  return sendSuccess(res, request, "Withdrawal status updated");
});

module.exports = {
  requestWithdrawal,
  getWithdrawals,
  updateWithdrawalStatus
};
