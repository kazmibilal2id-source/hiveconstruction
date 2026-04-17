const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().min(7).max(20),
  CNIC: z.string().min(5).max(30),
  address: z.string().min(5).max(250),
  role: z.enum(["investor", "visitor"]).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(128)
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
