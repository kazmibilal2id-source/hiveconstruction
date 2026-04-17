const Investment = require("../models/Investment");
const Property = require("../models/Property");
const { asyncHandler } = require("../utils/asyncHandler");
const { ValidationError, NotFoundError } = require("../utils/errors");
const { calculateProfitDistribution } = require("../utils/calculations");
const { toPdfBuffer, toExcelBuffer } = require("../utils/report");

const sendFileBuffer = (res, buffer, fileName, contentType) => {
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  res.send(buffer);
};

const exportPayload = async ({ format, title, rows, baseFileName }) => {
  if (format === "excel") {
    const buffer = await toExcelBuffer({ sheetName: title.slice(0, 30), rows });
    return {
      buffer,
      fileName: `${baseFileName}.xlsx`,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };
  }

  const buffer = await toPdfBuffer({ title, rows });
  return {
    buffer,
    fileName: `${baseFileName}.pdf`,
    contentType: "application/pdf"
  };
};

const reportInvestments = asyncHandler(async (req, res) => {
  const format = req.query.format === "excel" ? "excel" : "pdf";

  const investments = await Investment.find()
    .populate("investorId", "fullName email")
    .populate("propertyId", "title location");

  const rows = investments.map((item) => ({
    investmentId: item._id.toString(),
    investorName: item.investorId?.fullName,
    propertyTitle: item.propertyId?.title,
    amount: item.amount,
    sharePercentage: item.sharePercentage,
    status: item.status,
    profitReceived: item.profitReceived
  }));

  const file = await exportPayload({
    format,
    title: "Investments Report",
    rows,
    baseFileName: "investments-report"
  });

  return sendFileBuffer(res, file.buffer, file.fileName, file.contentType);
});

const reportProperties = asyncHandler(async (req, res) => {
  const format = req.query.format === "excel" ? "excel" : "pdf";

  const properties = await Property.find();
  const rows = properties.map((item) => ({
    propertyId: item._id.toString(),
    title: item.title,
    location: item.location,
    area: item.area,
    totalCost: item.totalCost,
    companyContribution: item.companyContribution,
    status: item.status,
    constructionStage: item.constructionStage
  }));

  const file = await exportPayload({
    format,
    title: "Properties Report",
    rows,
    baseFileName: "properties-report"
  });

  return sendFileBuffer(res, file.buffer, file.fileName, file.contentType);
});

const reportProfit = asyncHandler(async (req, res) => {
  const { propertyId } = req.query;
  const format = req.query.format === "excel" ? "excel" : "pdf";

  if (!propertyId) {
    throw new ValidationError("propertyId is required");
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new NotFoundError("Property not found");
  }

  if (!property.salePrice) {
    throw new ValidationError("Property salePrice must be set before generating profit report");
  }

  const investments = await Investment.find({ propertyId });

  const distribution = calculateProfitDistribution({
    salePrice: property.salePrice,
    totalPropertyCost: property.totalCost,
    investments
  });

  const rows = distribution.investorBreakdown.map((item) => ({
    investmentId: item.investmentId.toString(),
    investorId: item.investorId.toString(),
    investedAmount: item.amount,
    shareRatio: item.shareRatio,
    profit: item.profit,
    payout: item.payout
  }));

  const file = await exportPayload({
    format,
    title: `Profit Report - ${property.title}`,
    rows,
    baseFileName: "profit-report"
  });

  return sendFileBuffer(res, file.buffer, file.fileName, file.contentType);
});

module.exports = {
  reportInvestments,
  reportProperties,
  reportProfit
};
