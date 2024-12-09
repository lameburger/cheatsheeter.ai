import React from "react";

const SubscriptionUpgradeModal = ({ isOpen, onClose, onUpgrade }) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "1000",
            }}
        >
            <div
                style={{
                    backgroundColor: "var(--box-bg)",
                    borderRadius: "12px",
                    width: "90%",
                    maxWidth: "800px",
                    padding: "30px",
                    textAlign: "center",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                    fontFamily: "'JetBrains Mono', monospace",
                    border: "2px solid var(--border)",
                }}
            >
                <h2
                    style={{
                        fontSize: "2rem",
                        marginBottom: "20px",
                        color: "var(--primary)",
                        borderBottom: "2px solid var(--primary)",
                        paddingBottom: "10px",
                    }}
                >
                    Upgrade to Premium
                </h2>

                <p
                    style={{
                        fontSize: "1.2rem",
                        color: "var(--bg)",
                        marginBottom: "30px",
                        lineHeight: "1.6",
                    }}
                >
                    Unlock unlimited cheat sheet creation and exclusive access to our premium bank of expertly crafted templates.
                </p>

                {/* Features Section */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                        marginBottom: "30px",
                    }}
                >
                    <div
                        style={{
                            padding: "20px",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            backgroundColor: "var(--box-bg)",
                        }}
                    >
                        <h3 style={{ marginBottom: "10px", color: "var(--primary)" }}>
                            Unlimited Usage
                        </h3>
                        <p style={{ fontSize: "1rem", color: "var(--bg)" }}>
                            Create as many cheat sheets as you need, whenever you need them.
                        </p>
                    </div>
                    <div
                        style={{
                            padding: "20px",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            backgroundColor: "var(--box-bg)",
                        }}
                    >
                        <h3 style={{ marginBottom: "10px", color: "var(--primary)" }}>
                            Premium Templates
                        </h3>
                        <p style={{ fontSize: "1rem", color: "var(--bg)" }}>
                            Access a curated library of pre-made, high-quality templates.
                        </p>
                    </div>
                    <div
                        style={{
                            padding: "20px",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            backgroundColor: "var(--box-bg)",
                        }}
                    >
                        <h3 style={{ marginBottom: "10px", color: "var(--primary)" }}>
                            Cancel Anytime
                        </h3>
                        <p style={{ fontSize: "1rem", color: "var(--bg)" }}>
                            Enjoy flexibility with no hidden fees or commitments.
                        </p>
                    </div>
                </div>

                {/* Pricing Section */}
                <div
                    style={{
                        padding: "20px",
                        borderRadius: "8px",
                        backgroundColor: "var(--box-bg)",
                        border: "2px solid var(--primary)",
                        marginBottom: "30px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "var(--primary)",
                    }}
                >
                    $2.99 / Month
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    <button
                        onClick={onUpgrade}
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            padding: "15px 30px",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "700",
                            color: "var(--bg)",
                            backgroundColor: "var(--primary)",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        Upgrade Now
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            padding: "15px 30px",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "700",
                            color: "var(--bg)",
                            backgroundColor: "transparent",
                            border: "1px solid var(--border)",
                            cursor: "pointer",
                            transition: "border-color 0.3s ease, color 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                            e.target.style.color = "var(--primary)";
                            e.target.style.borderColor = "var(--primary)";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.color = "var(--text)";
                            e.target.style.borderColor = "var(--border)";
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionUpgradeModal;