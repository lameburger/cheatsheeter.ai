const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Create a checkout session
app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: req.body.items,
            mode: "subscription",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: { userId: req.body.userId },
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Webhook endpoint for Stripe
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log("Checkout completed:", session);
        // Add your business logic here
    }

    res.status(200).send("Webhook received");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));