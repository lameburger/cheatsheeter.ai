import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL || "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      // Handle CORS preflight requests
      return res.status(200).end();
    }
  
    if (req.method === "POST") {
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: "price_1ExamplePriceId",
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL}/cancel`,
          metadata: {
            userId: req.body.userId,
          },
        });
  
        res.status(200).json({ sessionId: session.id });
      } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
      }
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  }