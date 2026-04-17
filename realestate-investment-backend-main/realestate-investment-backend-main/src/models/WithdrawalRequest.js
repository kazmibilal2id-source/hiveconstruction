const mongoose = require("mongoose");

const withdrawalRequestSchema = new mongoose.Schema(
  {
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Investment", required: true },
    requestDate: { type: Date, default: Date.now },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    calculatedReturn: { type: Number, default: 0 },
    adminNote: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.WithdrawalRequest || mongoose.model("WithdrawalRequest", withdrawalRequestSchema);
