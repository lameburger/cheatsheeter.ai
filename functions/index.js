const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

// Create Checkout Session
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: "price_1ExamplePriceId", // Replace with actual Stripe price ID
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
        console.error("Error creating Stripe Checkout session:", error.message);
        res.status(500).send("Internal server error");
    }
});

// Stripe Webhook
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata.userId;

        try {
            const userDocRef = admin.firestore().doc(`users/${userId}`);
            await userDocRef.update({
                subscriptionType: "premium",
                subscriptionStart: admin.firestore.Timestamp.now(),
            });

            console.log(`User ${userId} upgraded to premium.`);
            res.status(200).send("Webhook received!");
        } catch (error) {
            console.error("Error updating subscription in Firebase:", error.message);
            res.status(500).send("Internal server error");
        }
    } else {
        res.status(400).send("Unhandled event type");
    }
});