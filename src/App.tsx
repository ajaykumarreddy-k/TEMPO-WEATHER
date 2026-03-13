import React, { useState, useEffect, useMemo, useRef } from 'react';
import { weatherApi, WeatherState, Biome, WeatherData, WEATHER_DATABASE, BIOME_COORDS } from './services/weatherApi';

const BIOMES: Record<Biome, { name: string, color: string }> = {
  plains: { name: 'Plains', color: 'text-emerald-green' },
  desert: { name: 'Desert', color: 'text-yellow-500' },
  taiga: { name: 'Taiga', color: 'text-blue-300' },
  jungle: { name: 'Jungle', color: 'text-green-500' }
};

const RainLayer = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      opacity: Math.random()
    }));
  }, []);

  return (
    <div className="rain-container" id="rain-layer">
      {drops.map(drop => (
        <div
          key={drop.id}
          className="rain-pixel"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            opacity: drop.opacity
          }}
        />
      ))}
    </div>
  );
};

const SnowLayer = () => {
  const flakes = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      size: `${Math.random() * 4 + 2}px`,
      opacity: Math.random() * 0.6 + 0.4
    }));
  }, []);

  return (
    <div className="snow-container">
      {flakes.map(flake => (
        <div
          key={flake.id}
          className="snow-pixel"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity
          }}
        />
      ))}
    </div>
  );
};

