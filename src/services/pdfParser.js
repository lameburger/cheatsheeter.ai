import * as pdfjsLib from "pdfjs-dist/webpack";

export const renderPdfToImages = async (file) => {
    console.log("Rendering PDF pages to images:", file.name);
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                const pages = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1 });
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const renderContext = { canvasContext: context, viewport };
                    await page.render(renderContext).promise;

                    // Convert canvas to base64 image URL
                    const image = canvas.toDataURL("image/png");
                    pages.push(image);
                }

                resolve(pages); // Resolve with image URLs
            } catch (error) {
                console.error("Error rendering PDF to images:", error.message);
                reject(new Error(`Failed to render PDF to images: ${error.message}`));
            }
        };
        reader.onerror = () => reject(new Error("Error reading PDF file"));
        reader.readAsArrayBuffer(file);
    });
};

export const extractTextFromPdfByPage = async (file) => {
    console.log("Extracting text from PDF by page:", file.name);
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                const pageTexts = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item) => item.str).join(" ");
                    pageTexts.push(pageText.trim());
                }

                resolve(pageTexts);
            } catch (error) {
                console.error("Error extracting text from PDF by page:", error.message);
                reject(new Error(`Failed to extract text from PDF by page: ${error.message}`));
            }
        };
        reader.onerror = () => reject(new Error("Error reading PDF file"));
        reader.readAsArrayBuffer(file);
    });
};