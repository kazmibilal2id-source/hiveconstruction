const express = require("express");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { getMyProfile, updateMyProfile } = require("../controllers/profileController");
const { updateProfileSchema } = require("../validators/profileValidator");

const router = express.Router();

router.get("/", authenticate, getMyProfile);
router.patch("/", authenticate, validate(updateProfileSchema), updateMyProfile);

module.exports = router;
