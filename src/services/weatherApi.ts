export type WeatherState = 'sunny' | 'rainy' | 'stormy' | 'snowy';
export type Biome = 'plains' | 'desert' | 'taiga' | 'jungle';

export interface WeatherData {
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

const WEATHER_DATABASE: Record<WeatherState, WeatherData> = {
  sunny: {
    desc: "The sun is shining brightly over the plains biome.",
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
    desc: "Heavy rain is falling. Perfect for farming and fishing.",
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
    desc: "Severe thunderstorm warning! Watch out for creepers.",
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
    desc: "Gentle snow is falling. The taiga is freezing over.",
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

const BIOME_COORDS: Record<Biome, { x: number, y: number, z: number }> = {
  plains: { x: 124, y: 64, z: -512 },
  desert: { x: 2048, y: 70, z: 1024 },
  taiga: { x: -1500, y: 85, z: -2000 },
  jungle: { x: 5000, y: 68, z: 5000 }
};

const BIOME_DEFAULT_WEATHER: Record<Biome, WeatherState> = {
  plains: 'sunny',
  desert: 'sunny',
  taiga: 'snowy',
  jungle: 'rainy'
};

export const weatherApi = {
  /**
   * Fetches weather data based on the selected biome.
   * Simulates a network request with a delay.
   */
  async getWeatherByBiome(biome: Biome): Promise<WeatherApiResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const state = BIOME_DEFAULT_WEATHER[biome];
        resolve({
          state,
          data: WEATHER_DATABASE[state],
          coordinates: BIOME_COORDS[biome],
          time: new Date().toISOString()
        });
      }, 600); // 600ms simulated latency
    });
  },

  /**
   * Overrides the current weather state manually.
   */
  async setWeatherOverride(state: WeatherState, currentBiome: Biome): Promise<WeatherApiResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          state,
          data: WEATHER_DATABASE[state],
          coordinates: BIOME_COORDS[currentBiome],
          time: new Date().toISOString()
        });
      }, 400); // 400ms simulated latency
    });
  }
};
