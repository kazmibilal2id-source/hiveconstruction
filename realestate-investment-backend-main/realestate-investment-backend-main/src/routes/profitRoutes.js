const express = require("express");
const {
  calculateProfitPreview,
  publishProfitDistribution
} = require("../controllers/profitController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { calculateProfitSchema, publishProfitSchema } = require("../validators/profitValidator");

const router = express.Router();

router.post(
  "/calculate",
  authenticate,
  authorizeRoles("admin"),
  validate(calculateProfitSchema),
  calculateProfitPreview
);
router.post(
  "/publish",
  authenticate,
  authorizeRoles("admin"),
  validate(publishProfitSchema),
  publishProfitDistribution
);

module.exports = router;
