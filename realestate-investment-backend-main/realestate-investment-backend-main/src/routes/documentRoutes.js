const express = require("express");
const {
  listDocuments,
  uploadDocument,
  getDocumentById
} = require("../controllers/documentController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { upload } = require("../utils/upload");

const router = express.Router();

router.get("/", authenticate, listDocuments);
router.get("/:id", authenticate, getDocumentById);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  upload.single("file"),
  uploadDocument
);

module.exports = router;
