"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Thermometer, Wind, Droplet, CloudRain, Sun, Cloud, Snowflake, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWeather } from '@/hooks/useWeather';

const WeatherCard: React.FC = () => {
  const { data, isLoading, error } = useWeather("Torino,it"); // Pass city name to hook

  const getWeatherIcon = (iconCode: string) => {
    // OpenWeatherMap icon codes
    if (iconCode.includes('01')) return <Sun className="h-6 w-6 text-yellow-500" />; // Clear sky
    if (iconCode.includes('02')) return <CloudSun className="h-6 w-6 text-yellow-500" />; // Few clouds
    if (iconCode.includes('03') || iconCode.includes('04')) return <Cloud className="h-6 w-6 text-gray-500" />; // Scattered/Broken clouds
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="h-6 w-6 text-blue-500" />; // Shower rain / Rain
    if (iconCode.includes('11')) return <Zap className="h-6 w-6 text-yellow-400" />; // Thunderstorm
    if (iconCode.includes('13')) return <Snowflake className="h-6 w-6 text-blue-300" />; // Snow
    if (iconCode.includes('50')) return <Cloud className="h-6 w-6 text-gray-400" />; // Mist
    return <CloudSun className="h-6 w-6 text-gray-500" />; // Default
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
          <p className="text-sm text-gray-500">Harap pastikan kunci API diatur dengan benar dan coba lagi.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.main || !data.weather || data.weather.length === 0) {
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

  const currentTemp = data.main.temp;
  const currentHumidity = data.main.humidity;
  const currentWindSpeed = data.wind.speed;
  const currentCondition = data.weather[0].description;
  const currentIconCode = data.weather[0].icon;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          {getWeatherIcon(currentIconCode)}
          <span className="ml-2">Cuaca Terkini di {data.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold">{Math.round(currentTemp)}°C</span>
          <Badge className="text-base px-3 py-1 capitalize">{currentCondition}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{data.name}, {data.sys.country}</p>
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