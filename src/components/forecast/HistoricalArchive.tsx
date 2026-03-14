import React from 'react';
import { HistoricalWeather } from '../../services/weatherApi';

export const HistoricalArchive = ({ historicalData }: { historicalData: HistoricalWeather | null }) => {
  return (
    <section className="col-span-12 mt-2">
      <div className="voxel-panel p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
          <h3 className="font-pixel text-sm text-gray-300">HISTORICAL ARCHIVE (PAST 7 DAYS)</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {historicalData ? (() => {
            const days = new Map<string, { max: number, min: number, precip: number }>();
            historicalData.time.forEach((t, i) => {
              const dateStr = t.split('T')[0];
              const temp = historicalData.temperature_2m[i];
              const precip = historicalData.precipitation[i];
              if (!days.has(dateStr)) {
                days.set(dateStr, { max: temp, min: temp, precip: precip });
              } else {
                const day = days.get(dateStr)!;
                day.max = Math.max(day.max, temp);
                day.min = Math.min(day.min, temp);
                day.precip += precip;
              }
            });
            return Array.from(days.entries()).slice(0, 7).map(([dateStr, day], i) => {
              const date = new Date(dateStr);
              return (
                <div key={i} className="bg-black/40 border-2 border-gray-600 p-3 hover:border-diamond-cyan hover:bg-black/60 transition-colors group flex flex-col justify-between">
                  <div className="text-center border-b border-gray-700 pb-2 mb-3">
                    <span className="font-pixel text-[10px] text-gray-400 group-hover:text-white transition-colors block mb-1">{date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}</span>
                    <span className="font-sans text-xs text-gray-500 group-hover:text-gray-300 block">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    <div className="flex justify-between w-full font-sans text-sm font-bold">
                      <span className="text-lava-orange" title="Max Temp">{Math.round(day.max * 10) / 10}°</span>
                      <span className="text-diamond-cyan" title="Min Temp">{Math.round(day.min * 10) / 10}°</span>
                    </div>
                    <div className="h-[2px] w-full bg-gray-800 my-1"></div>
                    <div className="flex items-center gap-2 font-pixel text-[8px] text-gray-400 bg-gray-900 px-2 py-1 w-full justify-center">
                      <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.5c-3.31 0-6-2.69-6-6 0-3.34 2.69-6 6-6s6 2.69 6 6c0 3.31-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zM12 2c-4.97 0-9 4.03-9 9 0 3.86 2.43 7.15 5.8 8.44l1.24-1.24C7.79 17.27 6 14.34 6 11c0-3.31 2.69-6 6-6s6 2.69 6 6c0 3.34-1.79 6.27-4.04 7.2l1.24 1.24C18.57 18.15 21 14.86 21 11c0-4.97-4.03-9-9-9zM7 22h2l3-3-3-3H7l3 3-3 3zm10-3l-3 3h2l3-3-3-3h-2l3 3z"/></svg>
                      <span>{Math.round(day.precip * 10) / 10}mm</span>
                    </div>
                  </div>
                </div>
              );
            });
          })() : (
            Array.from({ length: 7 }).map((_, i) => <div key={i} className="animate-pulse bg-gray-800 h-32 w-full border-2 border-gray-700"></div>)
          )}
        </div>
      </div>
    </section>
  );
};
