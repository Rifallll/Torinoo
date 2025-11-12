"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Thermometer, Wind, Droplet, CloudRain, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWeather } from '@/hooks/useWeather'; // Import the new hook

const WeatherCard: React.FC = () => {
  const { data, isLoading, error } = useWeather("Torino,it");

  const getWeatherIcon = (iconCode: string) => {
    // OpenWeatherMap icon codes: https://openweathermap.org/weather-conditions#How-to-get-icon-URL
    // Mapping some common icons to Lucide React icons
    if (iconCode.includes('01')) return <Sun className="h-6 w-6 text-yellow-500" />; // Clear sky
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <CloudSun className="h-6 w-6 text-yellow-500" />; // Few clouds, scattered clouds, broken clouds
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="h-6 w-6 text-blue-500" />; // Shower rain, rain
    if (iconCode.includes('11')) return <CloudRain className="h-6 w-6 text-red-500" />; // Thunderstorm
    if (iconCode.includes('13')) return <CloudSun className="h-6 w-6 text-gray-500" />; // Snow (using cloud-sun as a placeholder for now)
    if (iconCode.includes('50')) return <CloudSun className="h-6 w-6 text-gray-500" />; // Mist (using cloud-sun as a placeholder for now)
    return <CloudSun className="h-6 w-6 text-gray-500" />; // Default
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <CloudSun className="h-5 w-5 mr-2 text-indigo-600 animate-pulse" />
            <span className="ml-2">Loading Weather...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Fetching current weather data for Torino.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg border-red-500">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-500 flex items-center">
            <Thermometer className="h-5 w-5 mr-2" />
            <span className="ml-2">Weather Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Failed to load weather data: {error.message}</p>
          <p className="text-sm text-gray-500">Please ensure the API key is set correctly and try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <CloudSun className="h-5 w-5 mr-2 text-indigo-600" />
            <span className="ml-2">Weather Data Unavailable</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>No weather data could be loaded at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const currentCondition = data.weather[0]?.description || 'N/A';
  const currentIconCode = data.weather[0]?.icon || '';

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          {getWeatherIcon(currentIconCode)}
          <span className="ml-2">Current Weather in {data.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold">{Math.round(data.main.temp)}°C</span>
          <Badge className="text-base px-3 py-1 capitalize">{currentCondition}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{data.name}, Italy</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Droplet className="h-4 w-4 mr-1 text-blue-500" />
            <span>Humidity: {data.main.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-4 w-4 mr-1 text-gray-500" />
            <span>Wind: {Math.round(data.wind.speed * 3.6)} km/h</span> {/* Convert m/s to km/h */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;