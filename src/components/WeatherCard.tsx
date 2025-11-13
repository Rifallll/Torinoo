"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Thermometer, Wind, Droplet, CloudRain, Sun, Cloud, Snowflake, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWeather } from '@/hooks/useWeather';

const WeatherCard: React.FC = () => {
  const { data, isLoading, error } = useWeather("Torino"); // Pass city name to hook

  const getWeatherIcon = (weathercode: number) => {
    // WMO Weather interpretation codes (https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM)
    if (weathercode === 0) return <Sun className="h-6 w-6 text-yellow-500" />; // Clear sky
    if (weathercode >= 1 && weathercode <= 3) return <CloudSun className="h-6 w-6 text-yellow-500" />; // Mainly clear, partly cloudy, overcast
    if (weathercode >= 45 && weathercode <= 48) return <Cloud className="h-6 w-6 text-gray-500" />; // Fog
    if (weathercode >= 51 && weathercode <= 57) return <CloudRain className="h-6 w-6 text-blue-500" />; // Drizzle
    if (weathercode >= 61 && weathercode <= 67) return <CloudRain className="h-6 w-6 text-blue-500" />; // Rain
    if (weathercode >= 71 && weathercode <= 77) return <Snowflake className="h-6 w-6 text-blue-300" />; // Snow
    if (weathercode >= 80 && weathercode <= 82) return <CloudRain className="h-6 w-6 text-blue-500" />; // Rain showers
    if (weathercode >= 85 && weathercode <= 86) return <Snowflake className="h-6 w-6 text-blue-300" />; // Snow showers
    if (weathercode >= 95 && weathercode <= 99) return <Zap className="h-6 w-6 text-yellow-400" />; // Thunderstorm
    return <CloudSun className="h-6 w-6 text-gray-500" />; // Default
  };

  const getWeatherDescription = (weathercode: number) => {
    if (weathercode === 0) return "Clear sky";
    if (weathercode === 1) return "Mainly clear";
    if (weathercode === 2) return "Partly cloudy";
    if (weathercode === 3) return "Overcast";
    if (weathercode >= 45 && weathercode <= 48) return "Fog";
    if (weathercode >= 51 && weathercode <= 55) return "Drizzle";
    if (weathercode >= 56 && weathercode <= 57) return "Freezing Drizzle";
    if (weathercode >= 61 && weathercode <= 65) return "Rain";
    if (weathercode >= 66 && weathercode <= 67) return "Freezing Rain";
    if (weathercode >= 71 && weathercode <= 75) return "Snow fall";
    if (weathercode === 77) return "Snow grains";
    if (weathercode >= 80 && weathercode <= 82) return "Rain showers";
    if (weathercode >= 85 && weathercode <= 86) return "Snow showers";
    if (weathercode >= 95 && weathercode <= 99) return "Thunderstorm";
    return "N/A";
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <CloudSun className="h-5 w-5 mr-2 text-indigo-600 animate-pulse" />
            <span className="ml-2">Memuat Cuaca...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Mengambil data cuaca terkini untuk Torino.</p>
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
            <span className="ml-2">Kesalahan Cuaca</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Gagal memuat data cuaca: {error.message}</p>
          <p className="text-sm text-gray-500">Pastikan koneksi internet Anda stabil.</p>
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
            <span className="ml-2">Data Cuaca Tidak Tersedia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Tidak ada data cuaca yang dapat dimuat saat ini.</p>
        </CardContent>
      </Card>
    );
  }

  const currentTemp = data.current.temperature_2m;
  const currentHumidity = data.current.relativehumidity_2m;
  const currentWindSpeed = data.current.windspeed_10m;
  const currentConditionCode = data.current.weathercode;
  const currentCondition = getWeatherDescription(currentConditionCode);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          {getWeatherIcon(currentConditionCode)}
          <span className="ml-2">Cuaca Terkini di {data.city}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold">{Math.round(currentTemp)}°C</span>
          <Badge className="text-base px-3 py-1 capitalize">{currentCondition}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{data.city}, {data.country}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Droplet className="h-4 w-4 mr-1 text-blue-500" />
            <span>Kelembaban: {currentHumidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-4 w-4 mr-1 text-gray-500" />
            <span>Angin: {currentWindSpeed.toFixed(1)} m/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;