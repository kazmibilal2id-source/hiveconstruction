const { z } = require("zod");

const investmentCreateSchema = z.object({
  investorId: z.string().min(10),
  propertyId: z.string().min(10),
  amount: z.number().positive(),
  investmentDate: z.string().datetime().optional(),
  status: z.enum(["active", "withdrawn", "completed"]).optional(),
  exitType: z.enum(["normal", "early", "loss_protected"]).optional()
});

const investmentUpdateSchema = z.object({
  amount: z.number().positive().optional(),
  status: z.enum(["active", "withdrawn", "completed"]).optional(),
  exitType: z.enum(["normal", "early", "loss_protected"]).optional(),
  profitReceived: z.number().optional()
});

module.exports = {
  investmentCreateSchema,
  investmentUpdateSchema
};
