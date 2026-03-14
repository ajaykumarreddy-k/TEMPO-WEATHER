import React from 'react';
import { Biome, WeatherState, WeatherData } from '../../services/weatherApi';
import { BIOMES } from '../../utils/helpers';
import { RainLayer } from '../effects/RainLayer';
import { SnowLayer } from '../effects/SnowLayer';
import { WeatherIcon } from '../effects/WeatherIcon';

interface MainWeatherPanelProps {
  weather: WeatherState;
  biome: Biome;
  coords: { x: number, z: number };
  currentData: WeatherData;
}

export const MainWeatherPanel: React.FC<MainWeatherPanelProps> = ({ weather, biome, coords, currentData }) => {
  return (
    <div className="voxel-panel p-8 h-full min-h-[400px] flex flex-col justify-between overflow-hidden relative">
      {(weather === 'rainy' || weather === 'stormy') && <RainLayer />}
      {weather === 'snowy' && <SnowLayer />}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2">
            <span className={`font-pixel text-sm block ${BIOMES[biome]?.color || 'text-white'}`}>CURRENT LOCATION: {(currentData.name || BIOMES[biome]?.name || 'CUSTOM').toUpperCase()}</span>
            <span className="font-pixel text-[10px] text-gray-500 bg-black/40 px-2 py-1">LAT: {coords.x.toFixed(2)} / LONG: {coords.z.toFixed(2)}</span>
          </div>
          <h2 className="font-pixel text-6xl md:text-8xl tracking-tighter">{currentData.temp}°<span className="text-diamond-cyan">C</span></h2>
          <p className="font-sans text-xl text-gray-400 mt-2">{currentData.desc}</p>
        </div>
        <div className="w-32 h-32 md:w-48 md:h-48 relative transition-transform duration-700 self-center sm:self-auto mt-4 sm:mt-0"><WeatherIcon weather={weather} /></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="border-l-4 border-lava-orange pl-4 bg-black/20 p-2 hover:bg-black/40 group">
          <p className="text-[10px] font-pixel text-gray-400 uppercase">Feels Like</p>
          <p className="text-2xl font-sans font-bold text-white">{currentData.feelsLike}</p>
        </div>
        <div className="border-l-4 border-diamond-cyan pl-4 bg-black/20 p-2 hover:bg-black/40 group">
          <p className="text-[10px] font-pixel text-gray-400 uppercase">Visibility</p>
          <p className="text-2xl font-sans font-bold text-white">{currentData.visibility}</p>
        </div>
        <div className="border-l-4 border-emerald-green pl-4 bg-black/20 p-2 hover:bg-black/40 group">
          <p className="text-[10px] font-pixel text-gray-400 uppercase">UV Index</p>
          <p className="text-2xl font-sans font-bold text-white">{currentData.uv}</p>
        </div>
        <div className="border-l-4 border-gold-block pl-4 bg-black/20 p-2 hover:bg-black/40 group">
          <p className="text-[10px] font-pixel text-gray-400 uppercase">Humidity</p>
          <p className="text-2xl font-sans font-bold text-white">{currentData.humidity}%</p>
        </div>
      </div>

      <div className="w-full mt-8 flex flex-col items-center gap-1 relative z-10">
        <div className="w-full h-4 bg-black border-2 border-gray-900 p-[2px] shadow-brutalist">
          <div className="h-full bg-emerald-green transition-all duration-1000 ease-out relative" style={{ width: `${currentData.tempLevel}%` }}>
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-green-300 opacity-50"></div>
          </div>
        </div>
        <span className="font-pixel text-emerald-green text-sm drop-shadow-[2px_2px_0_#000] mt-1">{currentData.tempLevel}</span>
      </div>
    </div>
  );
};
