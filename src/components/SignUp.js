// SignUp.js
import React, { useState } from "react";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google User:", result.user);
        } catch (error) {
            setError(error.message);
        }
    };

    // GitHub Sign-In
    const handleGithubSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            console.log("GitHub User:", result.user);
        } catch (error) {
            setError(error.message);
        }
    };

    // Email/Password Sign-Up
    const handleEmailSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Email User:", userCredential.user);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Sign Up</h2>
            <button onClick={handleGoogleSignIn} style={{ margin: "10px", padding: "10px" }}>
                Sign Up with Google
            </button>
            <button onClick={handleGithubSignIn} style={{ margin: "10px", padding: "10px" }}>
                Sign Up with GitHub
            </button>
            <div style={{ marginTop: "20px" }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ margin: "5px", padding: "10px" }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ margin: "5px", padding: "10px" }}
                />
                <button onClick={handleEmailSignUp} style={{ margin: "10px", padding: "10px" }}>
                    Sign Up with Email
                </button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default SignUp;