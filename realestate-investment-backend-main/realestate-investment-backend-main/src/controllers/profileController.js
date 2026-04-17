const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { NotFoundError } = require("../utils/errors");

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  return sendSuccess(res, user, "Profile fetched");
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const allowed = ["fullName", "phone", "address", "profileImage"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      user[key] = req.body[key];
    }
  }

  await user.save();
  return sendSuccess(res, user, "Profile updated");
});

module.exports = {
  getMyProfile,
  updateMyProfile
};
