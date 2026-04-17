const rateLimit = require("express-rate-limit");
const { RateLimitError } = require("../utils/errors");

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new RateLimitError("Too many authentication attempts. Please retry later.", 900));
  }
});

module.exports = {
  authRateLimiter
};
