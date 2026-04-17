const Document = require("../models/Document");
const Investment = require("../models/Investment");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { NotFoundError, ValidationError, AuthorizationError } = require("../utils/errors");

const listDocuments = asyncHandler(async (req, res) => {
  const query = {};

  if (req.user.role !== "admin") {
    query.investorId = req.user.id;
  }

  if (req.query.investmentId) {
    query.investmentId = req.query.investmentId;
  }

  const docs = await Document.find(query)
    .populate("investmentId", "amount propertyId")
    .populate("uploadedBy", "fullName role")
    .sort({ createdAt: -1 });

  return sendSuccess(res, docs, "Documents fetched");
});

const uploadDocument = asyncHandler(async (req, res) => {
  const { investorId, investmentId, title } = req.body;

  if (!req.file) {
    throw new ValidationError("File is required");
  }

  if (!investorId || !investmentId || !title) {
    throw new ValidationError("investorId, investmentId, and title are required");
  }

  const investment = await Investment.findById(investmentId);
  if (!investment) {
    throw new NotFoundError("Investment not found");
  }

  if (investment.investorId.toString() !== investorId) {
    throw new ValidationError("Investment does not belong to the provided investor");
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  const document = await Document.create({
    investorId,
    investmentId,
    title,
    fileUrl,
    fileType: req.file.mimetype,
    uploadedBy: req.user.id
  });

  return sendSuccess(res, document, "Document uploaded", 201);
});

const getDocumentById = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) {
    throw new NotFoundError("Document not found");
  }

  if (req.user.role !== "admin" && doc.investorId.toString() !== req.user.id) {
    throw new AuthorizationError("IDOR protection: you cannot access this document");
  }

  return sendSuccess(res, doc, "Document fetched");
});

module.exports = {
  listDocuments,
  uploadDocument,
  getDocumentById
};
