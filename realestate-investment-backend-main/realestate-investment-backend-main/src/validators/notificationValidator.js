const { z } = require("zod");

const sendNotificationSchema = z.object({
  recipientId: z.string().min(10).optional(),
  message: z.string().min(3).max(1000),
  type: z.string().min(2).max(50).default("general"),
  sendToAllInvestors: z.boolean().optional()
});

module.exports = {
  sendNotificationSchema
};
