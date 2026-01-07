
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { WeatherData, ChatMessage, ChatSource } from "../types";

async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delay = 3000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.status === 429 || error?.message?.includes('429'))) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

const updateCityDashboardDeclaration: FunctionDeclaration = {
  name: 'update_city_dashboard',
  parameters: {
    type: Type.OBJECT,
    description: 'Update the main dashboard to show weather for a specific city.',
    properties: {
      city: {
        type: Type.STRING,
        description: 'The name of the city to display weather for.',
      },
    },
    required: ['city'],
  },
};

export const chatWithWeatherExpert = async (history: ChatMessage[], weather: WeatherData | null) => {
    // Initializing GoogleGenAI using process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const contents = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
    }));

    try {
        // Explicitly type response as GenerateContentResponse to fix property access errors
        const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents,
            config: {
                systemInstruction: `You are SkyCast AI, a weather expert. 
                ${weather ? `Current context: ${weather.city}, ${weather.temp}°C, ${weather.condition}.` : ''}
                Be concise. Use the tool to update the dashboard if the user wants to see weather for another city.`,
                tools: [
                  // Removed googleSearch because it cannot be used with other tools like functionDeclarations
                  { functionDeclarations: [updateCityDashboardDeclaration] }
                ]
            }
        }));

        // Accessing properties directly as defined in GenerateContentResponse
        const text = response.text || "";
        const functionCalls = response.functionCalls;
        
        // Grounding chunks won't be present since googleSearch was removed to comply with multi-tool restrictions
        const sources: ChatSource[] = [];

        let cityToUpdate: string | undefined;
        if (functionCalls && functionCalls.length > 0) {
          const call = functionCalls.find(f => f.name === 'update_city_dashboard');
          if (call && call.args && typeof call.args.city === 'string') {
            cityToUpdate = call.args.city;
          }
        }

        return { 
          text: text || (cityToUpdate ? `Searching for ${cityToUpdate}...` : "I'm analyzing the data..."), 
          sources,
          cityToUpdate 
        };
    } catch (error: any) {
        if (error?.status === 429 || error?.message?.includes('429')) {
          return { text: "I'm experiencing heavy traffic (API Quota Reached). Please wait a moment before asking again.", sources: [] };
        }
        return { text: "I encountered an error. Please try again later.", sources: [] };
    }
}