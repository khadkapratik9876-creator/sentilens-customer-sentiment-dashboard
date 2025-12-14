import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ModelType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sentimentTrend: {
      type: Type.ARRAY,
      description: "Daily average sentiment scores derived from the text. If dates are missing, infer a logical timeline.",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
          sentiment: { type: Type.NUMBER, description: "Sentiment score from -1.0 (negative) to 1.0 (positive)" }
        },
        required: ["date", "sentiment"]
      }
    },
    keywords: {
      type: Type.ARRAY,
      description: "Most frequent keywords or phrases indicating complaints or praise.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          value: { type: Type.NUMBER, description: "Frequency or importance score (1-100)" },
          type: { type: Type.STRING, enum: ["complaint", "praise", "neutral"] }
        },
        required: ["text", "value", "type"]
      }
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        overview: { type: Type.STRING, description: "A high-level executive summary of the feedback." },
        actionableAreas: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Top 3 specific, actionable areas for improvement."
        }
      },
      required: ["overview", "actionableAreas"]
    }
  },
  required: ["sentimentTrend", "keywords", "summary"]
};

export const analyzeReviews = async (
  reviewsText: string, 
  useThinking: boolean = false
): Promise<AnalysisResult> => {
  if (!reviewsText.trim()) throw new Error("No reviews provided");

  // Determine model and config
  const model = useThinking ? ModelType.PRO : ModelType.FLASH;
  
  const config: any = {
    responseMimeType: "application/json",
    responseSchema: analysisSchema,
  };

  // Add thinking config if requested
  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
    // DO NOT set maxOutputTokens when using thinkingBudget as per guidelines
  } else {
    // For flash, we can set a reasonable limit or leave default
    config.temperature = 0.5;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze the following customer reviews and extract sentiment trends, keywords, and an executive summary. 
      
      REVIEWS:
      ${reviewsText.slice(0, 100000)} // Safety slice for very large inputs
      `,
      config
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const chatWithReviews = async (
  history: {role: string, parts: {text: string}[]}[],
  newMessage: string,
  contextText: string,
  useThinking: boolean = false
) => {
  const model = ModelType.PRO; // Use Pro for chat as requested by "gemini-3-pro-preview" feature
  
  const config: any = {};
  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const systemInstruction = `You are a helpful AI assistant for a Customer Sentiment Dashboard. 
  You have access to the following raw customer reviews:
  ---
  ${contextText.slice(0, 50000)}
  ---
  Answer the user's questions based specifically on these reviews. Be concise and insightful.`;

  const chat = ai.chats.create({
    model,
    history,
    config: {
      systemInstruction,
      ...config
    }
  });

  const response = await chat.sendMessageStream({
    message: newMessage
  });

  return response;
};
