import React from 'react';
import { AirQuality } from '../../services/weatherApi';
import { getAqiConfig } from '../../utils/helpers';

export const AirQualityPanel = ({ airQualityData }: { airQualityData: AirQuality | null }) => {
  return (
    <div className="voxel-panel p-6">
      <h3 className="font-pixel text-sm mb-4 text-gray-300">AIR QUALITY</h3>
      {airQualityData ? (() => {
        const currentAqi = airQualityData.us_aqi[0] || 0;
        const config = getAqiConfig(currentAqi);
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <span className="font-pixel text-4xl">{currentAqi}</span>
              <span className={`font-pixel text-[10px] ${config.color}`}>{config.text}</span>
            </div>
            <div className="h-4 bg-black border-2 border-gray-600 p-[2px] shadow-[inset_2px_2px_0_rgba(255,255,255,0.1)]">
              <div className={`h-full ${config.bar} transition-all duration-1000`} style={{ width: `${Math.min(currentAqi / 5, 100)}%` }}></div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
               <div className="bg-black/40 p-2 border-l-2 border-gray-600 hover:border-diamond-cyan transition-colors">
                 <span className="font-pixel text-[8px] text-gray-500 block">PM2.5</span>
                 <span className="font-sans font-bold text-sm text-gray-200">{airQualityData.pm2_5[0]} µg/m³</span>
               </div>
               <div className="bg-black/40 p-2 border-l-2 border-gray-600 hover:border-diamond-cyan transition-colors">
                 <span className="font-pixel text-[8px] text-gray-500 block">PM10</span>
                 <span className="font-sans font-bold text-sm text-gray-200">{airQualityData.pm10[0]} µg/m³</span>
               </div>
            </div>
          </div>
        );
      })() : (
        <div className="animate-pulse bg-gray-800 h-24 w-full border-2 border-gray-700"></div>
      )}
    </div>
  );
};
