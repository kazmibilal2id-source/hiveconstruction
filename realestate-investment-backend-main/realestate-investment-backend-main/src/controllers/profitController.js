const Property = require("../models/Property");
const Investment = require("../models/Investment");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { NotFoundError, ValidationError } = require("../utils/errors");
const { calculateProfitDistribution } = require("../utils/calculations");
const { sendEmail } = require("../utils/email");

const fetchDistribution = async ({ propertyId, salePrice }) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new NotFoundError("Property not found");
  }

  const investments = await Investment.find({ propertyId, status: { $ne: "withdrawn" } });
  if (!investments.length) {
    throw new ValidationError("No active investments found for this property");
  }

  const distribution = calculateProfitDistribution({
    salePrice,
    totalPropertyCost: property.totalCost,
    investments
  });

  return { property, investments, distribution };
};

const calculateProfitPreview = asyncHandler(async (req, res) => {
  const { propertyId, salePrice } = req.body;

  const { property, distribution } = await fetchDistribution({
    propertyId,
    salePrice
  });

  return sendSuccess(
    res,
    {
      property,
      salePrice,
      ...distribution
    },
    "Profit distribution preview calculated"
  );
});

const publishProfitDistribution = asyncHandler(async (req, res) => {
  const { propertyId, salePrice } = req.body;

  const { property, distribution } = await fetchDistribution({ propertyId, salePrice });

  property.status = "sold";
  property.salePrice = salePrice;
  property.soldDate = new Date();
  property.constructionStage = "Sold";
  property.timeline.push({
    stage: "Sold",
    date: new Date(),
    note: `Marked sold at ${salePrice}`
  });
  property.valueHistory.push({ date: new Date(), value: salePrice });
  await property.save();

  const notifications = [];

  for (const item of distribution.investorBreakdown) {
    // eslint-disable-next-line no-await-in-loop
    const investment = await Investment.findById(item.investmentId);
    if (!investment) {
      continue;
    }

    investment.profitReceived = Number(item.profit.toFixed(2));
    investment.status = "completed";
    investment.exitType = item.profit < 0 ? "loss_protected" : "normal";
    // eslint-disable-next-line no-await-in-loop
    await investment.save();

    notifications.push({
      recipientId: item.investorId,
      message: `Profit distribution published for ${property.title}. Your payout: PKR ${item.payout.toFixed(2)}.`,
      type: "profit_distribution"
    });

    // eslint-disable-next-line no-await-in-loop
    const investor = await User.findById(item.investorId);
    if (investor?.email) {
      // eslint-disable-next-line no-await-in-loop
      await sendEmail({
        to: investor.email,
        subject: "Profit Distribution Published",
        html: `<p>Hi ${investor.fullName},</p><p>Your payout for <strong>${property.title}</strong> is PKR ${item.payout.toFixed(
          2
        )}.</p>`,
        text: `Your payout for ${property.title} is PKR ${item.payout.toFixed(2)}.`
      });
    }
  }

  if (notifications.length) {
    await Notification.insertMany(notifications);
  }

  return sendSuccess(
    res,
    {
      property,
      ...distribution
    },
    "Profit distribution published successfully"
  );
});

module.exports = {
  calculateProfitPreview,
  publishProfitDistribution
};
