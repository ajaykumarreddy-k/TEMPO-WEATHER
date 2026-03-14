import React from 'react';
import { DailyForecast } from '../../services/weatherApi';

export const StatCards = ({ dailyData }: { dailyData: DailyForecast | null }) => {
  return (
    <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="voxel-panel stat-card-dirt p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-900 border-2 border-orange-700 flex items-center justify-center font-pixel text-xl shrink-0">T</div>
        <div><p className="text-[10px] font-pixel text-gray-500 uppercase">Min / Max</p><p className="text-xl font-bold">{dailyData ? `${dailyData.temperature_2m_min[0]}° / ${dailyData.temperature_2m_max[0]}°` : '--'}</p></div>
      </div>
      <div className="voxel-panel stat-card-stone p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-700 border-2 border-gray-500 flex items-center justify-center font-pixel text-xl text-diamond-cyan shrink-0">S</div>
        <div><p className="text-[10px] font-pixel text-gray-500 uppercase">Sun Cycle</p><p className="text-xl font-bold">{dailyData ? `${dailyData.sunrise[0].split('T')[1].slice(0,5)} ☀️` : '--'}</p></div>
      </div>
      <div className="voxel-panel stat-card-diamond p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-cyan-900 border-2 border-cyan-500 flex items-center justify-center font-pixel text-xl text-diamond-cyan shrink-0">P</div>
        <div><p className="text-[10px] font-pixel text-gray-500 uppercase">Rain Prob</p><p className="text-xl font-bold">{dailyData ? `${dailyData.precipitation_probability_max[0]}%` : '--'}</p></div>
      </div>
      <div className="voxel-panel stat-card-grass p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-900 border-2 border-green-700 flex items-center justify-center font-pixel text-xl text-emerald-green shrink-0">W</div>
        <div><p className="text-[10px] font-pixel text-gray-500 uppercase">Max Wind</p><p className="text-xl font-bold">{dailyData ? `${dailyData.wind_speed_10m_max[0]} km/h` : '--'}</p></div>
      </div>
    </section>
  );
};
