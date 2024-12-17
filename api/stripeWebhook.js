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
        bodyParser: false, // Required for Stripe to process raw body
    },
};

export default async function handler(req, res) {
    const sig = req.headers["stripe-signature"];

    try {
        const rawBody = await buffer(req); // Use buffer to get raw body

        console.log("Raw Body:", rawBody.toString());
        console.log("Stripe Signature:", sig);

        const event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log("Stripe Event Received:", event);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            // Extract metadata or session details
            const customerEmail = session.customer_details?.email;

            console.log("Customer Email:", customerEmail);

            if (customerEmail) {
                const userQuery = admin.firestore().collection("users").where("email", "==", customerEmail);
                const snapshot = await userQuery.get();

                if (!snapshot.empty) {
                    snapshot.forEach(async (doc) => {
                        await doc.ref.update({
                            subscriptionType: "premium",
                            subscriptionStart: admin.firestore.Timestamp.now(),
                        });
                    });
                    console.log(`User ${customerEmail} updated to premium.`);
                } else {
                    console.log(`No user found with email: ${customerEmail}`);
                }
            }
        }

        res.status(200).send("Webhook received successfully.");
    } catch (err) {
        console.error("Webhook Error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}