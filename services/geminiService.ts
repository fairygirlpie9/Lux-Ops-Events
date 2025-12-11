import { GoogleGenAI, Type } from "@google/genai";
import { Task, FloorItem, FurnitureType, TaskStatus } from "../types";

// Initialize AI instance lazily to prevent top-level crashes if environment variables are missing on load
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEventScenario = async (
  prompt: string
): Promise<{ tasks: Task[]; floorItems: FloorItem[] } | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a realistic wedding venue operations scenario based on this request: "${prompt}".
      
      Return a JSON object with two arrays:
      1. "tasks": A timeline of 5-8 operational tasks.
      2. "floorItems": A layout of 5-8 furniture items (tables, dance floor) with coordinates (x: 0-800, y: 0-600).
      
      Ensure coordinates fit within a 800x600 canvas.
      Ensure furniture types are one of: TABLE_ROUND, TABLE_RECT, DANCE_FLOOR, ENTRANCE.
      Assign staff names to tables.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  time: { type: Type.STRING },
                  title: { type: Type.STRING },
                  role: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["PENDING", "COMPLETED", "LATE"] }
                }
              }
            },
            floorItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["TABLE_ROUND", "TABLE_RECT", "DANCE_FLOOR", "ENTRANCE"] },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  rotation: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  guests: { type: Type.NUMBER },
                  assignedStaff: { type: Type.STRING }
                }
              }
            }
          }
        }
      },
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to generate scenario", error);
    return null;
  }
};

export const generateChatReply = async (history: string[], newMessage: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a helpful Venue Operations AI assistant. 
      Briefly answer the user's question or acknowledge the operational update.
      Keep it professional and concise (under 50 words).
      
      Chat History:
      ${history.join('\n')}
      
      User: ${newMessage}
      `,
    });
    return response.text || "Received.";
  } catch (error) {
    console.error("Chat generation failed", error);
    return "System offline. Message logged.";
  }
};