
import { GoogleGenAI, Type } from "@google/genai";
import { AIExplanation } from "../types";

export const getMathExplanation = async (expression: string, result: string): Promise<AIExplanation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain the calculation "${expression} = ${result}" in a friendly, educational way. Include a short fun fact about these numbers if possible.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: {
            type: Type.STRING,
            description: "A simple educational explanation of the math."
          },
          funFact: {
            type: Type.STRING,
            description: "An interesting fact about the numbers involved."
          }
        },
        required: ["explanation"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as AIExplanation;
  } catch (e) {
    return { explanation: response.text || "Could not generate explanation." };
  }
};
