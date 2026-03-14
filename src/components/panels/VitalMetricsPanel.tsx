import React from 'react';
import { WeatherData } from '../../services/weatherApi';

export const VitalMetricsPanel = ({ currentData, onRefresh }: { currentData: WeatherData, onRefresh: () => void }) => {
  return (
    <div className="voxel-panel p-6 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
        <h3 className="font-pixel text-sm">VITAL METRICS</h3>
        <button onClick={onRefresh} className="font-pixel text-[10px] bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 border-2 border-gray-600 shadow-brutalist transition-all flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>REFRESH</button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between font-pixel text-[10px]"><span>TEMPERATURE LEVEL</span><span className="text-lava-orange">{currentData.tempLevel}%</span></div>
          <div className="h-6 bg-black border-2 border-gray-600 p-1"><div className="h-full bg-lava-orange shadow-glow-orange xp-bar-fill" style={{ width: `${currentData.tempLevel}%` }}></div></div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-pixel text-[10px]"><span>HUMIDITY RATIO</span><span className="text-diamond-cyan">{currentData.humidity}%</span></div>
          <div className="h-6 bg-black border-2 border-gray-600 p-1"><div className="h-full bg-diamond-cyan shadow-glow-cyan xp-bar-fill" style={{ width: `${currentData.humidity}%` }}></div></div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-pixel text-[10px]"><span>WIND INTENSITY</span><span className="text-emerald-green">{currentData.wind}%</span></div>
          <div className="h-6 bg-black border-2 border-gray-600 p-1"><div className="h-full bg-emerald-green xp-bar-fill" style={{ width: `${currentData.wind}%` }}></div></div>
        </div>
      </div>
    </div>
  );
};
