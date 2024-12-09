import React, { useEffect, useState } from "react";
import { FaUpload, FaEye, FaMagic, FaFilePdf } from "react-icons/fa";

const HowItWorks = () => {
    const [animateNodes, setAnimateNodes] = useState(false);

    const icons = [
        <FaUpload />,
        <FaEye />,
        <FaMagic />,
        <FaFilePdf />,
    ];

    const steps = [
        { label: "Upload Materials", description: "Upload PDFs or images of your notes." },
        { label: "Google Vision API", description: "Extract text and structures." },
        { label: "GPT LLM Processing", description: "Generate refined content." },
        { label: "LaTeX Cheatsheet", description: "Create a polished cheatsheet." },
    ];

    useEffect(() => {
        setTimeout(() => setAnimateNodes(true), 500);
    }, []);

    return (
        <div
            style={{
                padding: "40px 15%",
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--box-bg)",
                position: "relative",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    marginBottom: "40px",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                }}
            >
                What's happening in the background
            </h2>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                }}
            >
                {/* Connecting Line */}
                <div
                    style={{
                        position: "absolute",
                        top: "61%",
                        left: "5%",
                        width: "90%",
                        height: "4px",
                        backgroundColor: "var(--border)",
                        zIndex: 0,
                    }}
                ></div>

                {/* Nodes */}
                {steps.map((step, index) => (
                    <div
                        key={index}
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 1,
                            width: "20%",
                        }}
                    >
                        {/* Animated Circle Node */}
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                background: "var(--primary-gradient)", // Use gradient from themes.css
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "1.5rem",
                                color: "#fff",
                                fontWeight: "bold",
                                transition: `transform 0.5s ease ${index * 0.1}s`, // Delayed animation
                                transform: animateNodes ? "scale(1)" : "scale(0)",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                            }}
                        >
                            {icons[index]}
                        </div>
                        {/* Label */}
                        <div
                            style={{
                                marginTop: "10px",
                                textAlign: "center",
                                fontSize: "1rem",
                                fontWeight: "600",
                            }}
                        >
                            {step.label}
                        </div>
                        {/* Description */}
                        <div
                            style={{
                                marginTop: "5px",
                                textAlign: "center",
                                fontSize: "0.9rem",
                                fontWeight: "400",
                                color: "var(--text)",
                                maxWidth: "120px",
                            }}
                        >
                            {step.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;