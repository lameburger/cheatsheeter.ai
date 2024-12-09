import React from "react";

const DownloadModal = ({ isOpen, onClose, children, isDarkMode, imageSrc }) => {
    if (!isOpen) return null;

    const modalStyles = {
        overlay: {
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
        },
        content: {
            backgroundColor: isDarkMode ? "#121212" : "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            width: "80%",
            maxHeight: "80%",
            overflowY: "auto",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
        },
        closeButton: {
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: isDarkMode ? "#fff" : "#333",
        },
        image: {
            maxWidth: "100%",
            maxHeight: "60vh",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        },
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
                <button style={modalStyles.closeButton} onClick={onClose}>
                    &times;
                </button>
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt="PDF Preview"
                        style={modalStyles.image}
                    />
                ) : (
                    <div>{children}</div>
                )}
            </div>
        </div>
    );
};

export default DownloadModal;