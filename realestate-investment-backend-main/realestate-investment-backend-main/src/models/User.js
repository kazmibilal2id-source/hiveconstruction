const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    CNIC: { type: String, required: true, unique: true, trim: true },
    address: { type: String, trim: true },
    role: {
      type: String,
      enum: ["admin", "investor", "visitor"],
      default: "investor"
    },
    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending"
    },
    profileImage: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
