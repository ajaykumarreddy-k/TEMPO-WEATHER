import { Biome } from '../services/weatherApi';

export const BIOMES: Record<Biome, { name: string, color: string }> = {
  plains: { name: 'Plains', color: 'text-emerald-green' },
  desert: { name: 'Desert', color: 'text-yellow-500' },
  taiga: { name: 'Taiga', color: 'text-blue-300' },
  jungle: { name: 'Jungle', color: 'text-green-500' }
};

export const getAqiConfig = (aqi: number) => {
  if (aqi <= 50) return { text: 'GOOD', color: 'text-emerald-green', bar: 'bg-emerald-green' };
  if (aqi <= 100) return { text: 'MODERATE', color: 'text-yellow-400', bar: 'bg-yellow-400' };
  if (aqi <= 150) return { text: 'SENSITIVE', color: 'text-orange-400', bar: 'bg-orange-400' };
  if (aqi <= 200) return { text: 'UNHEALTHY', color: 'text-lava-orange', bar: 'bg-lava-orange' };
  if (aqi <= 300) return { text: 'VERY UNHEALTHY', color: 'text-purple-500', bar: 'bg-purple-500' };
  return { text: 'HAZARDOUS', color: 'text-red-700', bar: 'bg-red-700' };
};
