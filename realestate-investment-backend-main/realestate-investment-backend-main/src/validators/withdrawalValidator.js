const { z } = require("zod");

const withdrawalRequestSchema = z.object({
  investmentId: z.string().min(10),
  reason: z.string().min(5).max(500),
  currentMarketValue: z.number().positive().optional()
});

const withdrawalStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  adminNote: z.string().max(500).optional()
});

module.exports = {
  withdrawalRequestSchema,
  withdrawalStatusSchema
};
