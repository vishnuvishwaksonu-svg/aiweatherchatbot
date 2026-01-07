
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { WeatherData, HourlyForecast, ForecastDay, ChatSource, AnalysisParameter } from '../types';

const CACHE_PREFIX = 'skycast_v3_';
const FRESH_TTL = 30 * 60 * 1000; // 30 mins freshness

// Global request deduplicator
const inflightRequests = new Map<string, Promise<WeatherData>>();

async function callWithInfiniteResilience<T>(fn: () => Promise<T>, attempt = 0): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || error?.message?.includes('429');
    const isServerOverload = error?.status === 503 || error?.status === 500;
    
    if ((isRateLimit || isServerOverload) && attempt < 15) {
      const delay = Math.min(30000, Math.pow(1.5, attempt) * 2000) + (Math.random() * 1000);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithInfiniteResilience(fn, attempt + 1);
    }
    throw error;
  }
}

const calculateWindMetrics = (u: number, v: number) => {
  const ws = Math.sqrt(u * u + v * v);
  const wd = (Math.atan2(-u, -v) * 180 / Math.PI + 360) % 360;
  return {
    speed: Number(ws.toFixed(2)),
    direction: Math.round(wd)
  };
};

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  const normalizedCity = (city || '').toLowerCase().trim();
  if (!normalizedCity) throw new Error("City name is required");

  const cacheKey = CACHE_PREFIX + normalizedCity;
  if (inflightRequests.has(normalizedCity)) return inflightRequests.get(normalizedCity)!;

  const cached = localStorage.getItem(cacheKey);
  let cachedData: WeatherData | null = null;
  let isFresh = false;

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    cachedData = data;
    isFresh = Date.now() - timestamp < FRESH_TTL;
  }

  const fetchTask = async (): Promise<WeatherData> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    try {
      const response: GenerateContentResponse = await callWithInfiniteResilience(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Latest weather JSON for ${city}. Include 7 days for forecast.
        {
          "city": string, "temp": num, "feelsLike": num, "condition": string, "description": string,
          "humidity": num, "pressure": num, "uvIndex": num, "visibility": num, "timezone": string,
          "uWind": num, "vWind": num, "high": num, "low": num, "precipAmount": num, "snowAmount": num,
          "cloudCover": num, "aqi": num, "alerts": string[], "thunderstorm": string,
          "forecast": [7]{day, date, temp, high, low, feelsLike, condition, humidity, pressure, precip, precipAmount, snowAmount, uvIndex, visibility, uWind, vWind, cloudCover, aqi, thunderstorm},
          "hourly": [24]{time, temp, feelsLike, condition, precip, precipAmount, snowAmount, humidity, pressure, uvIndex, visibility, uWind, vWind, cloudCover, aqi, thunderstorm}
        }`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      }));

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources: ChatSource[] = chunks 
          ? chunks.map((chunk: any) => chunk.web).filter(Boolean)
          : [];

      const rawText = response.text || '{}';
      const rawData = JSON.parse(rawText);
      
      const processItem = (item: any) => {
        const u = item.uWind ?? 0;
        const v = item.vWind ?? 0;
        const w = calculateWindMetrics(u, v);
        return { 
          ...item, 
          uWind: u,
          vWind: v,
          windSpeed: w.speed, 
          windDirection: w.direction,
          precipAmount: item.precipAmount || 0,
          snowAmount: item.snowAmount || 0,
          cloudCover: item.cloudCover ?? 0,
          aqi: item.aqi ?? 0,
          thunderstorm: item.thunderstorm ?? "None"
        };
      };

      const finalData: WeatherData = {
        ...rawData,
        uWind: rawData.uWind ?? 0,
        vWind: rawData.vWind ?? 0,
        windSpeed: calculateWindMetrics(rawData.uWind ?? 0, rawData.vWind ?? 0).speed,
        windDirection: calculateWindMetrics(rawData.uWind ?? 0, rawData.vWind ?? 0).direction,
        precipAmount: rawData.precipAmount || 0,
        snowAmount: rawData.snowAmount || 0,
        cloudCover: rawData.cloudCover ?? 0,
        aqi: rawData.aqi ?? 0,
        alerts: rawData.alerts || [],
        thunderstorm: rawData.thunderstorm ?? "None",
        forecast: (rawData.forecast || []).map(processItem),
        hourly: (rawData.hourly || []).map(processItem),
        sources: sources.length > 0 ? sources : undefined
      };

      localStorage.setItem(cacheKey, JSON.stringify({ data: finalData, timestamp: Date.now() }));
      inflightRequests.delete(normalizedCity);
      return finalData;
    } catch (error: any) {
      inflightRequests.delete(normalizedCity);
      throw error;
    }
  };

  if (isFresh && cachedData) return cachedData;
  if (cachedData) {
    fetchTask().catch(() => {});
    return cachedData;
  }
  const promise = fetchTask();
  inflightRequests.set(normalizedCity, promise);
  return promise;
};

// --- Analysis Data Service ---

export const fetchHistoricalData = async (
  city: string, 
  parameter: AnalysisParameter, 
  startDate: string, 
  endDate: string, 
  mode: 'Daily' | 'Weekly' | 'Monthly'
): Promise<{ label: string; value: number }[]> => {
  // In a real app, this would be a specialized API call.
  // Here we use Gemini to synthesize realistic historical trends for the requested timeframe.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate historical weather data for ${city} for the parameter ${parameter} from ${startDate} to ${endDate} in ${mode} intervals. Return as JSON array of {label: string, value: number}.`,
    config: { responseMimeType: "application/json" }
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch {
    return [];
  }
};

export const fetchPredictionData = async (
  city: string, 
  parameter: AnalysisParameter, 
  startDate: string, 
  endDate: string, 
  mode: 'Daily' | 'Weekly' | 'Monthly'
): Promise<{ label: string; value: number }[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate predicted weather trends for ${city} for the parameter ${parameter} from ${startDate} to ${endDate} in ${mode} intervals. Return as JSON array of {label: string, value: number}.`,
    config: { responseMimeType: "application/json" }
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch {
    return [];
  }
};
