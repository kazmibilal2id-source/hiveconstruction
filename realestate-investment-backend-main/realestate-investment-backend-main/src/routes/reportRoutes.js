const express = require("express");
const {
  reportInvestments,
  reportProperties,
  reportProfit
} = require("../controllers/reportController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/investments", reportInvestments);
router.get("/properties", reportProperties);
router.get("/profit", reportProfit);

module.exports = router;
