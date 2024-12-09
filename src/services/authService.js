import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { createUserDocument } from "./userService";

const auth = getAuth();
const db = getFirestore();

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create user document in Firestore
    await createUserDocument(user);

    // Check if user already exists in Firestore
    const userDoc = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
        // If new user, create record with freemium subscription
        await setDoc(userDoc, {
            email: user.email,
            subscriptionType: "freemium",
            createdAt: new Date(),
            cheatSheetsCreated: 0,
        });
    }
};

export const checkSubscriptionStatus = async (userId) => {
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
        return userSnapshot.data().subscriptionType;
    }
    return null;
};