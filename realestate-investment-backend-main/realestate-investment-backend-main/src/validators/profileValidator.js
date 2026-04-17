const { z } = require("zod");

const updateProfileSchema = z.object({
  fullName: z.string().min(3).max(100).optional(),
  phone: z.string().min(7).max(20).optional(),
  address: z.string().min(5).max(250).optional(),
  profileImage: z.string().url().optional()
});

module.exports = {
  updateProfileSchema
};
