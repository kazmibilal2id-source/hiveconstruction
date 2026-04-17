const express = require("express");
const { getCheques, createCheque, updateCheque } = require("../controllers/chequeController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { chequeSchema, chequeUpdateSchema } = require("../validators/chequeValidator");

const router = express.Router();

router.get("/", authenticate, getCheques);
router.post("/", authenticate, authorizeRoles("admin"), validate(chequeSchema), createCheque);
router.put("/:id", authenticate, authorizeRoles("admin"), validate(chequeUpdateSchema), updateCheque);

module.exports = router;
