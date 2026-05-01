const SecurityCheque = require("../models/SecurityCheque");
const Investment = require("../models/Investment");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { NotFoundError, AuthorizationError } = require("../utils/errors");

const getCheques = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role !== "admin") {
    const investorInvestments = await Investment.find({ investorId: req.user.id }).select("_id");
    query = { investmentId: { $in: investorInvestments.map((i) => i._id) } };
  }

  const cheques = await SecurityCheque.find(query)
    .populate("investorId", "fullName email")
    .populate({
      path: "investmentId",
      select: "amount propertyId",
      populate: { path: "propertyId", select: "title" }
    })
    .sort({ createdAt: -1 });

  return sendSuccess(res, cheques, "Cheques fetched");
});

const createCheque = asyncHandler(async (req, res) => {
  const { investorId, investmentId } = req.body;

  if (req.user.role !== "admin") {
    // Ensure the investorId in the body matches the logged-in user
    if (investorId !== req.user.id) {
      throw new AuthorizationError("You can only create cheques for yourself");
    }

    // Ensure the investment belongs to the logged-in user
    const investment = await Investment.findOne({ _id: investmentId, investorId: req.user.id });
    if (!investment) {
      throw new NotFoundError("Investment not found or does not belong to you");
    }
  }

  const cheque = await SecurityCheque.create({
    ...req.body,
    issueDate: new Date(req.body.issueDate)
  });

  return sendSuccess(res, cheque, "Security cheque created", 201);
});

const updateCheque = asyncHandler(async (req, res) => {
  const cheque = await SecurityCheque.findById(req.params.id);
  if (!cheque) {
    throw new NotFoundError("Cheque not found");
  }

  if (req.user.role !== "admin") {
    throw new AuthorizationError("Only admins can update cheques");
  }

  Object.assign(cheque, req.body);
  if (req.body.issueDate) cheque.issueDate = new Date(req.body.issueDate);
  await cheque.save();

  return sendSuccess(res, cheque, "Cheque updated");
});

module.exports = {
  getCheques,
  createCheque,
  updateCheque
};
