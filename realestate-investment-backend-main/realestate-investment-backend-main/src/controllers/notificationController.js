const Notification = require("../models/Notification");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { AuthorizationError, NotFoundError, ValidationError } = require("../utils/errors");
const { sendEmail } = require("../utils/email");

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipientId: req.user.id }).sort({ createdAt: -1 });
  return sendSuccess(res, notifications, "Notifications fetched");
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new NotFoundError("Notification not found");
  }

  if (notification.recipientId.toString() !== req.user.id) {
    throw new AuthorizationError("Cannot access another user's notification");
  }

  notification.isRead = true;
  await notification.save();

  return sendSuccess(res, notification, "Notification marked as read");
});

const sendNotification = asyncHandler(async (req, res) => {
  const { recipientId, message, type, sendToAllInvestors } = req.body;

  let recipients = [];

  if (sendToAllInvestors) {
    recipients = await User.find({ role: "investor", status: "active" }).select("_id fullName email");
  } else if (recipientId) {
    const recipient = await User.findById(recipientId).select("_id fullName email");
    if (!recipient) {
      throw new NotFoundError("Recipient not found");
    }
    recipients = [recipient];
  } else {
    throw new ValidationError("Either recipientId or sendToAllInvestors=true is required");
  }

  const docs = recipients.map((user) => ({
    recipientId: user._id,
    message,
    type
  }));

  await Notification.insertMany(docs);

  await Promise.all(
    recipients.map((user) =>
      sendEmail({
        to: user.email,
        subject: "Hive Notification",
        html: `<p>Hi ${user.fullName},</p><p>${message}</p>`,
        text: message
      })
    )
  );

  return sendSuccess(
    res,
    { count: recipients.length },
    `${recipients.length} notification(s) dispatched`,
    201
  );
});

module.exports = {
  getMyNotifications,
  markNotificationRead,
  sendNotification
};
