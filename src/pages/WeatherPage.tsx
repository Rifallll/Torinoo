"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CloudSun, Thermometer, Wind, Droplet, CloudRain, Sun, Cloud, Snowflake, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWeather } from '@/hooks/useWeather'; // Import the new hook

const WeatherPage: React.FC = () => {
  const { data, isLoading, error } = useWeather("Torino,it");

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
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 items-center justify-center">
        <CloudSun className="h-12 w-12 mr-3 text-indigo-600 animate-spin" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Memuat Prakiraan Cuaca...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <CloudSun className="h-8 w-8 mr-3 text-indigo-600" />
            Prakiraan Cuaca Torino
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-red-500 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-500 flex items-center">
                <Thermometer className="h-5 w-5 mr-2" />
                Kesalahan Cuaca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Gagal memuat data cuaca: {error.message}</p>
              <p className="text-sm text-gray-500">Harap pastikan kunci API diatur dengan benar dan coba lagi.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!data || !data.main || !data.weather || data.weather.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <CloudSun className="h-8 w-8 mr-3 text-indigo-600" />
            Prakiraan Cuaca Torino
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <CloudSun className="h-5 w-5 mr-2 text-indigo-600" />
                Data Cuaca Tidak Tersedia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Tidak ada data cuaca yang dapat dimuat saat ini.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentCondition = data.weather[0]?.description || 'N/A';
  const currentIconCode = data.weather[0]?.icon || '';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <CloudSun className="h-8 w-8 mr-3 text-indigo-600" />
          Prakiraan Cuaca Torino
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 flex justify-center items-start">
        <Card className="max-w-2xl w-full bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-red-600" />
              Cuaca Terkini di {data.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(currentIconCode)}
                <span className="text-5xl font-bold">{Math.round(data.main.temp)}°C</span>
              </div>
              <Badge className="text-lg px-4 py-2 capitalize">{currentCondition}</Badge>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">{data.name}, {data.sys.country}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Droplet className="h-5 w-5 mr-2 text-blue-500" />
                <span>Kelembaban: {data.main.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="h-5 w-5 mr-2 text-gray-500" />
                <span>Kecepatan Angin: {Math.round(data.wind.speed * 3.6)} km/h</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              *Data disediakan oleh OpenWeatherMap.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WeatherPage;