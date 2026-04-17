const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Investment", required: true },
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Document || mongoose.model("Document", documentSchema);
