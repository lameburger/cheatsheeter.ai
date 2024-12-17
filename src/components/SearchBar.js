import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, startAt, endAt, doc, getDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import { db } from "../firebase";
import SearchModal from "./SearchModal";
import { FaLock } from "react-icons/fa";

const SearchBar = ({ user }) => {
    const [searchInput, setSearchInput] = useState("");
    const [results, setResults] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [subscriptionType, setSubscriptionType] = useState(null);

    // Fetch user subscription type
    useEffect(() => {
        const fetchSubscription = async () => {
            if (user?.uid) {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                setSubscriptionType(userDocSnap.exists() ? userDocSnap.data().subscriptionType : "freemium");
            }
        };
        fetchSubscription();
    }, [user]);

    // Generate preview image with html2canvas
    const generatePreviewImage = async (content) => {
        const container = document.createElement("div");
        container.innerHTML = content;
        container.style.width = "300px"; // Small preview width
        container.style.padding = "10px";
        container.style.backgroundColor = "white";
        container.style.fontFamily = "Arial, sans-serif";
        document.body.appendChild(container);

        const canvas = await html2canvas(container, { scale: 0.3 });
        const imageUrl = canvas.toDataURL("image/png");

        document.body.removeChild(container);
        return imageUrl;
    };

    // Fetch cheat sheets and generate previews
    const fetchCheatSheets = async (input) => {
        if (!input.trim()) {
            setResults([]);
            return;
        }
    
        const lowercaseInput = input.toLowerCase(); // Convert input to lowercase
    
        try {
            const cheatsheetsRef = collection(db, "cheatSheets");
    
            // Perform case-insensitive queries by using lowercase fields
            const queries = [
                query(
                    cheatsheetsRef,
                    orderBy("school_lower"),
                    startAt(lowercaseInput),
                    endAt(lowercaseInput + "\uf8ff")
                ),
                query(
                    cheatsheetsRef,
                    orderBy("classInfo_lower"),
                    startAt(lowercaseInput),
                    endAt(lowercaseInput + "\uf8ff")
                ),
                query(
                    cheatsheetsRef,
                    orderBy("testInfo_lower"),
                    startAt(lowercaseInput),
                    endAt(lowercaseInput + "\uf8ff")
                ),
            ];
    
            const searchResults = new Map();
    
            for (const q of queries) {
                const snapshot = await getDocs(q);
    
                for (const docSnap of snapshot.docs) {
                    const sheetData = { id: docSnap.id, ...docSnap.data() };
    
                    if (!searchResults.has(sheetData.id)) {
                        const previewImage = await generatePreviewImage(sheetData.content);
                        searchResults.set(sheetData.id, { ...sheetData, previewImage });
                    }
                }
            }
    
            setResults(Array.from(searchResults.values()));
        } catch (error) {
            console.error("Error fetching cheat sheets:", error.message);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchInput) fetchCheatSheets(searchInput);
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [searchInput]);

    return (
        <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
            {!user ? (
                // Show a disabled search bar for non-logged-in users
                <div
                    style={{
                        color: "#aaa",
                        backgroundColor: "#f0f0f0",
                        textAlign: "center",
                        padding: "10px",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        cursor: "not-allowed",
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    Please log in to search cheat sheets
                </div>
            ) : (
                <>
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search cheat sheets..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{
                            color: "black",
                            width: "100%",
                            padding: "10px",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    />

                    {/* Display Search Results Only If Input Is Not Empty */}
                    {searchInput.trim() && results.length > 0 && (
                        <div
                            style={{
                                color: "black",
                                position: "absolute",
                                top: "100%",
                                left: "0",
                                right: "0",
                                backgroundColor: "#fff",
                                border: "1px solid var(--border)",
                                borderRadius: "4px",
                                zIndex: 1000,
                                maxHeight: "300px",
                                overflowY: "auto",
                            }}
                        >
                            {results.map((sheet) => (
                                <div
                                    key={sheet.id}
                                    onClick={() =>
                                        subscriptionType === "premium"
                                            ? setSelectedSheet(sheet)
                                            : alert("Upgrade to premium to access this cheat sheet.")
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "10px",
                                        borderBottom: "1px solid var(--border)",
                                        cursor: "pointer",
                                    }}
                                >
                                    {/* Display the Preview Image */}
                                    {sheet.previewImage && (
                                        <img
                                            src={sheet.previewImage}
                                            alt="Preview"
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    )}
                                    <div>
                                        <strong>
                                            {sheet.school} - {sheet.classInfo}
                                        </strong>
                                        <p style={{ fontSize: "0.9rem", color: "#555" }}>
                                            {sheet.testInfo}
                                        </p>
                                    </div>
                                    {subscriptionType !== "premium" && <FaLock color="red" />}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {selectedSheet && (
                <SearchModal
                    sheet={selectedSheet}
                    onClose={() => setSelectedSheet(null)}
                />
            )}
        </div>
    );
};

export default SearchBar;