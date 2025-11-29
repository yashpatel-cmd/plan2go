const functions = require("firebase-functions");
const Stripe = require("stripe");
const stripe = new Stripe("YOUR_SECRET_KEY");

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const { roomName, totalAmount, userEmail } = data;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: roomName,
          },
          unit_amount: totalAmount * 100,
        },
        quantity: 1,
      }
    ],
    success_url: "http://localhost:5173/payment-success",
    cancel_url: "http://localhost:5173/payment-cancel",
  });

  return { url: session.url };
});
