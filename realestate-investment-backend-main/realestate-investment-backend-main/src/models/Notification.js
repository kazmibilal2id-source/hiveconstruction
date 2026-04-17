const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, default: "general" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
