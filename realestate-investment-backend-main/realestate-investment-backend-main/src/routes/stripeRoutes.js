const express = require("express");
const { createCheckoutSession, handleWebhook } = require("../controllers/stripeController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/create-checkout-session", authenticate, createCheckoutSession);
router.post("/webhook", handleWebhook);

module.exports = router;
