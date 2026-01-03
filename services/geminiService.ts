
import { GoogleGenAI } from "@google/genai";

// Fix: Always use named parameter for apiKey and obtain it exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (summary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a professional financial consultant for a restaurant, analyze this financial data and provide 3 actionable insights in Indonesian: ${summary}`,
    });
    // Fix: Access the .text property directly instead of calling it as a method.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, gagal menganalisis data saat ini.";
  }
};
