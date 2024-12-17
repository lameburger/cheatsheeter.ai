import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import OpenAI from "openai";
import { extractTextFromPdfByPage } from "./pdfParser";
import { marked } from "marked";
import DOMPurify from "dompurify"; // Import DOMPurify for safe HTML sanitization
import uploadCheatSheet from './uploadCheatSheet';

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

const PAGE_WIDTH = 210; // A4 page width in mm
const PAGE_HEIGHT = 297; // A4 page height in mm
const COLUMN_WIDTH = 50; // Column width in mm
const FONT_SIZE = 12; // Font size in px
const LINE_HEIGHT = FONT_SIZE * 1; // Line height multiplier

// Cache to store GPT responses
const cache = new Map();
const calculateDynamicLayout = (totalTextLength) => {
    const baseFontSize = 8; // Increased base font size for readability
    const maxFontSize = 12; // Maximum font size for larger layouts
    const minFontSize = 8; // Minimum font size for compact layouts
    const padding = 10; // Padding on the top and bottom of the page in mm

    // Dynamically adjust font size based on the total text length
    const fontSize = Math.max(
        minFontSize,
        Math.min(maxFontSize, baseFontSize - Math.floor(totalTextLength / 1500))
    );

    // Adjust line height proportionally
    const lineHeight = fontSize * 1.15;

    // Dynamic column width adjustment for better text wrapping
    const columnWidth = Math.max(40, COLUMN_WIDTH - Math.floor(totalTextLength / 3000));

    // Calculate the number of columns that fit the page width
    // const numColumns = Math.floor((PAGE_WIDTH - padding * 2) / columnWidth);
    const numColumns = 6;

    // Max lines per column adjusted for full height utilization
    const maxLinesPerColumn = Math.floor((PAGE_HEIGHT - padding * 2) / lineHeight) * 3;

    return { numColumns, columnWidth, lineHeight, fontSize, maxLinesPerColumn };
};

