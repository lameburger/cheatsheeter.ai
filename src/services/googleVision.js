import axios from "axios";

const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.REACT_APP_GOOGLE_VISION_API_KEY}`;

const extractTextFromImage = async (file) => {
    try {
        // Convert the image file to base64
        const base64 = await fileToBase64(file);

        // Request payload
        const payload = {
            requests: [
                {
                    image: { content: base64 },
                    features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
                },
            ],
        };

        // Send request to Google Vision API
        const response = await axios.post(GOOGLE_VISION_API_URL, payload);
        const detections = response.data.responses[0].textAnnotations;

        return detections && detections.length > 0 ? detections[0].description : "";
    } catch (error) {
        console.error("Error extracting text from image:", error.message);
        throw new Error("Failed to extract text from the image.");
    }
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]); // Remove metadata
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file); // Convert file to base64
    });
};

export default extractTextFromImage;