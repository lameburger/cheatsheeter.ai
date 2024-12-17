import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Missing email in request body." });
    }

    try {
        // Retrieve Stripe customer ID based on email
        const customers = await stripe.customers.list({ email, limit: 1 });
        
        if (!customers || !customers.data.length) {
            console.error(`No Stripe customer found for email: ${email}`);
            return res.status(404).json({ error: "No Stripe customer found with this email." });
        }

        const customer = customers.data[0];
        console.log(`Stripe customer found: ${customer.id} for email: ${email}`);

        // Define the return URL
        const returnUrl = process.env.RETURN_URL || "https://cheatsheeter-ai.vercel.app/account";

        // Create a Customer Portal link
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: returnUrl,
        });

        console.log(`Customer portal link created: ${portalSession.url}`);
        return res.status(200).json({ url: portalSession.url });
    } catch (err) {
        console.error("Error generating Customer Portal link:", err.message);

        // Enhanced error response for debugging
        return res.status(500).json({ 
            error: "Internal Server Error",
            details: err.message, // Optional: for debugging purposes
        });
    }
}