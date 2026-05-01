const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Investment = require("../src/models/Investment");
const User = require("../src/models/User");

async function checkInvestments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const investments = await Investment.find().populate("investorId", "fullName email");
    console.log(`Found ${investments.length} investments total.`);
    
    investments.forEach(inv => {
      console.log(`ID: ${inv._id}, Amount: ${inv.amount}, Investor: ${inv.investorId?.fullName} (${inv.investorId?.email})`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkInvestments();
