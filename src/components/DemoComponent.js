import React, { useEffect, useState, useRef } from "react";

const DemoComponent = ({ isDarkMode }) => {
    const [isVisible, setIsVisible] = useState(false); // Visibility state for animations
    const sectionRef = useRef(null); // Reference to the entire section

    const colors = {
        light: {
            background: "#ffffff",
            text: "#000000",
            border: "#ccc",
        },
        dark: {
            background: "#000000",
            text: "#ffffff",
            border: "#444",
        },
    };

    const currentColors = isDarkMode ? colors.dark : colors.light;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 } // Trigger animation when 10% of the section is visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={sectionRef}
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: "calc(100vh - 80px)",
                padding: "0 15%", // 15% padding on both sides
                gap: "40px",
                opacity: isVisible ? 1 : 0, // Fade-in/out effect
                transform: isVisible ? "translateY(0)" : "translateY(50px)", // Slide effect
                transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
        >
            {/* Text Block */}
            <div
                style={{
                    flex: "1",
                    maxWidth: "45%",
                    animation: isVisible ? "fadeInLeft 0.6s ease forwards" : "fadeOutLeft 0.6s ease forwards",
                }}
            >
                <h2
                    style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: currentColors.text,
                        fontFamily: "'JetBrains Mono', monospace",
                        marginBottom: "20px",
                    }}
                >
                    What does it do?
                </h2>
                <p
                    style={{
                        fontSize: "1rem",
                        lineHeight: "1.6",
                        color: currentColors.text,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    Upload your lecture materials, provide a description of how you want the cheatsheet to look, and we will
                    provide a LaTeX generated cheatsheet for you to use. The site accepts PDFs (preferred method of presentation notes), as well
                    as any written notes provided as images. How does the site work?
                </p>
            </div>

            {/* GIF Container */}
            <div
                style={{
                    flex: "1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    animation: isVisible ? "fadeInRight 0.6s ease forwards" : "fadeOutRight 0.6s ease forwards",
                }}
            >
                <div
                    style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
                        maxWidth: "500px", // Increased size of the GIF
                        width: "100%",
                    }}
                >
                    <img
                        src="chillguy.gif" // Replace with the path to your GIF
                        alt="Demo GIF"
                        style={{
                            width: "100%",
                            display: "block",
                            borderRadius: "12px",
                        }}
                    />
                </div>
            </div>

            {/* Keyframes for animations */}
            <style>
                {`
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeOutLeft {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                }

                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeOutRight {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                }
                `}
            </style>
        </div>
    );
};

export default DemoComponent;