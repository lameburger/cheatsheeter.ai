import React from "react";



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
                    Welcome to Cheatsheeter.ai
                </h1>
                <p style={{ fontSize: "1.5rem", marginTop: "10px", opacity: 0.8 }}>
                    A smarter way to generate and manage cheat sheets.
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
                    intelligent backend process the content into beautifully formatted
                    cheat sheets. Whether you're studying for exams or preparing for
                    presentations, we've got you covered.
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
                    Unlike traditional tools, Cheatsheeter.ai generates clean, concise,
                    and visually appealing cheat sheets with minimal effort. Our unique
                    backend leverages AI-powered summarization and PDF/image parsing to
                    ensure that you get the best output, tailored to your needs.
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
                    How the Backend Works
                </h2>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", opacity: 0.9 }}>
                    Our backend utilizes state-of-the-art natural language processing
                    (NLP) to analyze and summarize content. We seamlessly integrate with
                    Firestore for data management and employ tools like{" "}
                    <strong>html2canvas</strong> and <strong>jsPDF</strong> to create
                    high-quality cheat sheet previews and downloadable files.
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
                    [ Video Placeholder ]
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
    );
};

export default Demo;