import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { FaCloudUploadAlt } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { extractTextFromPdfByPage } from "../services/pdfParser";
import * as pdfjsLib from "pdfjs-dist/webpack";
import DownloadModal from "../components/DownloadModal";
import { getUserDocument, updateUserCheatSheetData } from "../services/userService";
import { processFilesAndGenerateCheatSheet } from "../services/cheatSheetService";
import extractTextFromImage from '../services/googleVision';


const Creator = ({ isDarkMode, scrollToDemo }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [promptText, setPromptText] = useState("");
    const [pageSelection, setPageSelection] = useState("");
    const [theme, setTheme] = useState("");
    const [colorScheme, setColorScheme] = useState("");
    const [expandedImage, setExpandedImage] = useState(null);
    const [error, setError] = useState(null);
    const [cheatSheet, setCheatSheet] = useState("");
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastDownloadTime, setLastDownloadTime] = useState(0);
    const [selectedSlides, setSelectedSlides] = useState({});
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewPages, setPreviewPages] = useState([]);
    const [currentPreviewFile, setCurrentPreviewFile] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log("Preview Pages Updated:", previewPages);
    }, [previewPages]);

    const handleSlideSelection = (file, slideIndex) => {
        setSelectedSlides((prevSelectedSlides) => {
            // Initialize a new object if the previous state isn't valid
            if (!prevSelectedSlides || typeof prevSelectedSlides !== 'object') {
                return { [file]: [slideIndex] };
            }

            const fileSlides = prevSelectedSlides[file] || []; // Get slides for the file
            const updatedSlides = fileSlides.includes(slideIndex)
                ? fileSlides.filter((index) => index !== slideIndex) // Deselect slide
                : [...fileSlides, slideIndex]; // Select slide

            return {
                ...prevSelectedSlides,
                [file]: updatedSlides,
            };
        });
    };

    const handlePreviewPdf = async (file) => {
        try {
            setIsLoading(true);
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

                    const renderedPages = [];
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);

                        // Create a canvas to render the page
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");

                        const viewport = page.getViewport({ scale: 1.5 });
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };

                        await page.render(renderContext).promise;

                        // Convert the canvas to a data URL for display
                        renderedPages.push(canvas.toDataURL());
                    }

                    setPreviewPages(renderedPages); // Store rendered page images
                    setCurrentPreviewFile(file.name);
                    setPreviewModalOpen(true); // Open the modal for previewing
                } catch (error) {
                    console.error("Error rendering PDF pages:", error.message);
                    setError("Failed to preview PDF. Please try again.");
                    setPreviewPages([]);
                } finally {
                    setIsLoading(false);
                }
            };

            reader.onerror = () => {
                setError("Error reading the file. Please try again.");
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Error previewing PDF:", error.message);
            setError("Failed to preview PDF. Please try again.");
            setPreviewPages([]);
            setIsLoading(false);
        }
    };

    // Close preview modal
    const closePreviewModal = () => {
        setPreviewModalOpen(false);
        setPreviewPages([]);
        setCurrentPreviewFile(null);
    };

    const handleCreateCheatSheet = async () => {
        if (!user) {
            setError("You need to be logged in to create a cheat sheet.");
            return;
        }

        if (uploadedFiles.length === 0) {
            setError("Please upload a file.");
            return;
        }

        if (Object.keys(selectedSlides).length === 0) {
            setError("Please select at least one slide.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const userDoc = await getUserDocument(user);
            if (!userDoc) {
                setError("User not found. Please try again.");
                return;
            }

            const { subscriptionType, cheatSheetsCreatedToday } = userDoc;

            if (subscriptionType === "freemium" && cheatSheetsCreatedToday >= 1000) {
                setError(
                    "Freemium users can only create one cheat sheet per day. Upgrade to premium for unlimited access."
                );
                return;
            }

            const rawTextEntries = uploadedFiles.filter((file) => typeof file === "string");
            const fileEntries = uploadedFiles.filter((file) => typeof file === "object" && file.file);

            const extractedTextPromises = fileEntries.map(async (file) => {
                try {
                    if (file.file.type === "application/pdf" && selectedSlides[file.file.name]) {
                        const pages = await extractTextFromPdfByPage(file.file);
                        return selectedSlides[file.file.name]
                            .map((pageIndex) => pages[pageIndex - 1])
                            .filter(Boolean);
                    } else if (file.file.type.startsWith("image/")) {
                        const imageText = await extractTextFromImage(file.file.path || file.file);
                        return [imageText];
                    }
                    return [];
                } catch (err) {
                    console.error("Error extracting text from file:", file.file.name, err);
                    throw new Error(`Failed to process file: ${file.file.name}`);
                }
            });

            const allExtractedTextArrays = await Promise.all(extractedTextPromises);
            const allExtractedText = [...allExtractedTextArrays.flat(), ...rawTextEntries];

            if (allExtractedText.length === 0) {
                setError("No valid content to process.");
                return;
            }

            try {
                const cheatSheet = await processFilesAndGenerateCheatSheet(allExtractedText, theme, promptText);
                if (!cheatSheet) {
                    throw new Error("Cheat sheet generation returned null or undefined.");
                }

                setCheatSheet(cheatSheet);
                setIsModalOpen(true);
                setError(null); // Clear any previous errors
                await updateUserCheatSheetData(user); // Update user data for cheat sheet creation
            } catch (err) {
                console.error("Error during cheat sheet generation:", err.message);
                setError("Failed to generate cheat sheet. Please try again.");
            }
        } catch (err) {
            console.error("Unhandled error during cheat sheet creation:", err.message);
            setError("Unexpected error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        const now = Date.now();
        const cooldown = 30 * 1000; // 30 seconds cooldown

        if (now - lastDownloadTime < cooldown) {
            setError("Please wait before downloading another cheat sheet.");
            return;
        }

        setLastDownloadTime(now);

        const element = document.createElement("div");
        element.innerHTML = cheatSheet;

        html2pdf()
            .set({
                margin: 10,
                filename: "cheat_sheet.pdf",
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(element)
            .save()
            .catch((err) => {
                console.error("Error downloading PDF:", err);
            });
    };

    const inspectImage = async (file) => {
        try {
            const imageText = await extractTextFromImage(file.url); // Extract text from image using Google Vision API or other OCR library
            alert(`Extracted text from image: \n${imageText}`);
        } catch (error) {
            console.error("Error extracting text from image:", error.message);
            setError("Failed to extract text from the image. Please try again.");
        }
    };

    const handleFileUpload = (event) => {
        const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
        const files = Array.from(event.target.files);

        const filteredFiles = files.filter((file) => validTypes.includes(file.type));

        if (filteredFiles.length === 0) {
            setError("Unsupported file type. Please upload PDFs or images (PNG, JPG, JPEG).");
            return;
        }

        const mappedFiles = filteredFiles.map((file) => ({
            file,
            type: file.type,
            name: file.name,
            url: URL.createObjectURL(file),
        }));

        console.log("Mapped files:", mappedFiles); // Debugging log
        setUploadedFiles((prev) => [...prev, ...mappedFiles]);
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
        const files = Array.from(event.dataTransfer.files).filter((file) =>
            validTypes.includes(file.type)
        );

        if (files.length === 0) {
            setError("Unsupported file type. Please upload PDFs or images (PNG, JPG, JPEG).");
            return;
        }

        const mappedFiles = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setUploadedFiles((prev) => [...prev, ...mappedFiles]);
    };

    const handleExpandImage = (url) => {
        setExpandedImage(url);
    };

    const handleRemoveFile = (fileName) => {
        const updatedFiles = uploadedFiles.filter((file) => file.file.name !== fileName);
        setUploadedFiles(updatedFiles);

        // Close the preview modal if the current file is being removed
        if (currentPreviewFile === fileName) {
            setPreviewModalOpen(false);
            setPreviewPages([]);
            setCurrentPreviewFile(null);
        }
    };

    const isButtonEnabled = () => {
        return (
            uploadedFiles.length > 0 &&
            promptText.trim() &&
            pageSelection &&
            theme &&
            colorScheme
        );
    };

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

    const currentColors = isDarkMode ? colors.light : colors.light;

    return (
        <div
            style={{
                position: "sticky", // Makes it stay in view
                top: 0, // Stick to the top of the viewport
                zIndex: 10, // Ensure it stays above other content
                margin: "50px auto",
                padding: "20px",
                maxWidth: "800px",
                borderRadius: "12px",
                backgroundColor: currentColors.background,
                color: currentColors.text,
                fontFamily: "'JetBrains Mono', monospace",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    marginBottom: "20px",
                }}
            >
                Create Your Cheat Sheet
            </h2>

            {/* Expanded Image Modal */}
            {expandedImage && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setExpandedImage(null)}
                >
                    <img
                        src={expandedImage}
                        alt="Expanded view"
                        style={{
                            maxWidth: "90%",
                            maxHeight: "90%",
                            borderRadius: "8px",
                        }}
                    />
                </div>
            )}

            {/* Drag-and-Drop File Upload */}
            <div
                style={{
                    marginBottom: "20px",
                    padding: "20px",
                    border: `2px dashed ${currentColors.border}`,
                    borderRadius: "8px",
                    backgroundColor: currentColors.background,
                    color: currentColors.text,
                    textAlign: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: "pointer",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById("file-upload").click()}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    {/* Upload Icon */}
                    <FaCloudUploadAlt size={48} style={{ color: currentColors.text }} />

                    {/* Upload Text */}
                    <label
                        htmlFor="file-upload"
                        style={{
                            fontWeight: "bold",
                            cursor: "pointer",
                            opacity: 0.7,
                        }}
                    >
                        Drag & Drop PDF or Photo Files Here, or Click to Upload
                    </label>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept=".pdf, image/*"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            {uploadedFiles.map((file, index) => (
                <div key={index} style={{ display: "inline-block", margin: "10px" }}>
                    <div
                        style={{
                            position: "relative",
                            width: "100px",
                            height: "120px",
                            fontFamily: "'JetBrains Mono', monospace",
                            border: `1px solid ${currentColors.border}`,
                            borderRadius: "8px",
                            backgroundColor: currentColors.background,
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                    >
                        {/* Preview Thumbnail */}
                        {file.file.type.startsWith("image/") ? (
                            <img
                                src={file.url}
                                alt="Image Preview"
                                style={{
                                    width: "100%",
                                    height: "80%",
                                    objectFit: "cover",
                                    borderRadius: "8px 8px 0 0",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "80%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#f4f4f4",
                                    borderRadius: "8px 8px 0 0",
                                    fontSize: "12px",
                                    color: currentColors.text,
                                }}
                            >
                                <span>PDF Preview</span>
                            </div>
                        )}

                        {/* File Name */}
                        <p
                            style={{
                                margin: "5px 0",
                                fontSize: "0.8rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {file.file.name}
                        </p>

                        {/* Action Buttons */}
                        {file.file.type.startsWith("image/") ? (
                            <button
                                onClick={() => handleRemoveFile(file.file.name)}
                                aria-label="Remove Image"
                                style={{
                                    position: "absolute",
                                    bottom: "5px",
                                    left: "5px",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    background: "red",
                                    color: "#fff",
                                    border: "none",
                                    padding: "5px 10px",
                                    fontSize: "0.8rem",
                                    cursor: "pointer",
                                    borderRadius: "3px",
                                }}
                            >
                                Remove
                            </button>
                        ) : (
                            <button
                                onClick={() => handlePreviewPdf(file.file)}
                                aria-label="Inspect PDF"
                                style={{
                                    position: "absolute",
                                    bottom: "5px",
                                    left: "5px",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    background: currentColors.text,
                                    color: currentColors.background,
                                    border: "none",
                                    padding: "5px 10px",
                                    fontSize: "0.8rem",
                                    cursor: "pointer",
                                    borderRadius: "3px",
                                }}
                            >
                                Inspect
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {previewModalOpen && (
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
                            position: "relative",
                            backgroundColor: currentColors.background,
                            padding: "20px",
                            borderRadius: "8px",
                            maxWidth: "80%",
                            maxHeight: "80%",
                            overflowY: "auto",
                            fontFamily: "'JetBrains Mono', monospace",
                            color: currentColors.text,
                        }}
                    >
                        <h3 style={{ marginBottom: "20px" }}>
                            Preview Pages for {currentPreviewFile}
                        </h3>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: "10px",
                            }}
                        >
                            {previewPages.map((pageImage, pageIndex) => (
                                <div
                                    key={pageIndex}
                                    style={{
                                        position: "relative",
                                        width: "300px",
                                        height: "auto",
                                        border: `1px solid ${currentColors.border}`,
                                        borderRadius: "5px",
                                        padding: "5px",
                                        fontFamily: "'JetBrains Mono', monospace",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    {/* Render the image */}
                                    <img
                                        src={pageImage}
                                        alt={`Page ${pageIndex + 1}`}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "cover",
                                            borderRadius: "5px",
                                        }}
                                    />
                                    {/* Select button */}
                                    <button
                                        onClick={() =>
                                            handleSlideSelection(currentPreviewFile, pageIndex + 1)
                                        }
                                        aria-label={`Select Page ${pageIndex + 1}`}
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            position: "absolute",
                                            bottom: "10px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            backgroundColor: selectedSlides[currentPreviewFile]?.includes(
                                                pageIndex + 1
                                            )
                                                ? currentColors.text
                                                : "transparent",
                                            color: selectedSlides[currentPreviewFile]?.includes(pageIndex + 1)
                                                ? currentColors.background
                                                : currentColors.text,
                                            border: `1px solid ${currentColors.text}`,
                                            borderRadius: "3px",
                                            padding: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {selectedSlides[currentPreviewFile]?.includes(pageIndex + 1)
                                            ? "Selected"
                                            : "Select"}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Remove File Button */}
                        <button
                            onClick={() => handleRemoveFile(currentPreviewFile)}
                            aria-label="Remove File"
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                fontFamily: "'JetBrains Mono', monospace",
                                backgroundColor: "red",
                                color: "#fff",
                                border: "none",
                                padding: "10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Remove File
                        </button>

                        {/* Close Modal Button */}
                        <button
                            onClick={closePreviewModal}
                            aria-label="Close Preview Modal"
                            style={{
                                marginTop: "20px",
                                backgroundColor: currentColors.text,
                                color: currentColors.background,
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Prompt Text Box */}
            <div style={{ marginBottom: "20px" }}>
                <label
                    htmlFor="prompt-text"
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        color: currentColors.text,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    Cheat sheet description
                </label>
                <textarea
                    id="prompt-text"
                    placeholder="Describe your cheat sheet in detail (e.g., topics, format, key points)..."
                    rows="3" // Reduced from 6 to 3
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: `2px solid ${currentColors.border}`,
                        backgroundColor: currentColors.background,
                        color: currentColors.text,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "1rem",
                        lineHeight: "1.5",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Adds a soft shadow
                        resize: "vertical", // Allow resizing vertically
                        transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = currentColors.primary)}
                    onBlur={(e) => (e.target.style.borderColor = currentColors.border)}
                ></textarea>
                <small
                    style={{
                        display: "block",
                        marginTop: "8px",
                        fontSize: "0.9rem",
                        color: currentColors.text,
                        fontFamily: "'JetBrains Mono', monospace",
                        opacity: 0.8,
                    }}
                >
                </small>
            </div>

            {/* Page Selection
            <div style={{ marginBottom: "20px" }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: "10px",
                        fontWeight: "bold",
                    }}
                >
                    Number of Pages:
                </label>
                <div>
                    <label style={{ marginRight: "20px" }}>
                        <input
                            type="radio"
                            name="pages"
                            value="one"
                            onChange={(e) => setPageSelection(e.target.value)}
                            style={{
                                marginRight: "8px",
                                accentColor: currentColors.text,
                            }}
                        />
                        One Page
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="pages"
                            value="two"
                            onChange={(e) => setPageSelection(e.target.value)}
                            style={{
                                marginRight: "8px",
                                accentColor: currentColors.text,
                            }}
                        />
                        Two Pages
                    </label>
                </div>
            </div> */}

            {/* Create Cheat Sheet and Demo Scroll */}
            <div style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "20px" }}>
                <button
                    onClick={handleCreateCheatSheet}
                    disabled={isLoading}
                    style={{
                        padding: "15px 30px",
                        borderRadius: "8px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "1rem",
                        fontWeight: "700",
                        backgroundColor: "#32CD32", // Bright green
                        color: "#ffffff", // White text
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease, color 0.3s ease",
                        boxShadow: "0 4px 10px rgba(50, 205, 50, 0.6)", // Glow effect
                    }}
                >
                    {isLoading ? "Processing..." : "Create Cheatsheet"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p
                    onClick={scrollToDemo}
                    style={{
                        fontSize: "1rem",
                        fontWeight: "700",
                        color: currentColors.text,
                        cursor: "pointer",
                        textDecoration: "underline",
                        margin: "0",
                    }}
                >
                    Demo
                </p>
            </div>
            {/* Modal for Cheat Sheet Preview */}
            <DownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode}>
                <h3>Cheat Sheet Preview</h3>
                <div
                    style={{
                        maxHeight: "70vh",
                        overflowY: "auto",
                        padding: "10px",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        background: "var(--box-bg)",
                    }}
                    dangerouslySetInnerHTML={{ __html: cheatSheet }}
                />
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                        onClick={handleDownloadPdf}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "var(--primary)",
                            color: "var(--bg)",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        Download as PDF
                    </button>
                </div>
            </DownloadModal>
        </div>
    );
};

export default Creator;