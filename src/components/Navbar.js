import React, { useState } from "react";
import { FaSun, FaMoon, FaRegFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import SignUp from "./SignUp";

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );
    const auth = getAuth();
    const navigate = useNavigate();

    const handleThemeToggle = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        setIsDarkMode(!isDarkMode);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme); // Persist theme state
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate("/"); // Redirect to home page after sign-out
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleSignInOrSignUp = async (email, password, isSignUp = false) => {
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            setIsModalOpen(false); // Close modal after successful sign-in or sign-up
        } catch (error) {
            console.error("Error signing in or signing up:", error);
        }
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 15%",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}
        >
            {/* Logo and Website Name */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "4px",
                        backgroundColor: "var(--text)",
                    }}
                >
                    <FaRegFileAlt style={{ width: "24px", height: "24px", color: "var(--bg)" }} />
                </div>
                <span
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "var(--text)",
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
                    placeholder="Search for cheat sheets..."
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
                        transition: "border-color 0.3s ease",
                    }}
                />
            </div>

            {/* Menu Items */}
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                {/* Theme Toggle Icon */}
                <button
                    onClick={handleThemeToggle}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "4px",
                        padding: "10px",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: "var(--text)",
                        transition: "color 0.3s ease",
                    }}
                >
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                </button>

                {/* Sign In/Sign Up or Account/Sign Out Buttons */}
                {auth.currentUser ? (
                    <>
                        <button
                            onClick={() => navigate("/account")}
                            style={{
                                padding: "10px 15px",
                                backgroundColor: "grey",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "0.9rem",
                                fontWeight: "700",
                                cursor: "pointer",
                                color: "var(--box-bg)",
                                fontFamily: "'JetBrains Mono', monospace",
                                transition: "background-color 0.3s ease",
                            }}
                        >
                            Account
                        </button>
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
                            }}
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "var(--primary)",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            color: "var(--bg)",
                            fontFamily: "'JetBrains Mono', monospace",
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        Sign Up
                    </button>
                )}
            </div>

            {/* Sign Up Modal */}
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "1000",
                    }}
                >
                    <div
                        style={{
                            background: "var(--box-bg)",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "400px",
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                background: "none",
                                border: "none",
                                float: "right",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                color: "var(--text)",
                            }}
                        >
                            ×
                        </button>
                        <SignUp onSignInOrSignUp={handleSignInOrSignUp} />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;