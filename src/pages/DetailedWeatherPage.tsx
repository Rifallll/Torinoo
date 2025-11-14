"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CloudSun, Thermometer, Wind, Droplet, CloudRain, Sun, Cloud, Snowflake, Zap, CalendarDays, Clock, SunDim } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWeather } from '@/hooks/useWeather';
import { useSettings } from '@/contexts/SettingsContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import locale for Indonesian dates

const DetailedWeatherPage: React.FC = () => {
  const { isWeatherFeatureEnabled } = useSettings();
  const { data, isLoading, error } = useWeather("Torino", isWeatherFeatureEnabled);

  const getWeatherIcon = (weathercode: number) => {
    if (weathercode === 0) return <Sun className="h-6 w-6 text-yellow-500" />;
    if (weathercode >= 1 && weathercode <= 3) return <CloudSun className="h-6 w-6 text-yellow-500" />;
    if (weathercode >= 45 && weathercode <= 48) return <Cloud className="h-6 w-6 text-gray-500" />;
    if (weathercode >= 51 && weathercode <= 57) return <CloudRain className="h-6 w-6 text-blue-500" />;
    if (weathercode >= 61 && weathercode <= 67) return <CloudRain className="h-6 w-6 text-blue-500" />;
    if (weathercode >= 71 && weathercode <= 77) return <Snowflake className="h-6 w-6 text-blue-300" />;
    if (weathercode >= 80 && weathercode <= 82) return <CloudRain className="h-6 w-6 text-blue-500" />;
    if (weathercode >= 85 && weathercode <= 86) return <Snowflake className="h-6 w-6 text-blue-300" />;
    if (weathercode >= 95 && weathercode <= 99) return <Zap className="h-6 w-6 text-yellow-400" />;
    return <CloudSun className="h-6 w-6 text-gray-500" />;
  };

  const getWeatherDescription = (weathercode: number) => {
    if (weathercode === 0) return "Langit cerah";
    if (weathercode === 1) return "Sebagian besar cerah";
    if (weathercode === 2) return "Sebagian berawan";
    if (weathercode === 3) return "Mendung";
    if (weathercode >= 45 && weathercode <= 48) return "Kabut";
    if (weathercode >= 51 && weathercode <= 55) return "Gerimis";
    if (weathercode >= 56 && weathercode <= 57) return "Gerimis beku";
    if (weathercode >= 61 && weathercode <= 65) return "Hujan";
    if (weathercode >= 66 && weathercode <= 67) return "Hujan beku";
    if (weathercode >= 71 && weathercode <= 75) return "Salju";
    if (weathercode === 77) return "Butiran salju";
    if (weathercode >= 80 && weathercode <= 82) return "Hujan ringan";
    if (weathercode >= 85 && weathercode <= 86) return "Hujan salju ringan";
    if (weathercode >= 95 && weathercode <= 99) return "Badai petir";
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

  if (!data || !data.current || !data.hourly || !data.daily) {
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

  // Prepare hourly data for the next 24 hours
  const now = new Date();
  const hourlyForecast = data.hourly.time
    .map((time, index) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      rain: data.hourly.rain[index],
    }))
    .filter(item => item.time >= now)
    .slice(0, 24); // Get next 24 hours

  // Prepare daily data
  const dailyForecast = data.daily.time.map((time, index) => ({
    date: time,
    weathercode: data.daily.weathercode[index],
    tempMax: data.daily.temperature_2m_max[index],
    tempMin: data.daily.temperature_2m_min[index],
    precipitation: data.daily.precipitation_sum[index],
    windSpeedMax: data.daily.windspeed_10m_max[index],
    uvIndexMax: data.daily.uv_index_max[index],
    // humidityMean: data.daily.relativehumidity_2m_mean[index], // Dihapus
  }));

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

      <main className="flex-1 max-w-6xl mx-auto w-full space-y-8">
        {/* Current Weather */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
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

        {/* Hourly Forecast */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Prakiraan Per Jam (24 Jam Berikutnya)
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="flex space-x-4 pb-2">
              {hourlyForecast.map((hourData, index) => (
                <div key={index} className="flex-shrink-0 text-center p-3 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{format(hourData.time, 'HH:mm', { locale: id })}</p>
                  <div className="my-2">{getWeatherIcon(data.current.weathercode)}</div> {/* Using current weather icon for simplicity */}
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{Math.round(hourData.temperature)}°C</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Hujan: {hourData.rain.toFixed(1)} mm</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Forecast */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-green-600" />
              Prakiraan Harian (7 Hari)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dailyForecast.map((dayData, index) => (
              <div key={index} className="flex items-center justify-between border-b last:border-b-0 pb-3 pt-2">
                <div className="flex items-center space-x-3 w-1/3">
                  {getWeatherIcon(dayData.weathercode)}
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{format(dayData.date, 'EEEE, dd MMM', { locale: id })}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{getWeatherDescription(dayData.weathercode)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 w-2/3 justify-end">
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{Math.round(dayData.tempMax)}°C / {Math.round(dayData.tempMin)}°C</span>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <CloudRain className="h-4 w-4 mr-1 text-blue-500" /> {dayData.precipitation.toFixed(1)} mm
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Wind className="h-4 w-4 mr-1 text-gray-500" /> {dayData.windSpeedMax.toFixed(1)} m/s
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <SunDim className="h-4 w-4 mr-1 text-yellow-500" /> {dayData.uvIndexMax.toFixed(0)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DetailedWeatherPage;