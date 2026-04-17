const mongoose = require("mongoose");

const securityChequeSchema = new mongoose.Schema(
  {
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Investment", required: true },
    chequeNumber: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    issueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["held", "returned"],
      default: "held"
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SecurityCheque || mongoose.model("SecurityCheque", securityChequeSchema);
