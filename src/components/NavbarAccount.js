import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const NavbarAccount = ({ user }) => {
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate("/"); 
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const iconStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "4px",
        transition: "background-color 0.3s ease, color 0.3s ease",
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 15%",
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--box-bg)", 
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}
        >
            {/* Logo and Website Name */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                }}
                onClick={() => navigate("/")}
            >
                <div style={{ ...iconStyle, backgroundColor: "var(--box-bg)" }}>
                    <FaRegFileAlt style={{ width: "24px", height: "24px", color: "var(--bg)" }} />
                </div>
                <span
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "var(--box-bg)",
                    }}
                >
                    CheatSheeter
                </span>
            </div>

            {/* Search Bar */}
            <div
                style={{
                    flex: "1",
                    margin: "0 20px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <input
                    type="text"
                    placeholder="Search your cheat sheets..."
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        padding: "10px 15px",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        color: "var(--bg)",
                        backgroundColor: "var(--box-bg)",
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                />
            </div>

            {/* User Profile */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "var(--box-bg)",
                    fontFamily: "'JetBrains Mono', monospace",
                }}
            >
                <span>{user?.email || "Logged In"}</span>
                <button
                    onClick={handleSignOut}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#d9534f",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.9rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        color: "var(--box-bg)",
                        fontFamily: "'JetBrains Mono', monospace",
                        transition: "background-color 0.3s ease, color 0.3s ease",
                    }}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

export default NavbarAccount;