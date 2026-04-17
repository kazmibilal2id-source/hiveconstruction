const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hive_advisor",
  jwtSecret: process.env.JWT_SECRET || "replace_with_backend_jwt_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  admin: {
    email: process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase() : "",
    password: process.env.ADMIN_PASSWORD || ""
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 2525),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || "Hive Construction Ventures <noreply@hiveventures.com>"
  },
  uploadDriver: process.env.UPLOAD_DRIVER || "local",
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 5),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
};

module.exports = env;
