"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CloudSun, Thermometer, Wind, Droplet, CloudRain, Sun, Cloud, Snowflake, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWeather } from '@/hooks/useWeather'; // Import the new hook
import { useSettings } from '@/contexts/SettingsContext'; // New: Import useSettings

const WeatherPage: React.FC = () => {
  const { isWeatherFeatureEnabled } = useSettings(); // New: Get weather feature status

  // Only fetch weather data if the feature is enabled
  const { data, isLoading, error } = useWeather("Torino", isWeatherFeatureEnabled);

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

  if (!isWeatherFeatureEnabled) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <CloudSun className="h-8 w-8 mr-3 text-gray-500" />
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
                <CloudSun className="h-5 w-5 mr-2 text-gray-500" />
                Fitur Cuaca Dinonaktifkan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Fitur prakiraan cuaca saat ini dinonaktifkan. Aktifkan di Pengaturan untuk melihat data cuaca.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
              <p className="text-sm text-gray-500">Pastikan koneksi internet Anda stabil.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!data || !data.current) {
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

  const currentConditionCode = data.current.weathercode;
  const currentCondition = getWeatherDescription(currentConditionCode);

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
              Cuaca Terkini di {data.city}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(currentConditionCode)}
                <span className="text-5xl font-bold">{Math.round(data.current.temperature_2m)}°C</span>
              </div>
              <Badge className="text-lg px-4 py-2 capitalize">{currentCondition}</Badge>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">{data.city}, {data.country}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Droplet className="h-5 w-5 mr-2 text-blue-500" />
                <span>Kelembaban: {data.current.relativehumidity_2m}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="h-5 w-5 mr-2 text-gray-500" />
                <span>Kecepatan Angin: {data.current.windspeed_10m.toFixed(1)} m/s</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              *Data disediakan oleh Open-Meteo.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WeatherPage;