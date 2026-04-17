const { AuthenticationError, AuthorizationError } = require("../utils/errors");
const { verifyJwt } = require("../utils/jwt");

const getTokenFromRequest = (req) => {
  const bearer = req.headers.authorization;
  if (bearer && bearer.startsWith("Bearer ")) {
    return bearer.split(" ")[1];
  }

  return req.cookies?.accessToken || null;
};

const authenticate = (req, _res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(new AuthenticationError("Missing authentication token"));
  }

  try {
    const payload = verifyJwt(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      status: payload.status
    };
    return next();
  } catch (_error) {
    return next(new AuthenticationError("Invalid or expired token"));
  }
};

const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AuthenticationError("Authentication required"));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AuthorizationError("Insufficient role permissions"));
  }

  return next();
};

const requireActiveInvestor = (req, _res, next) => {
  if (req.user?.role === "investor" && req.user?.status !== "active") {
    return next(new AuthorizationError("Investor account is not active"));
  }

  return next();
};

module.exports = {
  authenticate,
  authorizeRoles,
  requireActiveInvestor
};
