const { z } = require("zod");

const chequeSchema = z.object({
  investorId: z.string().min(10),
  investmentId: z.string().min(10),
  chequeNumber: z.string().min(3).max(100),
  bankName: z.string().min(2).max(120),
  amount: z.number().positive(),
  issueDate: z.string().datetime(),
  status: z.enum(["held", "returned"]).optional()
});

const chequeUpdateSchema = chequeSchema.partial();

module.exports = {
  chequeSchema,
  chequeUpdateSchema
};
