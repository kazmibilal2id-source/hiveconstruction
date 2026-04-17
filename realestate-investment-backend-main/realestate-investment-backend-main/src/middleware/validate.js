const { ValidationError } = require("../utils/errors");

const validate = (schema, source = "body") => (req, _res, next) => {
  const parsed = schema.safeParse(req[source]);

  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors;
    return next(new ValidationError("Validation failed", fields));
  }

  req[source] = parsed.data;
  return next();
};

module.exports = { validate };
