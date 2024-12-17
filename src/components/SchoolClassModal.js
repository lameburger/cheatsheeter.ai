import React, { useState } from "react";

const SchoolClassModal = ({ onClose, onSave }) => {
    const [school, setSchool] = useState("");
    const [className, setClassName] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    const handleSave = () => {
        // Only pass the necessary fields (school, className, isPublic) as variables for React
        // Check if the school and className are not empty before calling onSave
        if (!school.trim() || !className.trim()) {
            alert("School and class name are required.");
            return;
        }
        
        onSave({ school, classInfo: className, isPublic });
        onClose();
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    width: "90%",
                    maxWidth: "400px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    fontFamily: "'JetBrains Mono', monospace",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                }}
            >
                <h3 style={{ textAlign: "center", margin: "0 0 10px 0" }}>Add School and Class</h3>
                <input
                    type="text"
                    placeholder="Enter your school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        fontSize: "16px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "black",
                    }}
                />
                <input
                    type="text"
                    placeholder="Enter your class"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        fontFamily: "'JetBrains Mono', monospace",
                        borderRadius: "5px",
                        fontSize: "16px",
                        color: "black",
                    }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 15px",
                            borderRadius: "5px",
                            backgroundColor: "#f44336",
                            fontFamily: "'JetBrains Mono', monospace",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            padding: "10px 15px",
                            borderRadius: "5px",
                            backgroundColor: "#32CD32",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "bold",
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SchoolClassModal;