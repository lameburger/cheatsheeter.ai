import Stripe from "stripe";
import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Required environment variables
const {
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
    FIREBASE_SERVICE_ACCOUNT_KEY,
} = process.env;

// Check environment variables
if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error("❌ Missing required environment variables.");
}

// Initialize Firebase Admin SDK once
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY)),
        });
        console.log("✅ Firebase initialized successfully.");
    } catch (err) {
        console.error("❌ Firebase initialization failed:", err.message);
        throw err;
    }
}

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY);

// Required to disable automatic body parsing for Stripe
export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    console.log("🔎 Incoming Request Method:", req.method);

    // Handle POST requests (Stripe webhook)
    if (req.method === "POST") {
        const signature = req.headers["stripe-signature"];

        if (!signature) {
            console.error("❌ Missing Stripe signature.");
            return res.status(400).send("Missing Stripe signature.");
        }

        let rawBody;

        // Parse raw body for Stripe signature verification
        try {
            const chunks = [];
            for await (const chunk of req) {
                chunks.push(chunk);
            }
            rawBody = Buffer.concat(chunks);
        } catch (err) {
            console.error("❌ Error reading request body:", err.message);
            return res.status(500).send("Error reading request body.");
        }

        let event;

        try {
            // Verify Stripe webhook signature
            event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
            console.log("✅ Stripe Event Verified:", event.type);
        } catch (err) {
            console.error("❌ Stripe signature verification failed:", err.message);
            return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
        }

        // Handle specific event types
        try {
            if (event.type === "checkout.session.completed" || event.type === "payment_link.completed") {
                const session = event.data.object;
                const customerEmail = session.customer_details?.email;

                if (!customerEmail) {
                    console.error("❌ Customer email missing.");
                    return res.status(400).send("Missing customer email in session.");
                }

                console.log(`🔎 Processing subscription for user: ${customerEmail}`);

                // Query Firestore to find the user
                const userQuery = admin.firestore().collection("users").where("email", "==", customerEmail);
                const snapshot = await userQuery.get();

                if (snapshot.empty) {
                    console.error(`❌ No user found with email: ${customerEmail}`);
                    return res.status(404).send("User not found.");
                }

                // Update Firestore documents
                const updatePromises = snapshot.docs.map((doc) =>
                    doc.ref.update({
                        subscriptionType: "premium",
                        subscriptionStart: admin.firestore.Timestamp.now(),
                    })
                );

                await Promise.all(updatePromises);
                console.log(`✅ Subscription updated successfully for: ${customerEmail}`);
            } else {
                console.warn(`⚠️ Unhandled event type: ${event.type}`);
            }

            // Respond to Stripe
            res.status(200).send("Webhook received and processed successfully.");
        } catch (err) {
            console.error("❌ Error processing webhook:", err.message);
            res.status(500).send(`Error processing webhook: ${err.message}`);
        }
    } else {
        // Invalid request method
        console.warn("⚠️ Method not allowed.");
        res.status(405).send("Method Not Allowed");
    }
}