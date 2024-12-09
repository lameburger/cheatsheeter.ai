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
            onClose(); // Close the modal on success
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "30px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
            }}
        >
            <h2 style={{ marginBottom: "20px", fontFamily: "'JetBrains Mono', monospace" }}>
                Sign Up
            </h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
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
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "1rem",
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
                        padding: "10px",
                        marginBottom: "20px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Sign Up
                </button>
            </form>
            <button
                onClick={onClose}
                style={{
                    marginTop: "10px",
                    backgroundColor: "red",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    cursor: "pointer",
                }}
            >
                Close
            </button>
        </div>
    );
};

export default SignUpModal;