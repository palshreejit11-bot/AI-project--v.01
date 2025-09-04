import { GoogleGenAI } from '@google/genai';

// --- IMPORTANT SECURITY WARNING ---
// The API key is exposed on the client-side here.
// This is NOT recommended for production applications.
// Anyone can view your key by inspecting the page source.
// For a real application, you should hide this key behind a backend server or a serverless function.
// For this personal project/demo, you can paste your key here.
const API_KEY = 'YOUR_GEMINI_API_KEY';

// This function assumes window.GoogleGenAI is loaded from the CDN script in index.html
const getGenAI = (): GoogleGenAI => {
    const ai = (window as any).GoogleGenAI;
    if (!ai) {
        throw new Error("GoogleGenAI SDK not loaded. Ensure the script is included in index.html.");
    }

    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY') {
        // This error will be caught by the App component and displayed to the user.
        throw new Error("API key not configured. Please add your Gemini API key to services/geminiService.ts");
    }

    return new ai({ apiKey: API_KEY });
}

const masterPrompt = `
You are "Saathi," an expert social media strategist specializing in creating engaging, localized content for small businesses. Your tone is encouraging, creative, and professional.

Your task is to generate a comprehensive 7-day social media content plan for the following business:
[BUSINESS_TYPE]

The plan should be formatted in Markdown and must include the following for each of the 7 days:

**Day X: [Theme of the Day]**

*   **Platform:** Suggest the best platform for the post (e.g., Instagram, Facebook).
*   **Post Type:** Specify the format (e.g., Image Post, Video Reel, Carousel, Story).
*   **Content Idea:** Provide a detailed description of the content. Be creative and specific to the business type. For example, instead of "Post a picture of coffee," suggest "A close-up, top-down shot of a freshly made latte with beautiful art, with steam gently rising. The background should be our cozy cafe corner."
*   **Caption:** Write a compelling and engaging caption. Include a call-to-action (CTA).
*   **Hashtags:** Provide a mix of 5-7 relevant niche, local, and broad hashtags.

**General Guidelines:**
- The plan should have a logical flow through the week.
- Tailor the content ideas to the specific business and its likely location.
- Ensure the output is ONLY the Markdown plan itself, starting with "Day 1". Do not include any introductory or concluding text outside of the plan.
`;


export const generateSocialMediaPlan = async (businessDescription: string): Promise<string> => {
  try {
    const ai = getGenAI();
    const fullPrompt = masterPrompt.replace('[BUSINESS_TYPE]', businessDescription);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text;
  } catch (error) {
    console.error('Error generating content from Gemini API:', error);
    // Re-throw the original error to be handled by the UI component
    throw error;
  }
};