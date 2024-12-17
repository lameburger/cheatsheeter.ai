import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Missing email in request." });
        }

        try {
            // Retrieve Stripe customer ID based on email
            const customers = await stripe.customers.list({ email, limit: 1 });
            if (!customers.data.length) {
                return res.status(404).json({ error: "No Stripe customer found with this email." });
            }

            const customer = customers.data[0];

            // Create a Customer Portal link
            const portalSession = await stripe.billingPortal.sessions.create({
                customer: customer.id,
                return_url: "https://cheatsheeter-ai.vercel.app/account", // Return to the account page
            });

            res.status(200).json({ url: portalSession.url });
        } catch (err) {
            console.error("Error generating Customer Portal link:", err.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}