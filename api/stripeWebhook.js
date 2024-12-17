import Stripe from "stripe";
import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Access environment variables
const {
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
    FIREBASE_SERVICE_ACCOUNT_KEY,
} = process.env;

// Check for required environment variables
if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error("❌ Missing environment variables. Please check your .env file or Vercel environment settings.");
    process.exit(1);
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("✅ Firebase initialized successfully.");
    } catch (err) {
        console.error("❌ Failed to initialize Firebase:", err.message);
        process.exit(1);
    }
}

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    try {
        // Log environment variables for debugging
        console.log("🔎 Environment Variables:");
        console.log("STRIPE_SECRET_KEY:", STRIPE_SECRET_KEY ? "Loaded" : "Not Loaded");
        console.log("STRIPE_WEBHOOK_SECRET:", STRIPE_WEBHOOK_SECRET ? "Loaded" : "Not Loaded");
        console.log("FIREBASE_SERVICE_ACCOUNT_KEY:", FIREBASE_SERVICE_ACCOUNT_KEY ? "Loaded" : "Not Loaded");

        // Respond to test calls
        if (req.method === "GET") {
            return res.status(200).json({
                message: "Test API working!",
                environmentVariables: {
                    STRIPE_SECRET_KEY: STRIPE_SECRET_KEY ? "Loaded" : "Not Loaded",
                    STRIPE_WEBHOOK_SECRET: STRIPE_WEBHOOK_SECRET ? "Loaded" : "Not Loaded",
                    FIREBASE_SERVICE_ACCOUNT_KEY: FIREBASE_SERVICE_ACCOUNT_KEY ? "Loaded" : "Not Loaded",
                },
            });
        }

        // Check for raw body and signature
        const rawBody = JSON.stringify(req.body); // Simplified body parsing
        const sig = req.headers["stripe-signature"];

        if (!sig) {
            console.error("❌ Missing Stripe signature.");
            return res.status(400).send("Missing Stripe signature.");
        }

        // Verify webhook signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
            console.log("✅ Stripe Event Verified:", event.type);
        } catch (err) {
            console.error("❌ Stripe signature verification failed:", err.message);
            return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
        }

        // Handle event types
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const customerEmail = session.customer_details?.email;

            if (!customerEmail) {
                console.error("❌ Customer email missing in session.");
                return res.status(400).send("Missing customer email in session.");
            }

            console.log("✅ Processing user subscription for:", customerEmail);

            // Firestore Update
            const userQuery = admin.firestore().collection("users").where("email", "==", customerEmail);
            const snapshot = await userQuery.get();

            if (snapshot.empty) {
                console.error(`❌ No user found with email: ${customerEmail}`);
                return res.status(404).send("User not found.");
            }

            const updatePromises = [];
            snapshot.forEach((doc) => {
                updatePromises.push(
                    doc.ref.update({
                        subscriptionType: "premium",
                        subscriptionStart: admin.firestore.Timestamp.now(),
                    })
                );
            });

            await Promise.all(updatePromises);
            console.log(`✅ Subscription updated for user: ${customerEmail}`);
        } else {
            console.warn(`⚠️ Unhandled event type: ${event.type}`);
        }

        res.status(200).send("Webhook received and processed successfully.");
    } catch (err) {
        console.error("❌ Webhook Error:", err.message);
        res.status(500).send(`Webhook Error: ${err.message}`);
    }
}