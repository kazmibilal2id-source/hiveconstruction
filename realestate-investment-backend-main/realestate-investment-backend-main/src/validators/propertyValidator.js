const { z } = require("zod");

const propertySchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10).max(4000),
  location: z.string().min(2).max(200),
  area: z.number().positive(),
  totalCost: z.number().nonnegative(),
  companyContribution: z.number().nonnegative().default(0),
  status: z.enum(["available", "under_construction", "sold", "purchased"]).optional(),
  constructionStage: z.string().max(100).optional(),
  purchaseDate: z.string().datetime().optional(),
  soldDate: z.string().datetime().optional(),
  salePrice: z.number().nonnegative().optional()
});

const propertyUpdateSchema = propertySchema.partial();

module.exports = {
  propertySchema,
  propertyUpdateSchema
};
