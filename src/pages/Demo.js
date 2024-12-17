import React from "react";
import { FaGlobe } from "react-icons/fa";

const Demo = () => {
    return (
        <div
            style={{
                backgroundColor: "#000",
                color: "#fff",
                minHeight: "100vh",
                fontFamily: "'JetBrains Mono', monospace",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 20px",
                boxSizing: "border-box",
            }}
        >
            {/* Header Section */}
            <header style={{ textAlign: "center", marginBottom: "50px" }}>
                <h1 style={{ fontSize: "4rem", fontWeight: "bold", margin: 0 }}>
                    Cheatsheeter.ai
                </h1>
                <p style={{ fontSize: "1.5rem", marginTop: "10px", opacity: 0.8 }}>
                    A better way to study and review for exams
                </p>
            </header>

            {/* How the Website Works */}
            <section
                style={{
                    width: "100%",
                    maxWidth: "1000px",
                    marginBottom: "60px",
                    textAlign: "center",
                }}
            >
                <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
                    How It Works
                </h2>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", opacity: 0.9 }}>
                    Upload your files, select specific pages or slides, and let our
                    intelligent backend process the content into densely formatted
                    cheat sheets. Whether you're studying for exams or reviewinging
                    the generator has you covered.
                </p>
            </section>

            {/* Why It's Better */}
            <section
                style={{
                    width: "100%",
                    maxWidth: "1000px",
                    marginBottom: "60px",
                    textAlign: "center",
                }}
            >
                <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
                    Why It's Better
                </h2>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", opacity: 0.9 }}>
                    No more shitty AI generated review guides. Cheatsheeter takes any number
                    of lecture slides, hand written material, and course materials to summarize
                    based on user input into a single page of information (also allowing for notes).
                </p>
            </section>

            {/* Backend Explanation */}
            <section
                style={{
                    width: "100%",
                    maxWidth: "1000px",
                    marginBottom: "60px",
                    textAlign: "center",
                }}
            >
                <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
                    What you get
                </h2>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", opacity: 0.9 }}>
                    The freemium version of the site offers three freely generated cheat
                    sheets. Yes, this number is low, but so is my wallet so bear with me.
                    API costs are high and to maintain this site it isn't cheap. You can
                    get ulimited (yes, unlimited) generations of cheatsheets if you subscribe.
                </p>
            </section>

            {/* Video Placeholder */}
            <section
                style={{
                    width: "100%",
                    maxWidth: "800px",
                    textAlign: "center",
                    marginBottom: "40px",
                }}
            >
                <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
                    Watch it in Action
                </h2>
                <div
                    style={{
                        width: "100%",
                        height: "450px",
                        backgroundColor: "#333",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#aaa",
                        fontSize: "1.5rem",
                    }}
                >
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <video
                            width="100%"
                            controls
                            style={{ borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}
                        >
                            <source src="cheatsheet_demo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </section>

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
                        <span>© 2024 Cheatsheeter.com</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Demo;