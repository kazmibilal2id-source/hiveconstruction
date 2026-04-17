const express = require("express");
const {
  listProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} = require("../controllers/propertyController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { upload } = require("../utils/upload");

const router = express.Router();

router.get("/", listProperties);
router.get("/:id", getPropertyById);
router.post("/", authenticate, authorizeRoles("admin"), upload.array("images", 10), createProperty);
router.put("/:id", authenticate, authorizeRoles("admin"), upload.array("images", 10), updateProperty);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteProperty);

module.exports = router;
