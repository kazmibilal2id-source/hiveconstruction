const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    amount: { type: Number, required: true, min: 0 },
    sharePercentage: { type: Number, required: true, min: 0 },
    investmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "withdrawn", "completed"],
      default: "active"
    },
    profitReceived: { type: Number, default: 0 },
    exitType: {
      type: String,
      enum: ["normal", "early", "loss_protected"],
      default: "normal"
    },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

module.exports = mongoose.models.Investment || mongoose.model("Investment", investmentSchema);
