import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUpModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            onClose(); // Close modal after successful signup
        } catch (err) {
            setError(err.message);
        }
    };

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
                    maxWidth: "400px",
                    padding: "30px",
                    textAlign: "center",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                    fontFamily: "'JetBrains Mono', monospace",
                    border: "2px solid var(--border)",
                }}
            >
                <h2
                    style={{
                        fontSize: "1.8rem",
                        marginBottom: "20px",
                        color: "var(--bg)",
                        borderBottom: "2px solid var(--bg)",
                        paddingBottom: "10px",
                    }}
                >
                    Sign u
                </h2>
                {error && (
                    <p style={{ color: "var(--primary)", marginBottom: "10px", fontSize: "0.9rem" }}>
                        {error}
                    </p>
                )}
                <form onSubmit={handleSignUp}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "12px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--box-bg)",
                            color: "var(--bg)",
                            fontSize: "1rem",
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "12px",
                            marginBottom: "20px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--box-bg)",
                            color: "var(--bg)",
                            fontSize: "1rem",
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            backgroundColor: "var(--primary)",
                            color: "var(--bg)",
                            fontSize: "1rem",
                            fontWeight: "700",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "var(--border)")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "var(--primary)")}
                    >
                        Sign Up
                    </button>
                </form>
                <button
                    onClick={onClose}
                    style={{
                        marginTop: "15px",
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        fontFamily: "'JetBrains Mono', monospace",
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
                        e.target.style.color = "var(--bg)";
                        e.target.style.borderColor = "var(--border)";
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SignUpModal;