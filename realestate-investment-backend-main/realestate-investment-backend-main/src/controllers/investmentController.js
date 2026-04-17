const Investment = require("../models/Investment");
const Property = require("../models/Property");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { NotFoundError, AuthorizationError, ValidationError } = require("../utils/errors");

const recalculateShares = async (propertyId) => {
  const records = await Investment.find({ propertyId, status: { $ne: "withdrawn" } });
  const total = records.reduce((sum, item) => sum + item.amount, 0);

  await Promise.all(
    records.map((record) => {
      record.sharePercentage = total ? Number(((record.amount / total) * 100).toFixed(4)) : 0;
      return record.save();
    })
  );
};

const getInvestments = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { investorId: req.user.id };

  const investments = await Investment.find(query)
    .populate("investorId", "fullName email status")
    .populate("propertyId", "title location status totalCost salePrice");

  return sendSuccess(res, investments, "Investments fetched");
});

const getInvestmentById = asyncHandler(async (req, res) => {
  const investment = await Investment.findById(req.params.id)
    .populate("investorId", "fullName email status")
    .populate("propertyId");

  if (!investment) {
    throw new NotFoundError("Investment not found");
  }

  if (req.user.role !== "admin" && investment.investorId._id.toString() !== req.user.id) {
    throw new AuthorizationError("You can only access your own investment");
  }

  return sendSuccess(res, investment, "Investment detail fetched");
});

const createInvestment = asyncHandler(async (req, res) => {
  const { investorId, propertyId, amount, investmentDate, status, exitType } = req.body;

  const investor = await User.findById(investorId);
  if (!investor || investor.role !== "investor") {
    throw new NotFoundError("Investor not found");
  }

  if (investor.status !== "active") {
    throw new ValidationError("Only active investors can receive investments");
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new NotFoundError("Property not found");
  }

  const investment = await Investment.create({
    investorId,
    propertyId,
    amount,
    sharePercentage: 0,
    investmentDate: investmentDate ? new Date(investmentDate) : new Date(),
    status: status || "active",
    exitType: exitType || "normal"
  });

  await recalculateShares(propertyId);

  const fresh = await Investment.findById(investment._id)
    .populate("investorId", "fullName email status")
    .populate("propertyId", "title location");

  return sendSuccess(res, fresh, "Investment created", 201);
});

const updateInvestment = asyncHandler(async (req, res) => {
  const investment = await Investment.findById(req.params.id);
  if (!investment) {
    throw new NotFoundError("Investment not found");
  }

  const beforePropertyId = investment.propertyId.toString();

  Object.assign(investment, req.body);
  await investment.save();

  await recalculateShares(beforePropertyId);
  if (req.body.propertyId && req.body.propertyId !== beforePropertyId) {
    await recalculateShares(req.body.propertyId);
  }

  return sendSuccess(res, investment, "Investment updated");
});

const deleteInvestment = asyncHandler(async (req, res) => {
  const investment = await Investment.findById(req.params.id);
  if (!investment) {
    throw new NotFoundError("Investment not found");
  }

  const propertyId = investment.propertyId.toString();
  await investment.deleteOne();
  await recalculateShares(propertyId);

  return sendSuccess(res, null, "Investment deleted");
});

module.exports = {
  getInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment
};
