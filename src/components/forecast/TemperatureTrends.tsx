import React, { useMemo } from 'react';
import { DailyForecast } from '../../services/weatherApi';

export const TemperatureTrends = ({ dailyData }: { dailyData: DailyForecast | null }) => {
  const tempPoints = useMemo(() => {
    if (!dailyData) return "";
    const max = Math.max(...dailyData.temperature_2m_max);
    const min = Math.min(...dailyData.temperature_2m_min);
    const range = max - min || 1;
    return dailyData.temperature_2m_max.map((t, i) => {
      const x = (i / (dailyData.temperature_2m_max.length - 1)) * 100;
      const y = 100 - ((t - min) / range) * 80 - 10;
      return `${x},${y}`;
    }).join(' ');
  }, [dailyData]);

  return (
    <div className="voxel-panel p-6 h-80 flex flex-col">
      <h3 className="font-pixel text-sm mb-4">TEMPERATURE TRENDS (NEXT 7 DAYS)</h3>
      <div className="flex-grow relative flex items-end gap-2 border-l-2 border-b-2 border-gray-700 p-2">
        <svg className="absolute inset-0 w-full h-full p-4" preserveAspectRatio="none" viewBox="0 0 100 100">
          <line x1="0" y1="25" x2="100" y2="25" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
          {tempPoints && <polyline className="drop-shadow-lg" fill="none" points={tempPoints} stroke="#00f3ff" strokeWidth="2" />}
        </svg>
        <div className="absolute bottom-[-24px] w-full flex justify-between font-pixel text-[8px] text-gray-500">
          {dailyData?.time.map((t, i) => <span key={i}>{new Date(t).toLocaleDateString(undefined, {weekday: 'short'}).toUpperCase()}</span>)}
        </div>
      </div>
    </div>
  );
};
