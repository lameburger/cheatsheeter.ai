import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import DOMPurify from "dompurify";
import {
    generateHtmlContent,
} from "../services/cheatSheetService";
import { FaDownload } from "react-icons/fa";

const SearchModal = ({ sheet, onClose }) => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        // Process and generate the HTML content dynamically
        const layout = {
            columnWidth: 500, // Example column width in mm
        };

        // Mock contentSections as parsed data for HTML generation
        const contentSections = sheet.content
            .split("\n\n") // Split by double newlines
            .filter((section) => section.trim() !== "") // Remove empty sections
            .map((section) => ({
                text: section.trim(),
            }));

        // Format content into columns
        const formattedColumns = contentSections.map((section) =>
            section.text.split("\n")
        );

        // Generate clean and accurate HTML content
        const generatedHtml = generateHtmlContent(formattedColumns, layout);
        setHtmlContent(generatedHtml);
    }, [sheet]);

    const exportToPdf = async () => {
        try {
            const container = document.createElement("div");
            container.innerHTML = htmlContent;
            container.style.width = `297mm`;
            container.style.height = `210mm`;
            container.style.backgroundColor = "white";
            document.body.appendChild(container);

            const canvas = await html2canvas(container, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            document.body.removeChild(container);

            const pdf = new jsPDF("landscape", "mm", "a4");
            const imgWidth = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`cheatsheet-${Date.now()}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
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
                    maxWidth: "1200px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                    overflowY: "auto",
                    maxHeight: "90vh",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
                    {sheet.classInfo || "Cheat Sheet"}
                </h2>

                {/* Cheat Sheet Preview */}
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "20px",
                        fontFamily: "Arial, sans-serif",
                    }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
                ></div>

                {/* Action Buttons */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#f44336",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        Close
                    </button>
                    <button
                        onClick={exportToPdf}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#32CD32",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "bold",
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        <FaDownload style={{ marginRight: "8px" }} /> Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;