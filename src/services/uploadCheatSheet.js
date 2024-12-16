import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase';

const uploadCheatSheet = async (userId, cheatSheetId, cheatSheetFile, onProgress) => {
    return new Promise((resolve, reject) => {
        try {
            const storageRef = ref(storage, `users/${userId}/cheatSheets/${cheatSheetId}.pdf`);
            const uploadTask = uploadBytesResumable(storageRef, cheatSheetFile);

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
                    try {
                        const downloadURL = await getDownloadURL(storageRef);
                        console.log("CheatSheet uploaded successfully:", downloadURL);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error("Error getting download URL:", error);
                        reject(error);
                    }
                }
            );
        } catch (error) {
            console.error("Error in uploadCheatSheet:", error);
            reject(error);
        }
    });
};

export default uploadCheatSheet;