import dotenv from "dotenv";
dotenv.config(); // Load environment variables FIRST

import Stripe from "stripe";
import { buffer } from "micro";
import admin from "firebase-admin";

// Access environment variables
const {
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
    FIREBASE_SERVICE_ACCOUNT_KEY,
} = process.env;

// Check for required environment variables
if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error("❌ Missing environment variables!");
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
        console.error("❌ Firebase initialization failed:", err.message);
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
        const rawBody = await buffer(req); // Buffer the body
        console.log("🔎 Raw Webhook Body:", rawBody.toString());

        // Verify Stripe signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
            console.log("✅ Stripe Event Verified:", event.type);
        } catch (err) {
            console.error("❌ Stripe signature verification failed:", err.message);
            return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
        }

        // Process checkout.session.completed
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const customerEmail = session.customer_details?.email;

            console.log("✅ Customer Email:", customerEmail);

            if (!customerEmail) {
                console.error("❌ Customer email missing.");
                return res.status(400).send("Missing customer email.");
            }

            // Firestore Update
            const userQuery = admin.firestore().collection("users").where("email", "==", customerEmail);
            const snapshot = await userQuery.get();

            if (snapshot.empty) {
                console.error(`❌ No user found with email: ${customerEmail}`);
                return res.status(404).send("User not found.");
            }

            const updatePromises = [];
            snapshot.forEach((doc) =>
                updatePromises.push(
                    doc.ref.update({
                        subscriptionType: "premium",
                        subscriptionStart: admin.firestore.Timestamp.now(),
                    })
                )
            );

            await Promise.all(updatePromises);
            console.log(`✅ Subscription updated for: ${customerEmail}`);
        }

        res.status(200).send("Webhook received and processed successfully.");
    } catch (err) {
        console.error("❌ Webhook Error:", err.message);
        res.status(500).send(`Webhook Error: ${err.message}`);
    }
}