const analyzePages = async (pages, promptText, maxWordsPerPage = 2000) => {
    const prompt = `
You are an expert cheat sheet designer tasked with creating a structured and visually appealing cheat sheet.

### Task:
1. Analyze the content.
2. Identify key sections, topics, and structure for the cheat sheet (be sure to keep original content from what you were given).
3. Recommend a word limit for each section to ensure all sections fit on the page. 
4. The total word limit for all sections combined must not exceed ${maxWordsPerPage}.
5. The person creating the cheatsheet would like to ensure that the cheat sheet mentions these topics: ${promptText}
6. If there are equations or formulas be sure to include them with each section.
7. Ensure the output is compact and suitable for quick studying.
8. Do not include any additional text outside this JSON format (DO NOT INCLUDE ''' or the json tag).
9. Use valid HTML <h3> tags for section titles, and ensure content is in plain text.
10. If analyzing code, make sure that it is all in JSON readable format.


### Input:
${pages.join("\n\n")}

### Output:
Provide the cheat sheet structure with word limits in the following JSON format:
{
  "sections": [
    {
      "title": "Section Title",
      "content": "Relevant key points or content to include in this section",
      "wordLimit": 80
    },
    {
      "title": "Another Section Title",
      "content": "Relevant key points or content to include in this section",
      "wordLimit": 120
    }
  ]
}
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        console.log("Token Usage (Analyze Pages):");
        console.log(`  Input Tokens: ${response.usage.prompt_tokens}`);
        console.log(`  Output Tokens: ${response.usage.completion_tokens}`);
        console.log(`  Total Tokens: ${response.usage.total_tokens}`);

        const output = response.choices[0].message?.content.trim();

        try {
            const parsedOutput = JSON.parse(output);
            return parsedOutput;
        } catch (jsonError) {
            console.error("Invalid JSON response from GPT:", output);
            throw new Error("Failed to parse JSON from GPT response.");
        }
    } catch (error) {
        console.error("Error analyzing pages:", error.message);
        throw error;
    }
};

const summarizeSection = async (sectionTitle, sectionContent, wordLimit) => {
    const cacheKey = `${sectionTitle}:${sectionContent}:${wordLimit}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const prompt = `
    You are an expert in creating dense and structured cheat sheets.

    ### Section Title:
    ${sectionTitle}

    ### Section Content:
    ${sectionContent}

    ### Output:
    Provide a dense summary in plain text format:
    1. Use <b> tags for key concepts AND italics and bold for formulas (e.g., "<b>Important</b>").
    2. Use structured plain text bullet points or numbered lists for organization.
    3. Summarize the section in at most ${wordLimit*2} words.
    4. Ensure the output is plain text, formatted for HTML but without Markdown syntax.
    5. Don't include the phrase "Cheat sheet" anywhere.
    6. If summarizing code, make sure that it is all in html readable format.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        console.log(`Token Usage (Summarize Section: ${sectionTitle}):`);
        console.log(`  Input Tokens: ${response.usage.prompt_tokens}`);
        console.log(`  Output Tokens: ${response.usage.completion_tokens}`);
        console.log(`  Total Tokens: ${response.usage.total_tokens}`);

        const summary = response.choices[0].message?.content.trim();
        cache.set(cacheKey, summary);

        if (typeof summary !== "string" || summary.includes("[object Object]")) {
            console.error("Invalid summary output:", summary);
            throw new Error("GPT returned invalid summary content.");
        }

        return summary;
    } catch (error) {
        console.error(`Error summarizing section "${sectionTitle}":`, error.message);
        throw error;
    }
};

const processSectionsInParallel = async (sections, pages) => {
    return await Promise.all(
        sections.map(async (section) => {
            let sectionContent = pages.join("\n").match(new RegExp(section.content, "i"))?.[0] || "";

            // Convert sectionContent to a string if it's an object
            if (typeof sectionContent !== "string") {
                sectionContent = JSON.stringify(sectionContent);
            }

            const summary = await summarizeSection(section.title, sectionContent, section.wordLimit);
            return { text: summary, visuals: [] };
        })
    );
};

// Step 3: Remove redundant information
const removeRedundantInformation = (text) => {
    const lines = text.split("\n").map((line) => line.trim());
    const uniqueLines = [...new Set(lines)];
    return uniqueLines.join("\n");
};

const formatContentWithVisuals = (contentSections, layout) => {
    const { maxLinesPerColumn } = layout;
    const columns = [[]]; // Start with a single column
    let currentColumnIndex = 0;
    let currentLineCount = 0;

    contentSections.forEach((section) => {
        const deduplicatedText = removeRedundantInformation(section.text);
        const words = deduplicatedText.split(/\s+/);
        let tempLine = "";

        words.forEach((word) => {
            const projectedLine = tempLine + (tempLine ? " " : "") + word;

            if (currentLineCount >= maxLinesPerColumn || projectedLine.length > layout.columnWidth) {
                if (tempLine.trim()) {
                    columns[currentColumnIndex].push(tempLine.trim());
                    currentLineCount++;
                }

                if (currentLineCount >= maxLinesPerColumn) {
                    currentColumnIndex++;
                    currentLineCount = 0;

                    if (!columns[currentColumnIndex]) {
                        columns.push([]); // Add a new column
                    }
                }

                tempLine = word; // Start a new line with the current word
            } else {
                tempLine = projectedLine; // Accumulate words into the current line
            }
        });

        if (tempLine.trim()) {
            if (!columns[currentColumnIndex]) {
                columns.push([]); // Add a new column if needed
            }
            columns[currentColumnIndex].push(tempLine.trim());
            currentLineCount++;
        }
    });

    return columns;
};

const generateHtmlContent = (columns, layout) => {
    const { columnWidth } = layout;

    const totalColumns = 6; // Always 6 columns
    const filledColumnsCount = Math.min(columns.length, 4); // Limit content columns to 4
    const remainingColumns = totalColumns - filledColumnsCount; // Calculate remaining columns

    // Generate HTML for filled content columns
    const mainColumnsHtml = columns
        .slice(0, filledColumnsCount) // Use only the available filled columns
        .map(
            (column, index) => `
            <div style="
                grid-column: ${index + 1}; /* Place each column in its respective slot */
                box-sizing: border-box;
                text-align: justify;
                margin: 0;
                padding: 0;
                white-space: normal;
                word-break: break-word;
                overflow-wrap: break-word;
                height: auto;
                hyphens: auto;
            ">
                ${DOMPurify.sanitize(column.join(" "))} 
            </div>
        `
        )
        .join("");

    // Determine the starting column for the writing space
    const writingSpaceStartColumn = filledColumnsCount + 1;

    // Writing space (occupying remaining columns)
    const editableColumnsHtml = `
        <div style="
            grid-column: ${writingSpaceStartColumn} / span ${remainingColumns}; /* Dynamically span remaining columns */
            box-sizing: border-box;
            border: 1px solid black;
            width: 92%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 10px;
            font-size: 8px;
            line-height: 1.2;
        ">

            <div style="
                display: flex;
                justify-content: space-between;
                font-size: 8px;
                margin-top: 5px;
                color: black;
            ">
                <span>Writing Space</span>
                <span>Generated on Cheatsheeter.ai</span>
            </div>
        </div>
    `;

    // Combine all into a single grid layout
    return `
        <div style="
            padding: 5mm;
            display: grid;
            grid-template-columns: repeat(${totalColumns}, ${columnWidth}mm);
            gap: 2mm;
            width: 100%;
            height: 100%;
            font-size: 8px;
            font-family: Arial, sans-serif;
            line-height: 1.2;
            color: black;
            box-sizing: border-box;
        ">
            ${mainColumnsHtml}
            ${editableColumnsHtml}
        </div>
    `;
};

const generateCheatSheetPdf = async (contentSections) => {
    const layout = calculateDynamicLayout(
        contentSections.reduce((sum, section) => sum + section.text.length, 0)
    );
    const formattedColumns = formatContentWithVisuals(contentSections, layout);
    const htmlContent = generateHtmlContent(formattedColumns, layout);

    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    container.style.width = `${PAGE_HEIGHT}mm`;
    container.style.height = `${PAGE_WIDTH}mm`;
    container.style.backgroundColor = "white";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    document.body.appendChild(container);

    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    document.body.removeChild(container);

    const pdf = new jsPDF("landscape", "mm", "a4");
    const imgWidth = PAGE_HEIGHT;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Automatically download the generated PDF
    const fileName = `cheatsheet-${Date.now()}.pdf`;
    pdf.save(fileName);

    return fileName; // Return the file name for reference if needed
};


marked.setOptions({
    gfm: true,
    breaks: true,
});

const renderer = new marked.Renderer();

// Customize heading sizes
renderer.heading = (text, level) => {
    const size = level === 1 ? "16px" : level === 2 ? "14px" : "12px";
    return `<h${level} style="font-size: ${size}; margin: 0;">${text}</h${level}>`;
};

// Customize bold text
renderer.strong = (text) => `<strong style="font-weight: bold;">${text}</strong>`;

// Apply renderer
marked.use({ renderer });

const processFilesAndGenerateCheatSheet = async (uploadedFiles, selectedVisuals = [], promptText) => {
    try {
        const pages = [];
        for (const file of uploadedFiles) {
            if (typeof file === "string") {
                pages.push(file);
            } else if (file.file.type === "application/pdf") {
                const pdfPages = await extractTextFromPdfByPage(file.file);
                pages.push(...pdfPages);
            }
        }

        if (pages.length === 0) {
            throw new Error("No valid content provided for the cheat sheet.");
        }

        // Analyze pages to determine structure
        console.log("Analyzing pages...");
        const structure = await analyzePages(pages, promptText);
        console.log("Page structure received:", structure);

        if (!structure || !structure.sections || structure.sections.length === 0) {
            throw new Error("Failed to analyze pages. Structure is invalid.");
        }

        // Summarize sections in parallel
        console.log("Summarizing sections...");
        const contentSections = await processSectionsInParallel(structure.sections, pages);
        console.log("Summarized sections:", contentSections);

        if (!contentSections || contentSections.length === 0) {
            throw new Error("Failed to summarize sections. No content available.");
        }

        // Generate HTML content for preview and PDF
        console.log("Generating cheat sheet HTML...");
        const layout = calculateDynamicLayout(
            contentSections.reduce((sum, section) => sum + section.text.length, 0)
        );
        const formattedColumns = formatContentWithVisuals(contentSections, layout);
        const htmlContent = generateHtmlContent(formattedColumns, layout);

        console.log("Generating PDF...");
        await generateCheatSheetPdf(contentSections);

        console.log("Cheat sheet generation successful.");
        return { success: true, htmlContent }; // Return the HTML content
    } catch (error) {
        console.error("Error generating cheat sheet:", error.message);
        throw new Error("Cheat sheet generation failed. Please check the logs.");
    }
};

export { processFilesAndGenerateCheatSheet, generateCheatSheetPdf, formatContentWithVisuals, calculateDynamicLayout, generateHtmlContent };