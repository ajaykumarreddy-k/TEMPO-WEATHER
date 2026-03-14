import React, { useRef, useEffect } from 'react';
import { Biome, WeatherState, GeocodingResult, weatherApi } from '../../services/weatherApi';
import { BIOMES } from '../../utils/helpers';

interface HeaderProps {
  weather: WeatherState;
  setWeather: (w: WeatherState) => void;
  setActiveSlot: (s: number) => void;
  biome: Biome;
  setBiome: (b: Biome) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  searchResults: GeocodingResult[];
  setSearchResults: (r: GeocodingResult[]) => void;
  handleLocationSelect: (loc: GeocodingResult) => void;
}

export const Header: React.FC<HeaderProps> = ({
  weather, setWeather, setActiveSlot, biome, setBiome, searchQuery, setSearchQuery,
  searchResults, setSearchResults, handleLocationSelect
}) => {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSearchQuery, setSearchResults]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const results = await weatherApi.searchLocations(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Search failed", error);
        }
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, setSearchResults]);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="voxel-panel p-3 px-4 flex items-center gap-3">
          <h1 className="font-pixel text-xl text-white drop-shadow-[2px_2px_0_#000]">TEMPO<span className="text-diamond-cyan">WEATHER</span></h1>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full md:w-auto">
        <nav className="flex justify-end relative w-full sm:w-auto">
          <div className="relative flex items-center w-full sm:w-auto" ref={searchRef}>
            <input type="text" placeholder="Search cities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="voxel-panel px-4 py-2 font-pixel text-[10px] bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-diamond-cyan w-full sm:w-64 h-[40px]" />
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            {searchResults.length > 0 && (
              <div className="absolute top-[44px] left-0 right-0 sm:right-auto sm:w-[350px] max-h-60 overflow-y-auto overflow-x-hidden voxel-panel z-[100] flex flex-col p-2 gap-1 shadow-2xl bg-[#373737] animate-slide-down">
                {searchResults.map((res) => (
                  <button key={res.id} title={`${res.name}, ${res.country}`} onClick={() => handleLocationSelect(res)} className="text-left px-4 py-3 font-pixel text-[10px] hover:bg-white/10 transition-colors text-gray-300 w-full break-words">
                    {res.name}, {res.country}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
