const { z } = require("zod");

const calculateProfitSchema = z.object({
  propertyId: z.string().min(10),
  salePrice: z.number().positive()
});

const publishProfitSchema = z.object({
  propertyId: z.string().min(10),
  salePrice: z.number().positive()
});

module.exports = {
  calculateProfitSchema,
  publishProfitSchema
};
