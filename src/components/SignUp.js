import React, { useState } from "react";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = ({ onClose }) => { // Add onClose as a prop
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google User:", result.user);
            onClose(); // Close the modal after success
        } catch (error) {
            setError(error.message);
        }
    };

    // GitHub Sign-In
    const handleGithubSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            console.log("GitHub User:", result.user);
            onClose(); // Close the modal after success
        } catch (error) {
            setError(error.message);
        }
    };

    // Email/Password Sign-Up
    const handleEmailSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Email User:", userCredential.user);
            onClose(); // Close the modal after success
        } catch (error) {
            setError(error.message);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        margin: "10px 0",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "1rem",
        backgroundColor: "var(--bg)",
        color: "var(--box-bg)",
        outline: "none",
        transition: "border-color 0.3s ease",
    };

    const buttonStyle = {
        padding: "12px 20px",
        margin: "10px",
        borderRadius: "8px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "1rem",
        fontWeight: "bold",
        color: "var(--bg)",
        backgroundColor: "var(--primary)",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    };

    const socialButtonStyle = {
        ...buttonStyle,
        backgroundColor: "transparent",
        border: "1px solid var(--bg)",
        color: "var(--bg)",
    };

    return (
        <div
            style={{
                backgroundColor: "var(--box-bg)",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                textAlign: "center",
                width: "100%",
                maxWidth: "400px",
                fontFamily: "'JetBrains Mono', monospace",
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
                Sign Up
            </h2>

            {/* Social Sign-In Buttons */}
            <button onClick={handleGoogleSignIn} style={socialButtonStyle}>
                Sign Up with Google
            </button>
            <button onClick={handleGithubSignIn} style={socialButtonStyle}>
                Sign Up with GitHub
            </button>

            {/* Divider */}
            <div
                style={{
                    margin: "20px 0",
                    height: "1px",
                    backgroundColor: "var(--border)",
                }}
            ></div>

            {/* Email/Password Sign-Up */}
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                />
                <button onClick={handleEmailSignUp} style={buttonStyle}>
                    Sign Up with Email
                </button>
            </div>

            {/* Error Message */}
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
    );
};

export default SignUp;