require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Process payment
const processPayment = async (amount, payment_method_id) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: "usd",
      payment_method: payment_method_id,
      confirm: true
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = processPayment;
