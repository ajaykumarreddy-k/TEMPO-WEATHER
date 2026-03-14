import React, { useState, useEffect } from 'react';
import { weatherApi, WeatherState, Biome, WeatherData, WEATHER_DATABASE, BIOME_COORDS, HourlyForecast, DailyForecast, GeocodingResult, AirQuality, HistoricalWeather } from './services/weatherApi';
import { Header } from './components/layout/Header';
import { MainWeatherPanel } from './components/panels/MainWeatherPanel';
import { VitalMetricsPanel } from './components/panels/VitalMetricsPanel';
import { AirQualityPanel } from './components/panels/AirQualityPanel';
import { WeatherInventory } from './components/panels/WeatherInventory';
import { StatCards } from './components/panels/StatCards';
import { TemperatureTrends } from './components/forecast/TemperatureTrends';
import { HourlyPrecipitation } from './components/forecast/HourlyPrecipitation';
import { HistoricalArchive } from './components/forecast/HistoricalArchive';

export default function App() {
  const [weather, setWeather] = useState<WeatherState>('sunny');
  const [biome, setBiome] = useState<Biome>('plains');
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentData, setCurrentData] = useState<WeatherData | null>(WEATHER_DATABASE['sunny']);
  const [coords, setCoords] = useState({ x: BIOME_COORDS['plains'].x, y: BIOME_COORDS['plains'].y, z: BIOME_COORDS['plains'].z });
  const [hourlyData, setHourlyData] = useState<HourlyForecast | null>(null);
  const [dailyData, setDailyData] = useState<DailyForecast | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQuality | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalWeather | null>(null);

  const fetchData = async (overrideCoords?: { lat: number, lon: number, name?: string }) => {
    setIsLoading(true);
    try {
      const params = overrideCoords ? { lat: overrideCoords.lat, lon: overrideCoords.lon } : { biome };
      const response = await weatherApi.getWeather(params);
      
      if (overrideCoords?.name) {
        response.data.name = overrideCoords.name;
      }
      
      setWeather(response.state);
      setCurrentData(response.data);
      setCoords(response.coordinates);
      
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];
      const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [hourly, daily, airQuality, historical] = await Promise.all([
        weatherApi.getHourly(response.coordinates.x, response.coordinates.z),
        weatherApi.getDaily(response.coordinates.x, response.coordinates.z),
        weatherApi.getAirQuality(response.coordinates.x, response.coordinates.z),
        weatherApi.getHistorical(response.coordinates.x, response.coordinates.z, startDate, endDate)
      ]);
      setHourlyData(hourly);
      setDailyData(daily);
      setAirQualityData(airQuality);
      setHistoricalData(historical);

      const stateToIndex: Record<WeatherState, number> = {
        'sunny': 0, 'rainy': 1, 'stormy': 2, 'snowy': 3
      };
      setActiveSlot(stateToIndex[response.state] ?? 0);
    } catch (error) {
      console.error("Failed to fetch weather data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load with Chennai coordinates
    fetchData({ lat: 13.0827, lon: 80.2707, name: 'Chennai' });
  }, []);

  useEffect(() => {
    if (currentData) {
      document.body.style.backgroundColor = currentData.bgColor;
    }
  }, [weather, currentData]);

  const handleSlotClick = async (index: number, state?: WeatherState) => {
    setActiveSlot(index);
    if (state) {
      setIsLoading(true);
      try {
        const response = await weatherApi.setWeatherOverride(state, biome, coords.x, coords.z);
        setWeather(response.state);
        setCurrentData(response.data);
      } catch (error) {
        console.error("Failed to override weather", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLocationSelect = (loc: GeocodingResult) => {
    setSearchQuery('');
    setSearchResults([]);
    fetchData({ lat: loc.latitude, lon: loc.longitude, name: loc.name });
  };

  if (!currentData) return null;

  return (
    <div className={`text-gray-100 min-h-screen p-4 sm:p-6 weather-${weather}`}>
      <div className="crt-overlay"></div>
      <div className="lightning-overlay"></div>
      
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-[#121212] flex flex-col items-center justify-center">
          <p className="font-pixel text-white animate-pulse mb-4 text-sm md:text-base">Generating terrain...</p>
          <div className="w-64 h-4 bg-black border-2 border-gray-700 p-[2px] overflow-hidden">
             <div className="h-full bg-emerald-green w-full animate-[loading_0.8s_ease-in-out_infinite]"></div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <Header 
          weather={weather} setWeather={setWeather} setActiveSlot={setActiveSlot}
          biome={biome} setBiome={setBiome} searchQuery={searchQuery}
          setSearchQuery={setSearchQuery} searchResults={searchResults}
          setSearchResults={setSearchResults} handleLocationSelect={handleLocationSelect}
        />

        <main className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-8">
            <MainWeatherPanel weather={weather} biome={biome} coords={coords} currentData={currentData} />
          </section>

          <section className="col-span-12 lg:col-span-4 space-y-6">
            <VitalMetricsPanel currentData={currentData} onRefresh={fetchData} />
            <AirQualityPanel airQualityData={airQualityData} />
            <WeatherInventory activeSlot={activeSlot} handleSlotClick={handleSlotClick} />
          </section>

          <StatCards dailyData={dailyData} />

          <section className="col-span-12 grid grid-cols-1 xl:grid-cols-2 gap-8">
            <TemperatureTrends dailyData={dailyData} />
            <HourlyPrecipitation hourlyData={hourlyData} />
          </section>

          <HistoricalArchive historicalData={historicalData} />
        </main>

        <footer className="mt-12 text-center border-t border-gray-800 pt-8 pb-12">
          <p className="font-pixel text-[10px] text-gray-600 tracking-widest">TEMPO-WEATHER OS v1.2.0 - LIVE DATA SYNC ACTIVE</p>
        </footer>
      </div>
    </div>
  );
}
