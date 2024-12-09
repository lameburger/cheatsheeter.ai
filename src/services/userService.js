import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";

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