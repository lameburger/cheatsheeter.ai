export default function handler(req, res) {
    try {
        // Print all environment variables to the console
        console.log("Environment Variables:", process.env);

        // Prepare the response with all environment variables
        const envVariables = {
            REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
            REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            REACT_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
            REACT_APP_OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY,
            REACT_APP_GOOGLE_VISION_API_KEY: process.env.REACT_APP_GOOGLE_VISION_API_KEY,
            STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
            CLIENT_URL: process.env.CLIENT_URL,
            STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        };

        // Send the response
        res.status(200).json({
            message: "Environment variables fetched successfully!",
            variables: envVariables,
            method: req.method,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("API Test Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}