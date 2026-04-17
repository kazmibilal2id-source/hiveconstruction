const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");
const { validate } = require("../middleware/validate");
const { authRateLimiter } = require("../middleware/rateLimit");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require("../validators/authValidator");

const router = express.Router();

router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/forgot-password", authRateLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimiter, validate(resetPasswordSchema), resetPassword);

module.exports = router;
