"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Thermometer, Wind, Droplet, CloudRain, Sun, Cloud, Snowflake, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWeather } from '@/hooks/useWeather';

const WeatherCard: React.FC = () => {
  const { data, isLoading, error } = useWeather();

  const getWeatherIcon = (weatherCode: number) => {
    // WMO Weather interpretation codes (WW)
    // https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
    // Simplified mapping for common codes
    if (weatherCode === 0) return <Sun className="h-6 w-6 text-yellow-500" />; // Clear sky
    if (weatherCode >= 1 && weatherCode <= 3) return <CloudSun className="h-6 w-6 text-yellow-500" />; // Mainly clear, partly cloudy, overcast
    if (weatherCode >= 45 && weatherCode <= 48) return <Cloud className="h-6 w-6 text-gray-500" />; // Fog and depositing rime fog
    if (weatherCode >= 51 && weatherCode <= 55) return <CloudRain className="h-6 w-6 text-blue-500" />; // Drizzle
    if (weatherCode >= 56 && weatherCode <= 57) return <CloudRain className="h-6 w-6 text-blue-500" />; // Freezing Drizzle
    if (weatherCode >= 61 && weatherCode <= 65) return <CloudRain className="h-6 w-6 text-blue-500" />; // Rain
    if (weatherCode >= 66 && weatherCode <= 67) return <CloudRain className="h-6 w-6 text-blue-500" />; // Freezing Rain
    if (weatherCode >= 71 && weatherCode <= 75) return <Snowflake className="h-6 w-6 text-blue-300" />; // Snow fall
    if (weatherCode >= 77) return <Snowflake className="h-6 w-6 text-blue-300" />; // Snow grains
    if (weatherCode >= 80 && weatherCode <= 82) return <CloudRain className="h-6 w-6 text-blue-500" />; // Rain showers
    if (weatherCode >= 85 && weatherCode <= 86) return <Snowflake className="h-6 w-6 text-blue-300" />; // Snow showers
    if (weatherCode >= 95 && weatherCode <= 96) return <Zap className="h-6 w-6 text-yellow-400" />; // Thunderstorm
    if (weatherCode >= 99) return <Zap className="h-6 w-6 text-yellow-400" />; // Thunderstorm with hail

    return <CloudSun className="h-6 w-6 text-gray-500" />; // Default
  };

  const getWeatherDescription = (weatherCode: number) => {
    // Simplified descriptions for common codes
    if (weatherCode === 0) return 'Clear sky';
    if (weatherCode === 1) return 'Mainly clear';
    if (weatherCode === 2) return 'Partly cloudy';
    if (weatherCode === 3) return 'Overcast';
    if (weatherCode >= 45 && weatherCode <= 48) return 'Foggy';
    if (weatherCode >= 51 && weatherCode <= 55) return 'Drizzle';
    if (weatherCode >= 56 && weatherCode <= 57) return 'Freezing Drizzle';
    if (weatherCode >= 61 && weatherCode <= 65) return 'Rain';
    if (weatherCode >= 66 && weatherCode <= 67) return 'Freezing Rain';
    if (weatherCode >= 71 && weatherCode <= 75) return 'Snowfall';
    if (weatherCode >= 77) return 'Snow grains';
    if (weatherCode >= 80 && weatherCode <= 82) return 'Rain showers';
    if (weatherCode >= 85 && weatherCode <= 86) return 'Snow showers';
    if (weatherCode >= 95 && weatherCode <= 96) return 'Thunderstorm';
    if (weatherCode >= 99) return 'Thunderstorm with hail';
    return 'Unknown';
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
          <p className="text-sm text-gray-500">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.current) {
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

  const currentTemp = data.current.temperature_2m;
  const currentHumidity = data.current.relative_humidity_2m;
  const currentWindSpeed = data.current.wind_speed_10m;
  const weatherCode = data.current.weather_code;
  const weatherDescription = getWeatherDescription(weatherCode);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          {getWeatherIcon(weatherCode)}
          <span className="ml-2">Current Weather in Torino</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold">{Math.round(currentTemp)}°C</span>
          <Badge className="text-base px-3 py-1 capitalize">{weatherDescription}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Torino, Italy</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Droplet className="h-4 w-4 mr-1 text-blue-500" />
            <span>Humidity: {currentHumidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-4 w-4 mr-1 text-gray-500" />
            <span>Wind: {currentWindSpeed.toFixed(1)} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;