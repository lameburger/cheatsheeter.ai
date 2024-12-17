import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import NavbarAccount from "../components/NavbarAccount";
import { FaGlobe } from "react-icons/fa";
import SubscriptionUpgradeModal from "../components/SubscriptionUpgradeModal";

const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [accountInfo, setAccountInfo] = useState(null);
    const [cheatSheets, setCheatSheets] = useState([]);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [error, setError] = useState("");

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    setUser(currentUser);
                    const userDoc = doc(db, "users", currentUser.uid);
                    const userSnapshot = await getDoc(userDoc);

                    if (userSnapshot.exists()) {
                        const data = userSnapshot.data();
                        setAccountInfo(data);
                        setCheatSheets(data.cheatSheets || []);
                    } else {
                        setError("No account information found for this user.");
                    }
                } else {
                    setError("You must be logged in to view account information.");
                }
            } catch (err) {
                console.error("Error fetching account information:", err);
                setError("An error occurred while fetching account information.");
            }
        };

        fetchAccountInfo();
    }, []);

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
                    zIndex: 1, // Sets z-index to 1
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
                                    {accountInfo?.cheatSheetsCreatedToday || 0}
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

                            {/* Created Cheat Sheets Section */}
                            <div
                                style={{
                                    padding: "20px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    backgroundColor: "var(--box-bg)",
                                }}
                            >
                                <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>
                                    Created Cheat Sheets
                                </h3>
                                {cheatSheets.length > 0 ? (
                                    <ul style={{ listStyle: "none", padding: 0 }}>
                                        {cheatSheets.map((sheet, index) => (
                                            <li key={index} style={{ marginBottom: "10px" }}>
                                                <a
                                                    href={sheet.downloadLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: "var(--primary)",
                                                        textDecoration: "underline",
                                                    }}
                                                >
                                                    {sheet.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No cheat sheets created yet.</p>
                                )}
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
                        <span>© 2024 Cheatsheeter.ai</span>
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