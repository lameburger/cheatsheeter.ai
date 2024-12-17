export default function handler(req, res) {
    try {
        // Respond with a success message
        res.status(200).json({
            message: "Vercel API is working!",
            method: req.method,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("API Test Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}