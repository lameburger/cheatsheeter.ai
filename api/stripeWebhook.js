import Stripe from "stripe";
import { buffer } from "micro";
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
    console.error("❌ Missing environment variables! Please check your .env file or Vercel environment settings.");
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

export const config = {
    api: { bodyParser: false }, // Stripe requires raw body
};

export default async function handler(req, res) {
    const sig = req.headers["stripe-signature"];

    try {
        const rawBody = await buffer(req);
        console.log("🔎 Raw Webhook Body:", rawBody.toString());

        // Validate Stripe signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
            console.log("✅ Stripe Event Verified:", event.type);
        } catch (err) {
            console.error("❌ Stripe signature verification failed:", err.message);
            return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
        }

        // Handle checkout.session.completed event
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const customerEmail = session.customer_details?.email;

            console.log("✅ Checkout Session Completed - Customer Email:", customerEmail);

            if (!customerEmail) {
                console.error("❌ Customer email is missing in session.");
                return res.status(400).send("Missing customer email in session.");
            }

            try {
                // Search for the user in Firestore
                console.log(`🔎 Searching Firestore for user with email: ${customerEmail}`);
                const userQuery = admin.firestore().collection("users").where("email", "==", customerEmail);
                const snapshot = await userQuery.get();

                if (snapshot.empty) {
                    console.error(`❌ No user found with email: ${customerEmail}`);
                    return res.status(404).send("User not found.");
                }

                // Update user's subscription status
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
            } catch (firebaseErr) {
                console.error("❌ Error updating Firestore:", firebaseErr.message);
                return res.status(500).send(`Firestore Error: ${firebaseErr.message}`);
            }
        } else {
            console.warn(`⚠️ Unhandled event type: ${event.type}`);
        }

        res.status(200).send("Webhook received and processed successfully.");
    } catch (err) {
        console.error("❌ Webhook Processing Error:", err.message);
        res.status(500).send(`Webhook Error: ${err.message}`);
    }
}