const app = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");

let server;

const gracefulShutdown = () => {
  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log("Server closed gracefully");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  // eslint-disable-next-line no-console
  console.error(
    JSON.stringify({
      level: "fatal",
      message: "Unhandled promise rejection — initiating graceful shutdown",
      reason: reason?.message || String(reason),
      timestamp: new Date().toISOString()
    })
  );
  gracefulShutdown();
});

process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.error(
    JSON.stringify({
      level: "fatal",
      message: "Uncaught exception — initiating graceful shutdown",
      error: err?.message || String(err),
      stack: err?.stack,
      timestamp: new Date().toISOString()
    })
  );
  gracefulShutdown();
});

(async () => {
  await connectDb();

  server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Hive Advisor backend listening on port ${env.port}`);
  });
})();
