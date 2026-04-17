const bcrypt = require("bcryptjs");
const { connectDb } = require("../config/db");
const env = require("../config/env");
const User = require("../models/User");

(async () => {
  await connectDb();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@hiveventures.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });

  if (existing) {
    // eslint-disable-next-line no-console
    console.log(`Admin already exists: ${adminEmail}`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await User.create({
    fullName: "Hive Admin",
    email: adminEmail.toLowerCase(),
    password: hashedPassword,
    phone: "00000000000",
    CNIC: "ADMIN-CNIC-001",
    address: "Hive HQ",
    role: "admin",
    status: "active"
  });

  // eslint-disable-next-line no-console
  console.log(`Admin seeded successfully: ${adminEmail}`);
  process.exit(0);
})().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to seed admin", error);
  process.exit(1);
});
