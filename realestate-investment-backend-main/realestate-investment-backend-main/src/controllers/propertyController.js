const Property = require("../models/Property");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { NotFoundError } = require("../utils/errors");

const listProperties = asyncHandler(async (req, res) => {
  const { status, location, minPrice, maxPrice } = req.query;
  const query = {};

  if (status) {
    query.status = status;
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (minPrice || maxPrice) {
    query.totalCost = {};
    if (minPrice) query.totalCost.$gte = Number(minPrice);
    if (maxPrice) query.totalCost.$lte = Number(maxPrice);
  }

  const properties = await Property.find(query).sort({ createdAt: -1 });
  return sendSuccess(res, properties, "Properties fetched");
});

const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    throw new NotFoundError("Property not found");
  }

  return sendSuccess(res, property, "Property fetched");
});

const createProperty = asyncHandler(async (req, res) => {
  const images = (req.files || []).map((file) => `/uploads/${file.filename}`);
  const payload = {
    ...req.body,
    images
  };

  if (payload.purchaseDate) payload.purchaseDate = new Date(payload.purchaseDate);
  if (payload.soldDate) payload.soldDate = new Date(payload.soldDate);

  const property = await Property.create(payload);
  return sendSuccess(res, property, "Property created", 201);
});

const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    throw new NotFoundError("Property not found");
  }

  const previousStage = property.constructionStage;
  const nextStage = req.body.constructionStage;
  const newImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

  Object.assign(property, req.body);

  if (req.body.purchaseDate) property.purchaseDate = new Date(req.body.purchaseDate);
  if (req.body.soldDate) property.soldDate = new Date(req.body.soldDate);

  if (newImages.length) {
    property.images = [...property.images, ...newImages];
  }

  if (nextStage && nextStage !== previousStage) {
    property.timeline.push({ stage: nextStage, date: new Date(), note: "Updated by admin" });
  }

  if (req.body.salePrice) {
    property.valueHistory.push({ value: Number(req.body.salePrice), date: new Date() });
  }

  await property.save();
  return sendSuccess(res, property, "Property updated");
});

const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndDelete(req.params.id);
  if (!property) {
    throw new NotFoundError("Property not found");
  }

  return sendSuccess(res, null, "Property deleted");
});

module.exports = {
  listProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
};
