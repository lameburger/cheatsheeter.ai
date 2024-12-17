import Stripe from "stripe";
import { buffer } from "micro";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
    });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false, // Stripe requires raw body
    },
};

export default async function handler(req, res) {
    const sig = req.headers["stripe-signature"];

    try {
        const rawBody = await buffer(req);

        console.log("Raw Body:", rawBody.toString());
        console.log("Stripe Signature:", sig);

        const event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log("Event received:", event);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            const userEmail = session.customer_details.email;
            console.log("Customer email:", userEmail);

            const userQuery = admin.firestore().collection("users").where("email", "==", userEmail);
            const snapshot = await userQuery.get();

            if (!snapshot.empty) {
                snapshot.forEach(async (doc) => {
                    await doc.ref.update({
                        subscriptionType: "premium",
                        subscriptionStart: admin.firestore.Timestamp.now(),
                    });
                });
                console.log(`Subscription updated for user with email: ${userEmail}`);
            } else {
                console.log(`No user found with email: ${userEmail}`);
            }
        }

        res.status(200).send("Webhook received successfully.");
    } catch (err) {
        console.error("Webhook error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}