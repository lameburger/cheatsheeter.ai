import Stripe from "stripe";
import { buffer } from "micro";
import admin from "firebase-admin";

// Check for required environment variables
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET || !process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error("Missing environment variables!");
    process.exit(1);
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase initialized successfully.");
    } catch (err) {
        console.error("Failed to initialize Firebase:", err.message);
        process.exit(1);
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: { bodyParser: false }, // Stripe requires raw body
};

export default async function handler(req, res) {
    const sig = req.headers["stripe-signature"];

    try {
        const rawBody = await buffer(req);
        console.log("Raw Webhook Body:", rawBody.toString());

        // Validate Stripe signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
            console.log("Verified Stripe Event:", event);
        } catch (err) {
            console.error("⚠️  Stripe signature verification failed:", err.message);
            return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
        }

        // Handle specific event type
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            const customerEmail = session.customer_details?.email;
            console.log("✅ Customer Email:", customerEmail);

            if (!customerEmail) {
                console.error("❌ Customer email is missing.");
                return res.status(400).send("Missing customer email in session.");
            }

            try {
                console.log(`🔎 Searching for user with email: ${customerEmail}`);
                const userQuery = admin.firestore().collection("users").where("email", "==", customerEmail);
                const snapshot = await userQuery.get();

                if (snapshot.empty) {
                    console.error(`❌ No user found with email: ${customerEmail}`);
                } else {
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
                }
            } catch (firebaseErr) {
                console.error("❌ Error updating Firestore:", firebaseErr.message);
                return res.status(500).send(`Firestore Error: ${firebaseErr.message}`);
            }
        } else {
            console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).send("Webhook received and processed successfully.");
    } catch (err) {
        console.error("❌ Webhook Error:", err.message);
        res.status(500).send(`Webhook Error: ${err.message}`);
    }
}