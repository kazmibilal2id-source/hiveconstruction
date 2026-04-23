const mongoose = require("mongoose");
const env = require("./env");

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", true);
    console.log(`Attempting to connect to MongoDB...`);
    // We redact the password for security in logs
    const redactedUri = env.mongodbUri.replace(/:([^@]+)@/, ":****@");
    console.log(`Connecting to: ${redactedUri}`);
    
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of 10
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = { connectDb };
