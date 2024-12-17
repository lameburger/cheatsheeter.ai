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

        // Construct Stripe Event
        const event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log("Stripe Webhook Event:", event);

        // Handle checkout.session.completed
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const customerEmail = session.customer_details?.email;

            if (!customerEmail) {
                console.error("Customer email is missing in the session data.");
                return res.status(400).send("Missing customer email.");
            }

            console.log(`Updating subscription for user: ${customerEmail}`);

            // Update the user document in Firebase
            const userQuery = admin.firestore().collection("users").where("email", "==", customerEmail);
            const snapshot = await userQuery.get();

            if (!snapshot.empty) {
                snapshot.forEach(async (doc) => {
                    await doc.ref.update({
                        subscriptionType: "premium",
                        subscriptionStart: admin.firestore.Timestamp.now(),
                    });
                });
                console.log(`Subscription updated for user: ${customerEmail}`);
            } else {
                console.error(`No user found with email: ${customerEmail}`);
            }
        }

        res.status(200).send("Webhook received and processed successfully.");
    } catch (err) {
        console.error("Webhook error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}