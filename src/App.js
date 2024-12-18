import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import Demo from "./pages/Demo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import "./styles/global.css";
import "./styles/theme.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createUserDocument } from "./services/userService";

function App() {
    const [theme, setTheme] = useState("dark");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Theme toggle function
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    // Track authentication state and create user document
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    await createUserDocument(currentUser);
                } catch (error) {
                    console.error("Error creating user document:", error);
                }
            } else {
                setUser(null);
            }
            setLoading(false); // Set loading to false after auth state is determined
        });

        return () => unsubscribe(); // Cleanup on component unmount
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontFamily: "'JetBrains Mono', monospace",
                }}
            >
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage toggleTheme={toggleTheme} isDarkMode={theme === "dark"} user={user} />
                    }
                />
                <Route
                    path="/account"
                    element={
                        <AccountPage user={user} isDarkMode={theme === "dark"} toggleTheme={toggleTheme} />
                    }
                />
                <Route
                    path="/demo"
                    element={
                        <Demo/>
                    }
                />
                <Route
                    path="/privacyPolicy"
                    element={
                        <PrivacyPolicy/>
                    }
                />
                <Route
                    path="/terms"
                    element={
                        <Terms/>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;