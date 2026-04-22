const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const { randomUUID } = require("crypto");
const path = require("path");

const env = require("./config/env");
const { errorHandler } = require("./middleware/errorHandler");
const { NotFoundError } = require("./utils/errors");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const investorRoutes = require("./routes/investorRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const profitRoutes = require("./routes/profitRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const chequeRoutes = require("./routes/chequeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const documentRoutes = require("./routes/documentRoutes");
const profileRoutes = require("./routes/profileRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(
  express.json({
    limit: "2mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use((req, res, next) => {
  res.locals.requestId = req.header("x-request-id") || randomUUID();
  next();
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

app.get("/ready", (_req, res) => {
  res.json({ success: true, status: "ready", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/profit-sharing", profitRoutes);
app.use("/api/withdrawal", withdrawalRoutes);
app.use("/api/cheques", chequeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stripe", stripeRoutes);

app.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

app.use(errorHandler);

module.exports = app;
