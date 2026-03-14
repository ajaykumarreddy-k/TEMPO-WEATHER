import React from 'react';
import { HourlyForecast } from '../../services/weatherApi';

export const HourlyPrecipitation = ({ hourlyData }: { hourlyData: HourlyForecast | null }) => {
  return (
    <div className="voxel-panel p-6 h-80 flex flex-col">
      <h3 className="font-pixel text-sm mb-4">HOURLY PRECIPITATION</h3>
      <div className="flex-grow flex items-end justify-between gap-1 px-2 pb-4">
        {hourlyData?.precipitation.slice(0, 24).map((p, i) => (
          <div key={i} className="w-full bg-blue-600 border border-blue-400 shadow-glow-cyan" style={{ height: `${Math.min(p * 20 + 5, 100)}%` }} title={`${p}mm`}></div>
        ))}
      </div>
      <div className="flex justify-between font-pixel text-[8px] text-gray-500 mt-2">
        <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
      </div>
    </div>
  );
};
