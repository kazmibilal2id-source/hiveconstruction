const express = require("express");
const {
  getInvestors,
  getInvestorById,
  updateInvestorStatus,
  deleteInvestor
} = require("../controllers/investorController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { investorStatusSchema } = require("../validators/investorValidator");

const router = express.Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/", getInvestors);
router.get("/:id", getInvestorById);
router.patch("/:id/status", validate(investorStatusSchema), updateInvestorStatus);
router.delete("/:id", deleteInvestor);

module.exports = router;
