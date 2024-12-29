import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const summarizeText = async (text, context) => {
    const prompt = `
You are an expert cheat sheet maker who is given information from a page of a student's lecture materials and need to create a dense summarization and explanation of the material so that the student can study and use it during a test.

### Context:
${context}

### Input:
${text}

### Output:
Generate a dense, small, detailed explanation of topics. Ensure the output:
1. Focuses on **core concepts**, **key definitions**, and **critical points**.
2. Bolds important information using **Markdown** for readability (e.g., "**bold this key point**").
3. Excludes any mention of university names, copyright, or professor names.
4. Structures content for **quick readability** in a cheat sheet format (bullet points, lists, or headings).
5. Uses concise, precise, and professional language.
6. Avoids verbose language, redundant details, and unnecessary examples.
7. Avoids including any code block (\`\`\`) or HTML tags.
8. If given a practice problem or examples, ignore them and only provide a general explaination for them.
9. Inlude tables if needed.

### Example Output Format:
- **Key Concept:** Explanation of the concept.
- **Formula:** Highlight the formula and define variables.
- **Important Notes:** Bullet points for essential takeaways.

### Deliver the output in Markdown format:
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert in creating dense, visually structured cheat sheets." },
                { role: "user", content: prompt },
            ],
        });

        let summary = response.choices[0].message?.content.trim() || "";

        return summary;
    } catch (error) {
        console.error("Error summarizing text:", error.response?.data || error.message);
        throw error;
    }
};