import React from "react";
import { FaHeart, FaCrown, FaUserGraduate, FaGift } from "react-icons/fa";

const SupportComponent = ({ isDarkMode }) => {
    const colors = {
        light: {
            background: "white",
            text: "#333",
            border: "#ccc",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            primary: "#32CD32",
        },
        dark: {
            background: "black",
            text: "#fff",
            border: "#444",
            boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
            primary: "#32CD32",
        },
    };

    const currentColors = isDarkMode ? colors.dark : colors.light;

    return (
        <div
            style={{
                padding: "20px",
                paddingTop: "20px",
                margin: "0 auto",
                maxWidth: "900px",
                borderRadius: "12px",
                backgroundColor: currentColors.background,
                color: currentColors.text,
                boxShadow: currentColors.boxShadow,
                fontFamily: "'JetBrains Mono', monospace",
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
        >
            {/* Freemium Option */}
            <div
                style={{
                    padding: "20px",
                    paddingTop: "20%",
                    borderRadius: "12px",
                    border: `1px solid ${currentColors.border}`,
                    boxShadow: currentColors.boxShadow,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                }}
            >
                <FaUserGraduate
                    size={50}
                    style={{
                        color: currentColors.primary,
                    }}
                />
                <h3
                    style={{
                        fontSize: "1.5rem",
                        marginBottom: "10px",
                        fontWeight: "bold",
                    }}
                >
                    Freemium Tier
                </h3>
                <ul
                    style={{
                        listStyle: "none",
                        padding: "0",
                        margin: "0",
                        fontSize: "1rem",
                        textAlign: "left",
                        width: "100%",
                        maxWidth: "300px",
                    }}
                >
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <FaGift style={{ marginRight: "8px", color: currentColors.primary }} />
                        2 free cheatsheets per month
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <FaGift style={{ marginRight: "8px", color: currentColors.primary }} />
                        Limited access to pre-made templates
                    </li>
                    <li style={{ display: "flex", alignItems: "center" }}>
                        <FaGift style={{ marginRight: "8px", color: currentColors.primary }} />
                        Upgrade anytime for more features
                    </li>
                </ul>
            </div>

            {/* Subscription Plans */}
            <div
                style={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: `1px solid ${currentColors.border}`,
                    boxShadow: currentColors.boxShadow,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                }}
            >
                <FaCrown
                    size={50}
                    style={{
                        color: currentColors.primary,
                    }}
                />
                <h3
                    style={{
                        fontSize: "1.5rem",
                        marginBottom: "10px",
                        fontWeight: "bold",
                    }}
                >
                    Subscription Plans
                </h3>
                <div
                    style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: currentColors.primary,
                        marginBottom: "15px",
                    }}
                >
                    $2.99 per month
                </div>
                <ul
                    style={{
                        listStyle: "none",
                        padding: "0",
                        margin: "0",
                        fontSize: "1rem",
                        textAlign: "left",
                        width: "100%",
                        maxWidth: "300px",
                    }}
                >
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <FaGift style={{ marginRight: "8px", color: currentColors.primary }} />
                        Priority access to features
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <FaGift style={{ marginRight: "8px", color: currentColors.primary }} />
                        Custom templates
                    </li>
                    <li style={{ display: "flex", alignItems: "center" }}>
                        <FaGift style={{ marginRight: "8px", color: currentColors.primary }} />
                        Enhanced formatting options
                    </li>
                </ul>
                <button
                    style={{
                        padding: "10px 20px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: "#fff",
                        fontFamily: "'JetBrains Mono', monospace",
                        backgroundColor: currentColors.primary,
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#388e3c")
                    }
                    onMouseOut={(e) =>
                        (e.target.style.backgroundColor = currentColors.primary)
                    }
                >
                    Sign Up
                </button>
            </div>

            {/* Donation Option */}
            <div
                style={{
                    padding: "15px",
                    paddingTop: "40%",
                    borderRadius: "12px",
                    border: `1px solid ${currentColors.border}`,
                    boxShadow: currentColors.boxShadow,
                    textAlign: "center",
                }}
            >
                <FaHeart
                    size={40}
                    style={{
                        color: currentColors.primary,
                        marginBottom: "10px",
                    }}
                />
                <h3 style={{ fontSize: "1.2rem", marginBottom: "8px"  }}>
                    Make a Donation
                </h3>
                <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                    Help maintain the site by donating. Every bit helps!
                </p>
                <button
                    style={{
                        padding: "10px 20px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#fff",
                        backgroundColor: currentColors.primary,
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#388e3c")
                    }
                    onMouseOut={(e) =>
                        (e.target.style.backgroundColor = currentColors.primary)
                    }
                >
                    Donate Now
                </button>
            </div>
        </div>
    );
};

export default SupportComponent;