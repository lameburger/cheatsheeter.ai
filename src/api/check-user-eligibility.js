import { getFirestore, doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";

const db = getFirestore();

export const checkUserEligibility = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ eligible: false, message: "Invalid user." });
    }

    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return res.status(404).json({ eligible: false, message: "User not found." });
        }

        const userData = userDoc.data();
        const isFreemium = userData.subscriptionType === "freemium";

        // Check freemium limit
        if (isFreemium) {
            const lastCreated = userData.lastCheatSheetCreated?.toDate();
            const now = new Date();
            const isSameDay =
                lastCreated &&
                lastCreated.getFullYear() === now.getFullYear() &&
                lastCreated.getMonth() === now.getMonth() &&
                lastCreated.getDate() === now.getDate();

            if (isSameDay) {
                return res
                    .status(403)
                    .json({ eligible: false, message: "You can only create one cheat sheet per day on the freemium plan." });
            }

            // Update user's last cheat sheet creation time
            await updateDoc(userDocRef, {
                lastCheatSheetCreated: Timestamp.now(),
            });
        }

        return res.json({ eligible: true });
    } catch (error) {
        console.error("Error checking user eligibility:", error);
        res.status(500).json({ eligible: false, message: "Server error." });
    }
};