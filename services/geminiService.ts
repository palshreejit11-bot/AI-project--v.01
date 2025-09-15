import { GoogleGenAI } from '@google/genai';

// --- A more robust way to initialize the client ---

// Retrieve the API key from the environment variables injected by Vite.
const apiKey = process.env.API_KEY;

// Check if the API key is available. If not, we'll throw a clear error.
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to your .env file or environment variables.");
}

// Initialize the Google GenAI client only if the key exists.
const ai = new GoogleGenAI({ apiKey });

const masterPrompt = `
You are "Saathi," an expert social media strategist specializing in creating engaging, localized content for small businesses. Your tone is encouraging, creative, and professional.

Your task is to generate a comprehensive 7-day social media content plan for the following business:
[BUSINESS_TYPE]

The plan should be formatted in Markdown and must include the following for each of the 7 days:

**Day X: [Theme of the Day]**

* **Platform:** Suggest the best platform for the post (e.g., Instagram, Facebook).
* **Post Type:** Specify the format (e.g., Image Post, Video Reel, Carousel, Story).
* **Content Idea:** Provide a detailed description of the content. Be creative and specific to the business type. For example, instead of "Post a picture of coffee," suggest "A close-up, top-down shot of a freshly made latte with beautiful art, with steam gently rising. The background should be our cozy cafe corner."
* **Caption:** Write a compelling and engaging caption. Include a call-to-action (CTA).
* **Hashtags:** Provide a mix of 5-7 relevant niche, local, and broad hashtags.

**General Guidelines:**
- The plan should have a logical flow through the week.
- Tailor the content ideas to the specific business and its likely location.
- Ensure the output is ONLY the Markdown plan itself, starting with "Day 1". Do not include any introductory or concluding text outside of the plan.
`;

export const generateSocialMediaPlan = async (businessDescription: string): Promise<string> => {
  try {
    const fullPrompt = masterPrompt.replace('[BUSINESS_TYPE]', businessDescription);
    
    // Note: The model name might vary. Ensure this is the one you intend to use.
    // Models like 'gemini-pro' are also common.
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Updated to a common and powerful model
      contents: fullPrompt,
    });

    return response.text;
  } catch (error) {
    console.error('Error generating content from Gemini API:', error);
    // Re-throw the original error to be handled by the UI component
    throw error;
  }
};