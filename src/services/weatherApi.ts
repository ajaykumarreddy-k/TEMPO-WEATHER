/// <reference types="vite/client" />
export type WeatherState = 'sunny' | 'rainy' | 'stormy' | 'snowy';
export type Biome = 'plains' | 'desert' | 'taiga' | 'jungle';

export interface WeatherData {
  name?: string;
  desc: string;
  temp: number;
  feelsLike: string;
  visibility: string;
  uv: string;
  tempLevel: number;
  humidity: number;
  wind: number;
  avgTemp: string;
  airDensity: string;
  rainfall: string;
  windSpd: string;
  bgColor: string;
  iconColor: string;
  iconShadow: string;
}

export interface WeatherApiResponse {
  state: WeatherState;
  data: WeatherData;
  coordinates: { x: number, y: number, z: number };
  time: string;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  wind_speed_10m: number[];
  cloud_cover: number[];
  surface_pressure: number[];
  snowfall: number[];
  visibility: number[];
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
}

export interface AirQuality {
  time: string[];
  pm10: number[];
  pm2_5: number[];
  carbon_monoxide: number[];
  nitrogen_dioxide: number[];
  ozone: number[];
  sulphur_dioxide: number[];
  us_aqi: number[];
}

export interface HistoricalWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  wind_speed_10m: number[];
  cloud_cover: number[];
  surface_pressure: number[];
  snowfall: number[];
  visibility: number[];
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1: string;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api';

export const weatherApi = {
  async getWeather(params: { biome?: Biome; lat?: number; lon?: number }): Promise<WeatherApiResponse> {
    const query = new URLSearchParams();
    if (params.biome) query.append('biome', params.biome);
    if (params.lat) query.append('lat', params.lat.toString());
    if (params.lon) query.append('lon', params.lon.toString());
    
    const response = await fetch(`${API_BASE_URL}/weather?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch weather');
    return response.json();
  },

  async getHourly(lat: number, lon: number): Promise<HourlyForecast> {
    const response = await fetch(`${API_BASE_URL}/weather/hourly?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Failed to fetch hourly forecast');
    return response.json();
  },

  async getDaily(lat: number, lon: number): Promise<DailyForecast> {
    const response = await fetch(`${API_BASE_URL}/weather/daily?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Failed to fetch daily forecast');
    return response.json();
  },

  async getAirQuality(lat: number, lon: number): Promise<AirQuality> {
    const response = await fetch(`${API_BASE_URL}/air-quality?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Failed to fetch air quality');
    return response.json();
  },

  async getHistorical(lat: number, lon: number, startDate: string, endDate: string): Promise<HistoricalWeather> {
    const response = await fetch(`${API_BASE_URL}/weather/historical?lat=${lat}&lon=${lon}&start_date=${startDate}&end_date=${endDate}`);
    if (!response.ok) throw new Error('Failed to fetch historical weather');
    return response.json();
  },

  async searchLocations(name: string): Promise<GeocodingResult[]> {
    const response = await fetch(`${API_BASE_URL}/geocoding/search?name=${name}`);
    if (!response.ok) throw new Error('Failed to search locations');
    const data = await response.json();
    return data.results || [];
  },

  async setWeatherOverride(state: WeatherState, biome: Biome, lat?: number, lon?: number): Promise<WeatherApiResponse> {
    const response = await fetch(`${API_BASE_URL}/weather/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state, biome, lat, lon }),
    });
    if (!response.ok) throw new Error('Failed to override weather');
    return response.json();
  }
};

export const WEATHER_DATABASE: Record<WeatherState, WeatherData> = {
  sunny: {
    desc: "The sun is shining brightly.",
    temp: 24,
    feelsLike: "26°C",
    visibility: "16 chunks",
    uv: "MODERATE",
    tempLevel: 72,
    humidity: 15,
    wind: 5,
    avgTemp: "22.5°",
    airDensity: "1.2 kg/m³",
    rainfall: "4.2 mm",
    windSpd: "14 km/h",
    bgColor: "#121212",
    iconColor: "#ffcc33",
    iconShadow: "0 0 30px rgba(255, 204, 51, 0.6)"
  },
  rainy: {
    desc: "Heavy rain is falling.",
    temp: 16,
    feelsLike: "14°C",
    visibility: "8 chunks",
    uv: "LOW",
    tempLevel: 40,
    humidity: 95,
    wind: 45,
    avgTemp: "18.0°",
    airDensity: "1.25 kg/m³",
    rainfall: "24.5 mm",
    windSpd: "28 km/h",
    bgColor: "#0a0d14",
    iconColor: "#4a4a4a",
    iconShadow: "0 0 20px rgba(0, 243, 255, 0.2)"
  },
  stormy: {
    desc: "Severe thunderstorm warning!",
    temp: 14,
    feelsLike: "10°C",
    visibility: "4 chunks",
    uv: "NONE",
    tempLevel: 30,
    humidity: 100,
    wind: 85,
    avgTemp: "15.5°",
    airDensity: "1.28 kg/m³",
    rainfall: "45.0 mm",
    windSpd: "65 km/h",
    bgColor: "#050508",
    iconColor: "#2d2d2d",
    iconShadow: "0 0 30px rgba(255, 77, 0, 0.3)"
  },
  snowy: {
    desc: "Gentle snow is falling.",
    temp: -2,
    feelsLike: "-5°C",
    visibility: "6 chunks",
    uv: "LOW",
    tempLevel: 10,
    humidity: 60,
    wind: 20,
    avgTemp: "-1.5°",
    airDensity: "1.32 kg/m³",
    rainfall: "12.0 mm (Snow)",
    windSpd: "18 km/h",
    bgColor: "#0d1117",
    iconColor: "#e0f2fe",
    iconShadow: "0 0 30px rgba(255, 255, 255, 0.4)"
  }
};

export const BIOME_COORDS: Record<Biome, { x: number, y: number, z: number }> = {
  plains: { x: 39.09, y: 64, z: -94.57 },
  desert: { x: 30.04, y: 70, z: 31.23 },
  taiga: { x: 62.03, y: 85, z: 129.74 },
  jungle: { x: -3.11, y: 68, z: -60.02 }
};
