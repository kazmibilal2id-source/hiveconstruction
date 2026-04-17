const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {
    stage: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String }
  },
  { _id: false }
);

const valueHistorySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    value: { type: Number, required: true }
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    area: { type: Number, required: true },
    totalCost: { type: Number, required: true, min: 0 },
    companyContribution: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["available", "under_construction", "sold", "purchased"],
      default: "available"
    },
    constructionStage: { type: String, default: "Land Purchased" },
    purchaseDate: { type: Date },
    soldDate: { type: Date },
    salePrice: { type: Number, min: 0 },
    timeline: {
      type: [timelineSchema],
      default: [{ stage: "Land Purchased", date: new Date() }]
    },
    valueHistory: {
      type: [valueHistorySchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Property || mongoose.model("Property", propertySchema);
