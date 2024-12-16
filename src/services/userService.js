import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();
const db = getFirestore();

// Create a new user document in Firestore
export const createUserDocument = async (user) => {
    if (!user) return;

    const userDoc = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
            email: user.email,
            subscriptionType: "freemium",
            cheatSheetsCreatedToday: 0,
            lastCheatSheetCreated: null,
            createdAt: serverTimestamp(),
        });
    }
};

// Fetch the user's Firestore document
export const getUserDocument = async (user) => {
    if (!user) return null;

    const userDoc = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDoc);

    return userSnapshot.exists() ? userSnapshot.data() : null;
};

// Update the cheat sheet usage for a user
export const updateUserCheatSheetData = async (user) => {
    if (!user) return;

    const userDoc = doc(db, "users", user.uid);

    await updateDoc(userDoc, {
        cheatSheetsCreatedToday: increment(1), // Use Firestore's increment function
        lastCheatSheetCreated: serverTimestamp(),
    });
};

// Upgrade the user's subscription
export const upgradeSubscription = async (user) => {
    if (!user) return;

    const userDoc = doc(db, "users", user.uid);

    await updateDoc(userDoc, {
        subscriptionType: "premium",
    });
};

// Upload a cheat sheet to the user's bucket
export const uploadCheatSheetToUserBucket = async (user, cheatSheetHtml, fileName) => {
    if (!user) return;

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