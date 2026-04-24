const env = require("../config/env");
const stripe = require("stripe")(env.stripe.secretKey || "sk_test_placeholder");
const { asyncHandler } = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { AuthenticationError, NotFoundError } = require("../utils/errors");
const Property = require("../models/Property");
const Investment = require("../models/Investment");

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { propertyId, amount } = req.body;
  const user = req.user;

  if (!user) {
    throw new AuthenticationError("Unauthorized");
  }

  if (!propertyId || !amount || amount <= 0) {
    throw new Error("Invalid property or amount");
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new NotFoundError("Property not found");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: `Investment in ${property.title}`,
              description: `Investment amount for property ID: ${propertyId}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents/paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.frontendUrl}/investor/dashboard?payment=success`,
      cancel_url: `${env.frontendUrl}/investor/properties/${propertyId}?payment=cancelled`,
      customer_email: user.email,
      client_reference_id: propertyId,
      metadata: {
        userId: user.id,
        propertyId: propertyId,
        amount: amount.toString(),
      },

    });

    return sendSuccess(res, { id: session.id, url: session.url }, "Stripe session created");
  } catch (error) {
    console.error("Stripe Session Creation Error:", error);
    throw error; // This will be caught by asyncHandler and return 500 with message
  }
});


const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Requires raw request body
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Extract metadata defined during checkout session creation
    const { userId, propertyId, amount } = session.metadata;

    const property = await Property.findById(propertyId);
    
    if (property && userId && amount) {
      const numericAmount = Number(amount);
      const sharePercentage = (numericAmount / property.totalCost) * 100;

      // Create new investment record
      await Investment.create({
        investorId: userId,
        propertyId: propertyId,
        amount: numericAmount,
        sharePercentage: sharePercentage,
        status: "active"
      });
      
      // Update property amount collected if such field exists
      if (typeof property.amountCollected !== "undefined") {
         property.amountCollected += numericAmount;
         await property.save();
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

module.exports = {
  createCheckoutSession,
  handleWebhook
};
