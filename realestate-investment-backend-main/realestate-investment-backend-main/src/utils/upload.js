const multer = require("multer");
const path = require("path");
const fs = require("fs");
const env = require("../config/env");
const { ValidationError } = require("./errors");

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  }
});

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new ValidationError("Invalid file type", { file: ["Unsupported MIME type"] }));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxUploadSizeMb * 1024 * 1024
  }
});

module.exports = {
  upload,
  allowedMimeTypes
};
