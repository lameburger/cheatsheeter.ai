import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import NavbarAccount from "../components/NavbarAccount";
import SubscriptionUpgradeModal from "../components/SubscriptionUpgradeModal";
import SearchModal from "../components/SearchModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import html2canvas from "html2canvas";
import { FaGlobe, FaChevronLeft, FaChevronRight, FaLock } from "react-icons/fa";

const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [accountInfo, setAccountInfo] = useState(null);
    const [cheatSheets, setCheatSheets] = useState([]);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [error, setError] = useState("");
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [previews, setPreviews] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState(null);

    const auth = getAuth();
    const db = getFirestore();

    const fetchAccountInfo = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUser(currentUser);

                // Fetch cheat sheets where userId matches currentUser.uid
                const cheatSheetsRef = collection(db, "cheatSheets");
                const q = query(cheatSheetsRef, where("userId", "==", currentUser.uid));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const fetchedSheets = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setCheatSheets(fetchedSheets); // Set fetched cheat sheets
                } else {
                    setCheatSheets([]);
                }
            } else {
                setError("You must be logged in to view account information.");
            }
        } catch (err) {
            console.error("Error fetching cheat sheets:", err);
            setError("An error occurred while fetching your cheat sheets.");
        }
    };
    // Generate Previews for Cheat Sheets
    // Trigger generatePreviews whenever cheatSheets are updated
    useEffect(() => {
        const generatePreviews = async () => {
            const previewPromises = cheatSheets.map(async (sheet) => {
                const container = document.createElement("div");
                container.innerHTML = sheet.content;
                container.style.width = "300px";
                container.style.padding = "10px";
                container.style.backgroundColor = "white";
                document.body.appendChild(container);

                const canvas = await html2canvas(container, { scale: 0.3 });
                const imageUrl = canvas.toDataURL("image/png");
                document.body.removeChild(container);

                return { ...sheet, previewImage: imageUrl };
            });

            const results = await Promise.all(previewPromises);
            setPreviews(results);
        };

        if (cheatSheets.length > 0) {
            generatePreviews();
        }
    }, [cheatSheets]);

    useEffect(() => {
        fetchAccountInfo();
    }, []);

    // Handle Carousel Navigation
    const nextSlide = () => {
        setCarouselIndex((prevIndex) =>
            prevIndex === previews.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCarouselIndex((prevIndex) =>
            prevIndex === 0 ? previews.length - 1 : prevIndex - 1
        );
    };

    const handleCancelSubscription = async () => {
        setLoadingCancel(true);
        try {
            const response = await fetch("/api/createPortalLink", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
            });

            const data = await response.json();
            if (response.ok && data.url) {
                window.location.href = data.url; // Redirect to Stripe Customer Portal
            } else {
                console.error("Error:", data.error);
                alert("Failed to open subscription management. Please try again.");
            }
        } catch (error) {
            console.error("Error cancelling subscription:", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setLoadingCancel(false);
        }
    };

    if (error) {
        return (
            <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <NavbarAccount />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--bg)",
                color: "var(--bg)",
                fontFamily: "'JetBrains Mono', monospace",
            }}
        >

            <div
                className="dots-background"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0, // Lower z-index for dots
                }}
            >
                {Array.from({ length: 2000 }).map((_, i) => (
                    <div key={i} className="dot"></div>
                ))}
            </div>
            <div
                style={{
                    width: "100%",
                    position: "sticky", // Ensures the navbar stays at the top when scrolling
                    top: 0,
                    zIndex: 999, // Sets z-index to 1
                }}
            >
                <NavbarAccount />
            </div>


            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    zIndex: 1, // Sets z-index to 1

                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "900px",
                        padding: "40px",
                        borderRadius: "12px",
                        backgroundColor: "var(--box-bg)",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <h2
                        style={{
                            textAlign: "center",
                            marginBottom: "30px",
                            color: "var(--bg)",
                        }}
                    >
                        Account Details
                    </h2>

                    {user && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gap: "20px",
                            }}
                        >
                            {/* User Information Section */}
                            <div
                                style={{
                                    padding: "20px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    backgroundColor: "var(--box-bg)",
                                }}
                            >
                                <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>
                                    User Information
                                </h3>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p>
                                    <strong>Account Created:</strong> {user.metadata.creationTime}
                                </p>
                            </div>

                            {/* Subscription Status Section */}
                            <div
                                style={{
                                    padding: "20px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    backgroundColor: "var(--box-bg)",
                                }}
                            >
                                <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>
                                    Subscription Status
                                </h3>
                                <p>
                                    <strong>Status:</strong> {accountInfo?.subscriptionType || "Unknown"}
                                </p>
                                <p>
                                    <strong>Cheat Sheets Created:</strong>{" "}
                                    {typeof accountInfo?.cheatSheetsCreatedToday === "object"
                                        ? Object.values(accountInfo.cheatSheetsCreatedToday).reduce((sum, count) => sum + count, 0)
                                        : 0}
                                </p>

                                {accountInfo?.subscriptionType === "premium" ? (
                                    <button
                                        onClick={handleCancelSubscription}
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontWeight: "bold",
                                            marginTop: "10px",
                                            padding: "10px 20px",
                                            borderRadius: "8px",
                                            fontSize: "1rem",
                                            color: "white",
                                            backgroundColor: "red",
                                            border: "none",
                                            cursor: "pointer",
                                            boxShadow: "0 0 10px red, 0 0 20px red",
                                        }}
                                    >
                                        Cancel Subscription
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsUpgradeModalOpen(true)}
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontWeight: "bold",
                                            marginTop: "10px",
                                            padding: "10px 20px",
                                            borderRadius: "8px",
                                            fontSize: "1rem",
                                            color: "var(--bg)",
                                            backgroundColor: "var(--primary)",
                                            border: "none",
                                            cursor: "pointer",
                                            boxShadow: "0 0 10px var(--primary), 0 0 20px var(--primary)",
                                        }}
                                    >
                                        Upgrade Subscription
                                    </button>
                                )}
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", // Responsive grid
                                    gap: "20px", // Spacing between grid items
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}
                            >
                                {previews.map((sheet, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            padding: "10px",
                                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                            backgroundColor: "#fff",
                                            cursor: "pointer",
                                            transition: "transform 0.2s ease",
                                        }}
                                        onClick={() => setSelectedSheet(sheet)}
                                    >
                                        <img
                                            src={sheet.previewImage}
                                            alt="Cheat Sheet Preview"
                                            style={{
                                                width: "100%",
                                                maxHeight: "100px",
                                                objectFit: "contain",
                                                borderRadius: "4px",
                                            }}
                                        />
                                        <div style={{ marginTop: "8px", fontSize: "0.9rem" }}>
                                            <strong>{sheet.school || "Unknown School"}</strong><br />
                                            {sheet.classInfo && <span>Class: {sheet.classInfo}</span>}<br />
                                            {sheet.testInfo && <span>Test: {sheet.testInfo}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isUpgradeModalOpen && (
                <SubscriptionUpgradeModal
                    isOpen={isUpgradeModalOpen}
                    onClose={() => setIsUpgradeModalOpen(false)}
                />
            )}

            {/* Modal for Cheat Sheet */}
            {selectedSheet && (
                <SearchModal
                    sheet={selectedSheet}
                    onClose={() => setSelectedSheet(null)}
                />
            )}
            {/* Footer */}
            <footer
                style={{
                    color: "var(--box-bg)",
                    padding: "20px",
                    textAlign: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.9rem",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    {/* Left Section */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaGlobe
                            style={{
                                fontSize: "1.5rem",
                                color: "var(--primary)",
                            }}
                        />
                        <span>© 2024 Cheatsheeter.com</span>
                    </div>

                    {/* Right Section */}
                    <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                        <a
                            href="/privacy"
                            style={{
                                textDecoration: "none",
                                color: "var(--primary)",
                                fontWeight: "bold",
                            }}
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="/terms"
                            style={{
                                textDecoration: "none",
                                color: "var(--primary)",
                                fontWeight: "bold",
                            }}
                        >
                            Terms of Service
                        </a>
                        <a
                            href="/"
                            style={{
                                textDecoration: "none",
                                color: "var(--primary)",
                                fontWeight: "bold",
                            }}
                        >
                            Cheatsheeter
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AccountPage;