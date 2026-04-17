const express = require("express");
const {
  requestWithdrawal,
  getWithdrawals,
  updateWithdrawalStatus
} = require("../controllers/withdrawalController");
const { authenticate, authorizeRoles, requireActiveInvestor } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  withdrawalRequestSchema,
  withdrawalStatusSchema
} = require("../validators/withdrawalValidator");

const router = express.Router();

router.post(
  "/request",
  authenticate,
  authorizeRoles("investor"),
  requireActiveInvestor,
  validate(withdrawalRequestSchema),
  requestWithdrawal
);
router.get("/", authenticate, getWithdrawals);
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("admin"),
  validate(withdrawalStatusSchema),
  updateWithdrawalStatus
);

module.exports = router;
