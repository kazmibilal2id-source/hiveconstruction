const { z } = require("zod");

const investorStatusSchema = z.object({
  status: z.enum(["pending", "active", "blocked"])
});

module.exports = {
  investorStatusSchema
};
