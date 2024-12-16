import React, { useState, useEffect } from "react";
import "./LoadingBar.css"; // Import the CSS file created above

const LoadingBar = ({ progress }) => {
    const [sparkles, setSparkles] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Generate random sparkle positions
            const newSparkle = {
                id: Math.random(),
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            };

            setSparkles((prev) => [...prev.slice(-10), newSparkle]); // Limit sparkles to the last 10
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-bar-container">
            <div
                className="loading-bar"
                style={{ width: `${progress}%` }}
            ></div>
            {sparkles.map((sparkle) => (
                <div
                    key={sparkle.id}
                    className="sparkles"
                    style={{ left: sparkle.left, top: sparkle.top }}
                ></div>
            ))}
        </div>
    );
};

export default LoadingBar;