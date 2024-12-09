import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Creator from "../components/Creator";
import DemoComponent from "../components/DemoComponent";
import HowItWorks from "../components/HowItWorks";
import SupportComponent from "../components/SupportComponent";
import { FaGlobe } from "react-icons/fa";
import "../styles/global.css";

const HomePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const demoSectionRef = useRef(null);

    // Toggle theme function
    const toggleTheme = () => {
        const newTheme = isDarkMode ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        setIsDarkMode(isDarkMode);
    };

    const scrollToDemo = () => {
        if (demoSectionRef.current) {
            demoSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const dots = document.querySelectorAll(".dot");

        const pulseRandomDot = () => {
            const randomIndex = Math.floor(Math.random() * dots.length);
            const randomDot = dots[randomIndex];

            if (!randomDot.classList.contains("animated")) {
                randomDot.classList.add("animated");

                // Remove the animation after a random duration
                setTimeout(() => {
                    randomDot.classList.remove("animated");
                }, Math.random() * 3000 + 1000); // Between 1-4 seconds
            }
        };

        // Trigger random pulsing every 500ms
        const interval = setInterval(pulseRandomDot, 500);

        return () => {
            clearInterval(interval); // Cleanup interval on component unmount
        };
    }, []);

    return (
        <div
            style={{
                position: "relative",
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                transition: "background-color 0.3s ease, color 0.3s ease",
                overflow: "hidden",
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
                    position: "relative",
                    zIndex: 1, // Higher z-index for content
                }}
            >
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                {/* Creator Section */}
                <div
                    className="container"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minHeight: "calc(90vh - 80px)",
                        justifyContent: "center",
                        padding: "0% 15%",
                    }}
                >
                    <Creator isDarkMode={!isDarkMode} scrollToDemo={scrollToDemo} />
                </div>

                {/* Main Content Sections
                <div ref={demoSectionRef} style={{ padding: "5% 15%" }}>
                    <DemoComponent isDarkMode={isDarkMode} />
                    <HowItWorks isDarkMode={isDarkMode} />
                    <div style={{ margin: "50px 0" }} />
                    <SupportComponent isDarkMode={!isDarkMode} />
                </div> */}

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
        </div>
    );
};

export default HomePage;