const WeatherIcon = ({ weather }: { weather: WeatherState }) => {
  if (weather === 'sunny') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-24 h-24 bg-yellow-400 border-4 border-yellow-600 z-10 shadow-glow-orange"></div>
        <div className="absolute w-32 h-32 sun-rays flex items-center justify-center">
          <div className="w-full h-4 bg-yellow-300 absolute"></div>
          <div className="h-full w-4 bg-yellow-300 absolute"></div>
          <div className="w-full h-4 bg-yellow-300 absolute rotate-45"></div>
          <div className="h-full w-4 bg-yellow-300 absolute rotate-45"></div>
        </div>
      </div>
    );
  }
  
  if (weather === 'rainy' || weather === 'stormy' || weather === 'snowy') {
    const isStormy = weather === 'stormy';
    const isSnowy = weather === 'snowy';
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Cloud Base */}
        <div className={`absolute w-32 h-16 ${isSnowy ? 'bg-white border-gray-200' : isStormy ? 'bg-gray-800 border-gray-900' : 'bg-gray-400 border-gray-500'} border-4 z-20`}></div>
        <div className={`absolute w-20 h-20 ${isSnowy ? 'bg-white border-gray-200' : isStormy ? 'bg-gray-800 border-gray-900' : 'bg-gray-400 border-gray-500'} border-4 z-10 -mt-16 -ml-8`}></div>
        <div className={`absolute w-16 h-16 ${isSnowy ? 'bg-white border-gray-200' : isStormy ? 'bg-gray-800 border-gray-900' : 'bg-gray-400 border-gray-500'} border-4 z-10 -mt-8 ml-16`}></div>
        
        {/* Weather Effects under cloud */}
        {isStormy && (
          <div className="absolute mt-24 z-0 animate-pulse">
            <svg width="40" height="60" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 0H0V16H8V36L24 12H12L24 0Z" fill="#ffcc33" stroke="#b45309" strokeWidth="2"/>
            </svg>
          </div>
        )}
        {weather === 'rainy' && (
          <div className="absolute mt-24 flex gap-4 z-0">
            <div className="w-2 h-6 bg-blue-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-6 bg-blue-400 animate-bounce" style={{animationDelay: '200ms'}}></div>
            <div className="w-2 h-6 bg-blue-400 animate-bounce" style={{animationDelay: '400ms'}}></div>
          </div>
        )}
        {isSnowy && (
          <div className="absolute mt-24 flex gap-6 z-0">
            <div className="w-3 h-3 bg-blue-100 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
            <div className="w-3 h-3 bg-blue-100 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
            <div className="w-3 h-3 bg-blue-100 rounded-full animate-pulse" style={{animationDelay: '600ms'}}></div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [weather, setWeather] = useState<WeatherState>('sunny');
  const [biome, setBiome] = useState<Biome>('plains');
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentData, setCurrentData] = useState<WeatherData | null>(WEATHER_DATABASE['sunny']);
  const [coords, setCoords] = useState({ x: BIOME_COORDS['plains'].x, y: BIOME_COORDS['plains'].y, z: BIOME_COORDS['plains'].z });

  const locationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await weatherApi.getWeatherByBiome(biome);
        setWeather(response.state);
        setCurrentData(response.data);
        setCoords(response.coordinates);
        
        // Update active slot based on state
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
    fetchData();
  }, [biome]);

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
        const response = await weatherApi.setWeatherOverride(state, biome);
        setWeather(response.state);
        setCurrentData(response.data);
      } catch (error) {
        console.error("Failed to override weather", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await weatherApi.getWeatherByBiome(biome);
      setWeather(response.state);
      setCurrentData(response.data);
      setCoords(response.coordinates);
      
      const stateToIndex: Record<WeatherState, number> = {
        'sunny': 0, 'rainy': 1, 'stormy': 2, 'snowy': 3
      };
      setActiveSlot(stateToIndex[response.state] ?? 0);
    } catch (error) {
      console.error("Failed to refresh weather data", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentData) return null;

  return (
    <div className={`text-gray-100 min-h-screen p-4 sm:p-6 weather-${weather}`}>
      <div className="crt-overlay"></div>
      <div className="lightning-overlay"></div>
      
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-[#121212] flex flex-col items-center justify-center">
          <p className="font-pixel text-white animate-pulse mb-4 text-sm md:text-base">Generating terrain...</p>
          <div className="w-64 h-4 bg-black border-2 border-gray-700 p-[2px] overflow-hidden">
             <div className="h-full bg-emerald-green w-full animate-[loading_0.8s_ease-in-out_infinite]"></div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="voxel-panel p-8 w-[400px] max-w-[90vw] border-4 border-black bg-[#c6c6c6] shadow-[inset_4px_4px_0_#fff,inset_-4px_-4px_0_#555]">
             <h2 className="font-pixel text-xl mb-8 text-black text-center border-b-2 border-gray-500 pb-4">SETTINGS</h2>
             
             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="font-pixel text-xs text-black">Graphics</span>
                 <button className="voxel-panel bg-stone-500 px-4 py-2 font-pixel text-[10px] text-white">FANCY</button>
               </div>
               <div className="flex justify-between items-center">
                 <span className="font-pixel text-xs text-black">Particles</span>
                 <button className="voxel-panel bg-stone-500 px-4 py-2 font-pixel text-[10px] text-white">ALL</button>
               </div>
               <div className="flex justify-between items-center">
                 <span className="font-pixel text-xs text-black">Temp Unit</span>
                 <button className="voxel-panel bg-stone-500 px-4 py-2 font-pixel text-[10px] text-white">CELSIUS</button>
               </div>
             </div>

             <button 
               onClick={() => setIsSettingsOpen(false)} 
               className="voxel-panel w-full py-3 mt-8 bg-stone-500 hover:bg-stone-400 text-white font-pixel text-sm transition-colors"
             >
               DONE
             </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="voxel-panel p-3 px-4 flex items-center gap-3">
              <h1 className="font-pixel text-xl text-white drop-shadow-[2px_2px_0_#000]">TEMPO<span className="text-diamond-cyan">WEATHER</span></h1>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full md:w-auto">
            <div className="flex flex-wrap justify-center items-center gap-2 bg-black/40 p-2 border-2 border-gray-700 w-full sm:w-auto">
              <button 
                className={`weather-toggle-btn ${weather === 'sunny' ? 'active' : ''}`}
                onClick={() => { setWeather('sunny'); setActiveSlot(0); }}
                title="Clear Weather"
              >
                <svg fill="#ffcc33" height="20" viewBox="0 0 24 24" width="20"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-12.37a.996.996 0 00-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zm-12.37 12.37a.996.996 0 00-1.41 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06z"></path></svg>
              </button>
              <button 
                className={`weather-toggle-btn ${weather === 'rainy' ? 'active' : ''}`}
                onClick={() => { setWeather('rainy'); setActiveSlot(1); }}
                title="Toggle Rain"
              >
                <svg fill="#00f3ff" height="20" viewBox="0 0 24 24" width="20"><path d="M12 2c-4.97 0-9 4.03-9 9 0 3.86 2.43 7.15 5.8 8.44l1.24-1.24C7.79 17.27 6 14.34 6 11c0-3.31 2.69-6 6-6s6 2.69 6 6c0 3.34-1.79 6.27-4.04 7.2l1.24 1.24C18.57 18.15 21 14.86 21 11c0-4.97-4.03-9-9-9zM7 22h2l3-3-3-3H7l3 3-3 3zm10-3l-3 3h2l3-3-3-3h-2l3 3z"></path></svg>
              </button>
              <button 
                className={`weather-toggle-btn ${weather === 'stormy' ? 'active' : ''}`}
                onClick={() => { setWeather('stormy'); setActiveSlot(2); }}
                title="Start Storm"
              >
                <svg fill="#ff4d00" height="20" viewBox="0 0 24 24" width="20"><path d="M11 21h-1l1-7H7l5-12h1l-1 7h4l-5 12z"></path></svg>
              </button>
              <button 
                className={`weather-toggle-btn ${weather === 'snowy' ? 'active' : ''}`}
                onClick={() => { setWeather('snowy'); setActiveSlot(3); }}
                title="Start Snow"
              >
                <svg fill="#e0f2fe" height="20" viewBox="0 0 24 24" width="20"><path d="M12 2L10 6H14L12 2ZM12 22L14 18H10L12 22ZM2 12L6 14V10L2 12ZM22 12L18 10V14L22 12ZM6.5 6.5L10 9V5L6.5 6.5ZM17.5 17.5L14 15V19L17.5 17.5ZM17.5 6.5L14 9V5L17.5 6.5ZM6.5 17.5L10 15V19L6.5 17.5Z"></path></svg>
              </button>
            </div>
            <nav className="flex flex-wrap justify-center gap-2 relative w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex items-center w-full sm:w-auto" ref={searchRef}>
                <input 
                  type="text" 
                  placeholder="Search locations..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="voxel-panel px-4 py-2 font-pixel text-[10px] bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-diamond-cyan w-full sm:w-48 h-full"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                
                {searchQuery && (
                  <div className="absolute top-full mt-2 right-0 w-full voxel-panel z-50 flex flex-col p-2 gap-1 shadow-2xl bg-[#373737] animate-slide-down">
                    {Object.entries(BIOMES)
                      .filter(([_, b]) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(([key, b]) => (
                      <button
                        key={key}
                        onClick={() => { setBiome(key as Biome); setSearchQuery(''); setIsLocationOpen(false); }}
                        className={`text-left px-4 py-3 font-pixel text-[10px] hover:bg-white/10 transition-colors ${biome === key ? 'text-diamond-cyan' : 'text-gray-300'}`}
                      >
                        {b.name}
                      </button>
                    ))}
                    {Object.entries(BIOMES).filter(([_, b]) => b.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="text-left px-4 py-3 font-pixel text-[10px] text-gray-500">
                        No locations found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button className="voxel-panel px-6 py-2 font-pixel text-[10px] hover:translate-y-[-2px] active:translate-y-[2px] transition-transform hidden sm:block">DASHBOARD</button>
              
              {/* Location Picker */}
              <div className="relative w-full sm:w-auto" ref={locationRef}>
                <button 
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="voxel-panel px-6 py-2 font-pixel text-[10px] flex items-center justify-between sm:justify-center gap-2 transition-colors h-full w-full sm:w-auto"
                >
                  <span>📍 {BIOMES[biome].name}</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform ${isLocationOpen ? 'rotate-180' : ''}`}>
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
                  </svg>
                </button>
                
                {isLocationOpen && (
                  <div className="absolute top-full mt-2 right-0 w-full sm:w-48 voxel-panel z-50 flex flex-col p-2 gap-1 shadow-2xl bg-[#373737] animate-slide-down">
                    {(Object.entries(BIOMES) as [Biome, {name: string, color: string}][]).map(([key, b]) => (
                      <button
                        key={key}
                        onClick={() => { setBiome(key); setIsLocationOpen(false); }}
                        className={`text-left px-4 py-3 font-pixel text-[10px] hover:bg-white/10 transition-colors ${biome === key ? 'text-diamond-cyan' : 'text-gray-300'}`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => setIsSettingsOpen(true)} className="voxel-panel px-6 py-2 font-pixel text-[10px] opacity-70 hover:opacity-100 hidden sm:block">SETTINGS</button>
            </nav>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-8">
          {/* Hero Section */}
          <section className="col-span-12 lg:col-span-8">
            <div className="voxel-panel p-8 h-full min-h-[400px] flex flex-col justify-between overflow-hidden relative">
              {(weather === 'rainy' || weather === 'stormy') && <RainLayer />}
              {weather === 'snowy' && <SnowLayer />}
              
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="nature-deco absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex items-end justify-around transition-all duration-500">
                <div className="sway-item mb-2" style={{ animationDelay: '0.2s' }}>
                  <svg fill="none" height="32" viewBox="0 0 24 32" width="24"><rect fill="#2d5a27" height="16" width="4" x="10" y="16"></rect><rect fill="#ff4d00" height="8" width="8" x="8" y="10"></rect><rect fill="#ff4d00" height="4" width="16" x="4" y="14"></rect></svg>
                </div>
                <div className="sway-item mb-1" style={{ animationDelay: '0.5s' }}>
                  <svg fill="none" height="48" viewBox="0 0 16 48" width="16"><rect fill="#4caf50" height="48" width="4" x="6" y="0"></rect><rect fill="#388e3c" height="2" width="16" x="0" y="20"></rect></svg>
                </div>
                <div className="sway-item mb-2" style={{ animationDelay: '0.8s' }}>
                  <svg fill="none" height="24" viewBox="0 0 24 24" width="24"><rect fill="#2d5a27" height="12" width="4" x="10" y="12"></rect><rect fill="#00f3ff" height="8" width="8" x="8" y="6"></rect><rect fill="#00f3ff" height="4" width="16" x="4" y="10"></rect></svg>
                </div>
                <div className="sway-item mb-1" style={{ animationDelay: '1.1s' }}>
                  <svg fill="none" height="40" viewBox="0 0 12 40" width="12"><rect fill="#4caf50" height="40" width="4" x="4" y="0"></rect></svg>
                </div>
                <div className="sway-item mb-3" style={{ animationDelay: '0.3s' }}>
                  <svg fill="none" height="32" viewBox="0 0 24 32" width="24"><rect fill="#2d5a27" height="16" width="4" x="10" y="16"></rect><rect fill="#ffcc33" height="12" width="12" x="6" y="8"></rect></svg>
                </div>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2">
                    <span className={`font-pixel text-sm block ${BIOMES[biome].color}`}>CURRENT BIOME: {BIOMES[biome].name.toUpperCase()}</span>
                    <span className="font-pixel text-[10px] text-gray-500 bg-black/40 px-2 py-1">XYZ: {coords.x} / {coords.y} / {coords.z}</span>
                  </div>
                  <h2 className="font-pixel text-6xl md:text-8xl tracking-tighter">{currentData.temp}°<span className="text-diamond-cyan">C</span></h2>
                  <p className="font-sans text-xl text-gray-400 mt-2">{currentData.desc}</p>
                </div>
                
                <div className="w-32 h-32 md:w-48 md:h-48 relative transition-transform duration-700 self-center sm:self-auto mt-4 sm:mt-0">
                  <WeatherIcon weather={weather} />
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <div className="border-l-4 border-lava-orange pl-4 bg-black/20 p-2 hover:bg-black/40 transition-colors cursor-default group">
                  <p className="text-[10px] font-pixel text-gray-400 uppercase group-hover:text-lava-orange transition-colors">Feels Like</p>
                  <p className="text-2xl font-sans font-bold text-white">{currentData.feelsLike}</p>
                </div>
                <div className="border-l-4 border-diamond-cyan pl-4 bg-black/20 p-2 hover:bg-black/40 transition-colors cursor-default group">
                  <p className="text-[10px] font-pixel text-gray-400 uppercase group-hover:text-diamond-cyan transition-colors">Visibility</p>
                  <p className="text-2xl font-sans font-bold text-white">{currentData.visibility}</p>
                </div>
                <div className="border-l-4 border-emerald-green pl-4 bg-black/20 p-2 hover:bg-black/40 transition-colors cursor-default group">
                  <p className="text-[10px] font-pixel text-gray-400 uppercase group-hover:text-emerald-green transition-colors">UV Index</p>
                  <p className="text-2xl font-sans font-bold text-white">{currentData.uv}</p>
                </div>
                <div className="border-l-4 border-gold-block pl-4 bg-black/20 p-2 hover:bg-black/40 transition-colors cursor-default group">
                  <p className="text-[10px] font-pixel text-gray-400 uppercase group-hover:text-gold-block transition-colors">Day Cycle</p>
                  <p className="text-2xl font-sans font-bold text-white">14:20</p>
                </div>
              </div>
              
              {/* Health and Hunger Bars */}
              <div className="w-full flex flex-wrap justify-between items-end gap-2 mt-8 relative z-10 px-2">
                {/* Health */}
                <div className="flex gap-[1px] sm:gap-[2px]">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={`health-${i}`} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 relative">
                      <svg viewBox="0 0 9 9" className="w-full h-full drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
                        <path d="M1 2h2v1h1v1h1V3h2V2h1v2h-1v1h-1v1h-1v1H4V6H3V5H2V4H1V2z" fill="#ff0000"/>
                        <path d="M2 2h1v1H2V2zm4 0h1v1H6V2z" fill="#ff7f7f"/>
                      </svg>
                    </div>
                  ))}
                </div>
                {/* Hunger */}
                <div className="flex gap-[1px] sm:gap-[2px]">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={`hunger-${i}`} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 relative">
                      <svg viewBox="0 0 9 9" className="w-full h-full drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
                        <path d="M2 2h2v1H3v1h1v1h1v1H4V5H3V4H2V2z" fill="#8b4513"/>
                        <path d="M5 1h2v1H6v1h1v1h1v1H7V4H6V3H5V1z" fill="#8b4513"/>
                        <path d="M3 3h1v1H3V3zm3-1h1v1H6V2z" fill="#d2b48c"/>
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* XP Bar representing Temperature Level */}
              <div className="w-full mt-2 flex flex-col items-center gap-1 relative z-10">
                <div className="w-full h-4 bg-black border-2 border-gray-900 p-[2px] shadow-brutalist">
                  <div className="h-full bg-emerald-green transition-all duration-1000 ease-out relative" style={{ width: `${currentData.tempLevel}%` }}>
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-green-300 opacity-50"></div>
                  </div>
                </div>
                <span className="font-pixel text-emerald-green text-sm drop-shadow-[2px_2px_0_#000] mt-1">{currentData.tempLevel}</span>
              </div>
            </div>
          </section>

          {/* Metrics Section */}
          <section className="col-span-12 lg:col-span-4 space-y-6">
            <div className="voxel-panel p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                <h3 className="font-pixel text-sm">VITAL METRICS</h3>
                <button 
                  onClick={handleRefresh}
                  className="font-pixel text-[10px] bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 border-2 border-gray-600 shadow-brutalist active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  REFRESH
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between font-pixel text-[10px]">
                    <span>TEMPERATURE LEVEL</span>
                    <span className="text-lava-orange">{currentData.tempLevel}%</span>
                  </div>
                  <div className="h-6 bg-black border-2 border-gray-600 p-1">
                    <div className="h-full bg-lava-orange shadow-glow-orange xp-bar-fill" style={{ width: `${currentData.tempLevel}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-pixel text-[10px]">
                    <span>HUMIDITY RATIO</span>
                    <span className="text-diamond-cyan">{currentData.humidity}%</span>
                  </div>
                  <div className="h-6 bg-black border-2 border-gray-600 p-1">
                    <div className="h-full bg-diamond-cyan shadow-glow-cyan xp-bar-fill" style={{ width: `${currentData.humidity}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-pixel text-[10px]">
                    <span>WIND INTENSITY</span>
                    <span className="text-emerald-green">{currentData.wind}%</span>
                  </div>
                  <div className="h-6 bg-black border-2 border-gray-600 p-1">
                    <div className="h-full bg-emerald-green xp-bar-fill" style={{ width: `${currentData.wind}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="voxel-panel p-6">
              <h3 className="font-pixel text-sm mb-4 text-gray-300">WEATHER INVENTORY</h3>
              <div className="bg-[#c6c6c6] p-4 border-4 border-black shadow-[inset_4px_4px_0_#fff,inset_-4px_-4px_0_#555]">
                <div className="grid grid-cols-4 gap-2">
                  <div className={`inv-slot ${activeSlot === 0 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(0, 'sunny')} title="Sunny">
                    <img alt="Sun" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3jCSIgtQx3FW6tkMuPWGRL9y61apA_i7Bf1XEVhY0TUkvP8tL-kYaqezIL-7ApT5y8xncrYbDE1loQv4XMX5vZhEmKGiDspJRUFYsmZv9F6gLOT5d-vNTTwavwNmCo8WZQtaxpPxrKiLy_wHlJPLFD9O7vM88LnfnyLxhtMXQ6CLaAPQb7rWDOqR0_qCdN5DCgoGfAQ21YePFlhM5qcQ_rUYJ1Hykkn2ZOxaMAgx0_P0w62KRufIbZjHLozC7ZCigLVRejYKgE50S" width="40" height="40" className="w-6 h-6 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
                  </div>
                  <div className={`inv-slot ${activeSlot === 1 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(1, 'rainy')} title="Rainy">
                    <img alt="Rain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZGmH5bnDTU-pJZe0kH6kU7Wzj3QI2IJfggCVGucgIbRlhNIaBezsf3LM9tWKf6SeumVX07nHTlbae1b8YEBQTAwGuvcPxei3OTqQvRXKD0Duy7GS-w_rcJ4VkooL0wbSU8uS5mnwi9PO6qCw8TXWdyd42j98iaem6OfILzcwSwtJJX7XB8n1xosASdEHApJ9jmYetaZ-9xUFQO_oO827vWCdKEyc_8793RnvEl5KQGhe2Vs87YeHYGi2f7qDqSU_QtMglnCjhyA86" width="40" height="40" className="w-6 h-6 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
                  </div>
                  <div className={`inv-slot ${activeSlot === 2 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(2, 'stormy')} title="Stormy">
                    <img alt="Thunder" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU_VRrTnP0dagCvZM-97ssxoEg5stpOSvGlBu9GmPThR1nUV8b4rbqhV3iBeGPa4hRkZ2d6gZXSYo3owYCOxuiRzcxz8O24zett6-_aBH7dS0OUmqA5IhZA_vw-fZRrr9BNay3gjCzBWGNWHejKT2DUHgvYwTizFFnfygOtYE9eJ-8wOMltbfdoY8fOvmhk2FE1pT338ej7C3rfaqXg_3VH0hJDP6DCKQz-Ro1Wg6AtUdP3vdpLJW1JgSGUuPfQp3KAHHmz50z-LN2" width="40" height="40" className="w-6 h-6 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
                  </div>
                  <div className={`inv-slot ${activeSlot === 3 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(3, 'snowy')} title="Snowy">
                    <img alt="Snow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgjgB9lxdW_EZYI2ycmdD75mmeH9qt_nqTkeutrgaG049hxh41dP5w2r8rTe3ohgg0nR0rWU4h-OH8QBE_rs6h9zESYd4w4nVv-5HpbT2O_MJlw_yD5RMrD8GoYBjMdQhnfJvAFn_h0n6NY8nAAhNnh2PykWxQy0dADRYw0T6eUkvp9ALvXwArOwg2ea3qlJY0JoHgMFOFEzzJGY4pQc9A93ebXXKMadOr4-ddjthJkLMeAvwm90U48kUUEzL_j9EIwQdxUyRV6OHk" width="40" height="40" className="w-6 h-6 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
                  </div>
                  <div className={`inv-slot ${activeSlot === 4 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(4)}></div>
                  <div className={`inv-slot ${activeSlot === 5 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(5)}></div>
                  <div className={`inv-slot ${activeSlot === 6 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(6)}></div>
                  <div className={`inv-slot ${activeSlot === 7 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(7)}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Row */}
          <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="voxel-panel stat-card-dirt p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-900 border-2 border-orange-700 flex items-center justify-center font-pixel text-xl shrink-0">T</div>
              <div>
                <p className="text-[10px] font-pixel text-gray-500 uppercase">Avg Temp</p>
                <p className="text-2xl font-bold">{currentData.avgTemp}</p>
              </div>
            </div>
            <div className="voxel-panel stat-card-stone p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 border-2 border-gray-500 flex items-center justify-center font-pixel text-xl text-diamond-cyan shrink-0">H</div>
              <div>
                <p className="text-[10px] font-pixel text-gray-500 uppercase">Air Density</p>
                <p className="text-2xl font-bold">{currentData.airDensity}</p>
              </div>
            </div>
            <div className="voxel-panel stat-card-diamond p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-900 border-2 border-cyan-500 flex items-center justify-center font-pixel text-xl text-diamond-cyan shrink-0">R</div>
              <div>
                <p className="text-[10px] font-pixel text-gray-500 uppercase">Rainfall</p>
                <p className="text-2xl font-bold">{currentData.rainfall}</p>
              </div>
            </div>
            <div className="voxel-panel stat-card-grass p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-900 border-2 border-green-700 flex items-center justify-center font-pixel text-xl text-emerald-green shrink-0">W</div>
              <div>
                <p className="text-[10px] font-pixel text-gray-500 uppercase">Wind Spd</p>
                <p className="text-2xl font-bold">{currentData.windSpd}</p>
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="col-span-12 grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="voxel-panel p-6 h-80 flex flex-col">
              <h3 className="font-pixel text-sm mb-4">TEMPERATURE TRENDS (7D)</h3>
              <div className="flex-grow relative flex items-end gap-2 border-l-2 border-b-2 border-gray-700 p-2">
                <svg className="absolute inset-0 w-full h-full p-4" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Grid lines */}
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="75" x2="100" y2="75" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
                  
                  <polyline className="drop-shadow-lg animated-line" fill="none" points="0,80 15,70 30,75 45,40 60,30 75,50 90,20 100,10" stroke="#00f3ff" strokeWidth="2"></polyline>
                  <circle cx="0" cy="80" fill="#00f3ff" r="2"></circle>
                  <circle cx="15" cy="70" fill="#00f3ff" r="2"></circle>
                  <circle cx="30" cy="75" fill="#00f3ff" r="2"></circle>
                  <circle cx="45" cy="40" fill="#00f3ff" r="2"></circle>
                  <circle cx="60" cy="30" fill="#00f3ff" r="2"></circle>
                  <circle cx="75" cy="50" fill="#00f3ff" r="2"></circle>
                  <circle cx="90" cy="20" fill="#00f3ff" r="2"></circle>
                </svg>
                <div className="absolute bottom-[-24px] w-full flex justify-between font-pixel text-[8px] text-gray-500">
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                </div>
              </div>
            </div>
            <div className="voxel-panel p-6 h-80 flex flex-col">
              <h3 className="font-pixel text-sm mb-4">RAINFALL DISTRIBUTION</h3>
              <div className="flex-grow flex items-end justify-between gap-1 sm:gap-2 md:gap-4 px-2 sm:px-4 pb-4">
                <div className="w-full bg-blue-600 border-2 border-blue-400 shadow-glow-cyan transition-all duration-1000" style={{ height: weather === 'sunny' ? '10%' : weather === 'rainy' ? '60%' : weather === 'snowy' ? '30%' : '80%' }}></div>
                <div className="w-full bg-blue-600 border-2 border-blue-400 shadow-glow-cyan transition-all duration-1000" style={{ height: weather === 'sunny' ? '20%' : weather === 'rainy' ? '75%' : weather === 'snowy' ? '40%' : '90%' }}></div>
                <div className="w-full bg-blue-600 border-2 border-blue-400 shadow-glow-cyan transition-all duration-1000" style={{ height: weather === 'sunny' ? '5%' : weather === 'rainy' ? '85%' : weather === 'snowy' ? '50%' : '100%' }}></div>
                <div className="w-full bg-blue-600 border-2 border-blue-400 shadow-glow-cyan transition-all duration-1000" style={{ height: weather === 'sunny' ? '15%' : weather === 'rainy' ? '50%' : weather === 'snowy' ? '20%' : '70%' }}></div>
                <div className="w-full bg-blue-600 border-2 border-blue-400 shadow-glow-cyan transition-all duration-1000" style={{ height: weather === 'sunny' ? '8%' : weather === 'rainy' ? '65%' : weather === 'snowy' ? '35%' : '85%' }}></div>
                <div className="w-full bg-blue-600 border-2 border-blue-400 shadow-glow-cyan transition-all duration-1000" style={{ height: weather === 'sunny' ? '25%' : weather === 'rainy' ? '90%' : weather === 'snowy' ? '45%' : '95%' }}></div>
                <div className="w-full bg-blue-600 border-2 border-blue-400 shadow-glow-cyan transition-all duration-1000" style={{ height: weather === 'sunny' ? '12%' : weather === 'rainy' ? '40%' : weather === 'snowy' ? '15%' : '60%' }}></div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 text-center border-t border-gray-800 pt-8 pb-12">
          <p className="font-pixel text-[10px] text-gray-600 tracking-widest">TEMPO-WEATHER OS v1.0.4 - RUNNING ON DEEPSLATE ENGINE</p>
        </footer>
      </div>
    </div>
  );
}
