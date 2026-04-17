const express = require("express");
const {
  getMyNotifications,
  markNotificationRead,
  sendNotification
} = require("../controllers/notificationController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { sendNotificationSchema } = require("../validators/notificationValidator");

const router = express.Router();

router.get("/", authenticate, getMyNotifications);
router.patch("/:id/read", authenticate, markNotificationRead);
router.post("/send", authenticate, authorizeRoles("admin"), validate(sendNotificationSchema), sendNotification);

module.exports = router;
