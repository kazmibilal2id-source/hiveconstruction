const { AppError, InternalError, RateLimitError } = require("../utils/errors");

const redactedFields = [
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "cardNumber",
  "cvv",
  "ssn",
  "privateKey",
  "mnemonic"
];

const redactObject = (value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(redactObject);
  }

  return Object.entries(value).reduce((acc, [key, val]) => {
    if (redactedFields.includes(key)) {
      acc[key] = "[REDACTED]";
    } else {
      acc[key] = redactObject(val);
    }

    return acc;
  }, {});
};

const errorHandler = (err, req, res, _next) => {
  const typedError = err instanceof AppError ? err : AppError.from(err);
  const finalError = typedError || new InternalError();

  const logPayload = {
    level: "error",
    message: finalError.message,
    timestamp: new Date().toISOString(),
    service: "hive-advisor-backend",
    requestId: res.locals.requestId,
    userId: req.user?.id,
    errorCode: finalError.errorCode,
    httpStatus: finalError.httpStatus,
    path: req.originalUrl,
    method: req.method,
    stack: finalError.stack,
    context: redactObject(finalError.context)
  };

  // eslint-disable-next-line no-console
  console.error(JSON.stringify(logPayload));

  if (!finalError.isOperational) {
    // eslint-disable-next-line no-console
    console.error("ALERT: Non-operational error detected. Escalate to on-call.");
  }

  if (finalError instanceof RateLimitError) {
    res.setHeader("Retry-After", String(finalError.retryAfterSeconds));
  }

  return res.status(finalError.httpStatus).json(finalError.serialize());
};

module.exports = { errorHandler };
