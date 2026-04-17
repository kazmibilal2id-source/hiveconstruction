const express = require("express");
const {
  getInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment
} = require("../controllers/investmentController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  investmentCreateSchema,
  investmentUpdateSchema
} = require("../validators/investmentValidator");

const router = express.Router();

router.get("/", authenticate, getInvestments);
router.get("/:id", authenticate, getInvestmentById);
router.post("/", authenticate, authorizeRoles("admin"), validate(investmentCreateSchema), createInvestment);
router.put("/:id", authenticate, authorizeRoles("admin"), validate(investmentUpdateSchema), updateInvestment);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteInvestment);

module.exports = router;
