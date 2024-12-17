import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();
const db = getFirestore();

// Create a new user document in Firestore
export const createUserDocument = async (user) => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        // Create the user document with required fields
        await setDoc(userDocRef, {
            email: user.email || "unknown",
            subscriptionType: "freemium", // Set default subscription type
            totalCheatSheetsCreated: 0,
            lastCheatSheetCreated: null,
            createdAt: serverTimestamp(),
        });
        console.log("✅ User document initialized");
    } else {
        console.log("⚠️ User document already exists");
    }
};

// Fetch the user's Firestore document
// Fetch the user's Firestore document
export const getUserDocument = async (user) => {
    if (!user) return null;

    const userDoc = doc(db, "users", user.uid);
    try {
        const userSnapshot = await getDoc(userDoc);
        return userSnapshot.exists() ? userSnapshot.data() : null;
    } catch (error) {
        console.error("Error fetching user document:", error.message);
        throw new Error("Failed to fetch user document.");
    }
};

// Update the cheat sheet usage for a user
export const updateUserCheatSheetData = async (user) => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    try {
        await updateDoc(userDocRef, {
            cheatSheetsCreatedToday: { [today]: increment(1) }, // Ensure it exists
            lastCheatSheetCreated: serverTimestamp(),
        });
        console.log("User cheat sheet data updated successfully");
    } catch (error) {
        console.error("Error updating cheat sheet data:", error.message);
        throw new Error("Failed to update cheat sheet data.");
    }
};

// Upgrade the user's subscription
export const upgradeSubscription = async (user) => {
    if (!user) return;

    const userDoc = doc(db, "users", user.uid);

    await updateDoc(userDoc, {
        subscriptionType: "premium",
    });
};

export const uploadCheatSheetToUserBucket = async (user, cheatSheetHtml, fileName) => {
    if (!user) return;

    if (!cheatSheetHtml || !fileName) {
        throw new Error("Invalid cheat sheet content or file name.");
    }

    const userBucketRef = ref(storage, `users/${user.uid}/${fileName}.html`);

    try {
        const cheatSheetBlob = new Blob([cheatSheetHtml], { type: "text/html" });
        await uploadBytes(userBucketRef, cheatSheetBlob);
        console.log(`Cheat sheet uploaded to user bucket: users/${user.uid}/${fileName}.html`);
    } catch (error) {
        console.error("Error uploading cheat sheet:", error);
        throw new Error("Failed to upload cheat sheet.");
    }
};

// Upload a cheat sheet to the global bucket with metadata
export const uploadCheatSheetToGlobalBucket = async (cheatSheetHtml, metadata, fileName) => {
    const globalBucketRef = ref(storage, `global-cheatsheets/${fileName}.html`);

    try {
        const cheatSheetBlob = new Blob([cheatSheetHtml], { type: "text/html" });
        await uploadBytes(globalBucketRef, cheatSheetBlob);
        console.log(`Cheat sheet uploaded to global bucket: global-cheatsheets/${fileName}.html`);
    } catch (error) {
        console.error("Error uploading to global bucket:", error);
        throw new Error("Failed to upload cheat sheet to global bucket.");
    }
};