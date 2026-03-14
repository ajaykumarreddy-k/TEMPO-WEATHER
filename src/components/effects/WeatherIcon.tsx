import React from 'react';
import { WeatherState } from '../../services/weatherApi';

export const WeatherIcon = ({ weather }: { weather: WeatherState }) => {
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
        <div className={`absolute w-32 h-16 ${isSnowy ? 'bg-white border-gray-200' : isStormy ? 'bg-gray-800 border-gray-900' : 'bg-gray-400 border-gray-500'} border-4 z-20`}></div>
        <div className={`absolute w-20 h-20 ${isSnowy ? 'bg-white border-gray-200' : isStormy ? 'bg-gray-800 border-gray-900' : 'bg-gray-400 border-gray-500'} border-4 z-10 -mt-16 -ml-8`}></div>
        <div className={`absolute w-16 h-16 ${isSnowy ? 'bg-white border-gray-200' : isStormy ? 'bg-gray-800 border-gray-900' : 'bg-gray-400 border-gray-500'} border-4 z-10 -mt-8 ml-16`}></div>
        
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
