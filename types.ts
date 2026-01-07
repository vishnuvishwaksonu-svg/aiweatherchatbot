
export interface HourlyForecast {
  time: string;
  temp: number;
  feelsLike: number;
  condition: string;
  precip: number; // percentage chance
  precipAmount: number; // rainfall in mm
  snowAmount: number; // snowfall in mm/cm
  uWind: number;
  vWind: number;
  windSpeed: number; // calculated
  windDirection: number; // calculated
  humidity: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  cloudCover: number; // Percentage
  aqi: number; // Air Quality Index
  thunderstorm: string; // Intensity or status
}

export interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  uWind: number; // Zonal wind
  vWind: number; // Meridional wind
  high: number;
  low: number;
  uvIndex: number;
  visibility: number;
  precipAmount: number; // Current rainfall mm
  snowAmount: number; // Current snowfall mm
  timezone: string; // IANA Timezone string
  cloudCover: number; // Percentage
  aqi: number; 
  alerts?: string[];
  thunderstorm?: string;
  forecast: ForecastDay[];
  hourly: HourlyForecast[];
  sources?: ChatSource[];
}

export interface ForecastDay {
  day: string;
  date?: string; // ISO string
  temp: number;
  high: number;
  low: number;
  feelsLike: number;
  condition: string;
  description?: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uWind: number;
  vWind: number;
  pressure: number;
  precip: number; // chance
  precipAmount: number; // rainfall in mm
  snowAmount: number; // snowfall in mm
  uvIndex: number;
  visibility: number;
  cloudCover: number;
  aqi: number;
  thunderstorm: string;
}

export interface ChatSource {
  uri: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: ChatSource[];
}

export type AnalysisParameter = 
  | 'temp' 
  | 'feelsLike' 
  | 'humidity' 
  | 'windSpeed' 
  | 'windDirection'
  | 'pressure' 
  | 'precipAmount' 
  | 'cloudCover' 
  | 'visibility' 
  | 'aqi' 
  | 'snowAmount' 
  | 'uWind' 
  | 'vWind';

export interface AnalysisDataPoint {
  label: string;
  value: number;
  unit: string;
}
