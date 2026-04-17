class AppError extends Error {
  constructor({
    message,
    httpStatus = 500,
    errorCode = "INTERNAL_ERROR",
    category = "INTERNAL",
    severity = "HIGH",
    isOperational = true,
    context = {}
  }) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
    this.category = category;
    this.severity = severity;
    this.isOperational = isOperational;
    this.context = context;
    Error.captureStackTrace?.(this, this.constructor);
  }

  serialize() {
    return {
      success: false,
      data: null,
      error: {
        code: this.errorCode,
        message: this.message,
        category: this.category
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: this.context.requestId || null
      }
    };
  }

  static from(err) {
    if (err instanceof AppError) {
      return err;
    }

    return new InternalError("Unexpected internal server error", {
      metadata: {
        originalMessage: err?.message || "Unknown error"
      }
    });
  }
}

class ValidationError extends AppError {
  constructor(message, fields = {}, context = {}) {
    super({
      message,
      httpStatus: 400,
      errorCode: "VALIDATION_ERROR",
      category: "VALIDATION",
      severity: "LOW",
      isOperational: true,
      context
    });
    this.fields = fields;
  }

  serialize() {
    const payload = super.serialize();
    payload.error.fields = this.fields;
    return payload;
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication required", context = {}) {
    super({
      message,
      httpStatus: 401,
      errorCode: "AUTHENTICATION_ERROR",
      category: "AUTH",
      severity: "MEDIUM",
      isOperational: true,
      context
    });
  }
}

class AuthorizationError extends AppError {
  constructor(message = "You are not authorized for this action", context = {}) {
    super({
      message,
      httpStatus: 403,
      errorCode: "AUTHORIZATION_ERROR",
      category: "AUTH",
      severity: "MEDIUM",
      isOperational: true,
      context
    });
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found", context = {}) {
    super({
      message,
      httpStatus: 404,
      errorCode: "NOT_FOUND",
      category: "NOT_FOUND",
      severity: "LOW",
      isOperational: true,
      context
    });
  }
}

class ConflictError extends AppError {
  constructor(message = "Resource conflict", context = {}) {
    super({
      message,
      httpStatus: 409,
      errorCode: "CONFLICT",
      category: "BUSINESS",
      severity: "LOW",
      isOperational: true,
      context
    });
  }
}

class RateLimitError extends AppError {
  constructor(message = "Too many requests", retryAfterSeconds = 900, context = {}) {
    super({
      message,
      httpStatus: 429,
      errorCode: "RATE_LIMITED",
      category: "SECURITY",
      severity: "MEDIUM",
      isOperational: true,
      context
    });
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

class ExternalServiceError extends AppError {
  constructor(serviceName, message = "External service failed", context = {}) {
    super({
      message,
      httpStatus: 502,
      errorCode: "EXTERNAL_SERVICE_ERROR",
      category: "EXTERNAL",
      severity: "HIGH",
      isOperational: true,
      context: {
        ...context,
        serviceName
      }
    });
  }
}

class DatabaseError extends AppError {
  constructor(message = "Database operation failed", context = {}) {
    super({
      message,
      httpStatus: 503,
      errorCode: "DATABASE_ERROR",
      category: "DATABASE",
      severity: "HIGH",
      isOperational: true,
      context
    });
  }
}

class BusinessLogicError extends AppError {
  constructor(message = "Business rule violation", context = {}) {
    super({
      message,
      httpStatus: 422,
      errorCode: "BUSINESS_LOGIC_ERROR",
      category: "BUSINESS",
      severity: "MEDIUM",
      isOperational: true,
      context
    });
  }
}

class InternalError extends AppError {
  constructor(message = "Internal server error", context = {}) {
    super({
      message,
      httpStatus: 500,
      errorCode: "INTERNAL_ERROR",
      category: "INTERNAL",
      severity: "HIGH",
      isOperational: false,
      context
    });
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  DatabaseError,
  BusinessLogicError,
  InternalError
};
