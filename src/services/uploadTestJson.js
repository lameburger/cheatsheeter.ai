import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Adjust path as needed

const uploadTestJson = async (userId, cheatSheetId, jsonData, onProgress) => {
    try {
        if (!userId || !cheatSheetId) {
            throw new Error("User ID or Cheat Sheet ID is undefined.");
        }

        const storageRef = ref(storage, `users/${userId}/cheatSheets/${cheatSheetId}.json`);

        const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });

        const uploadTask = uploadBytesResumable(storageRef, jsonBlob);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                    if (onProgress) onProgress(progress);
                },
                (error) => {
                    console.error("Error during upload:", error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(storageRef);
                    console.log("Test JSON uploaded successfully:", downloadURL);
                    resolve(downloadURL);
                }
            );
        });
    } catch (error) {
        console.error("Error uploading test JSON:", error);
        throw error;
    }
};

const handleTestJsonUpload = async () => {
    try {
        const userId = "testUser123"; // Replace with actual user ID or fetch dynamically
        const cheatSheetId = `test-json-${Date.now()}`;

        const testData = {
            message: "This is a test JSON upload",
            timestamp: new Date().toISOString(),
        };

        const downloadURL = await uploadTestJson(userId, cheatSheetId, testData, (progress) => {
            console.log(`Upload progress: ${progress}%`);
        });

        console.log("Test JSON uploaded successfully. Download URL:", downloadURL);
        alert(`Test JSON uploaded successfully: ${downloadURL}`);
    } catch (error) {
        console.error("Error uploading test JSON:", error.message);
        alert(`Error uploading test JSON: ${error.message}`);
    }
};

export default handleTestJsonUpload;