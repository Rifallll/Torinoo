"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Cloud, Wind, Thermometer, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAirQuality } from '@/hooks/useAirQuality';
import { useSettings } from '@/contexts/SettingsContext';

const AirQualityPage: React.FC = () => {
  const { isAirQualityFeatureEnabled } = useSettings();
  const { data, isLoading, error } = useAirQuality('@9364', isAirQualityFeatureEnabled); // Default station UID for Torino (Rubino)

  const getAqiCategory = (aqi: number | undefined) => {
    if (aqi === undefined) return { label: 'N/A', className: 'bg-gray-100 text-gray-600' };
    if (aqi <= 50) return { label: 'Baik', className: 'bg-green-100 text-green-700' };
    if (aqi <= 100) return { label: 'Sedang', className: 'bg-yellow-100 text-yellow-700' };
    if (aqi <= 150) return { label: 'Tidak Sehat (Sensitif)', className: 'bg-orange-100 text-orange-700' };
    if (aqi <= 200) return { label: 'Tidak Sehat', className: 'bg-red-100 text-red-700' };
    if (aqi <= 300) return { label: 'Sangat Tidak Sehat', className: 'bg-purple-100 text-purple-700' };
    return { label: 'Berbahaya', className: 'bg-maroon-100 text-maroon-700' };
  };

  const getPollutantIcon = (pollutant: string) => {
    switch (pollutant) {
      case 'pm25': return <Cloud className="h-5 w-5 mr-2 text-gray-500" />;
      case 'pm10': return <Cloud className="h-5 w-5 mr-2 text-gray-500" />;
      case 'o3': return <Wind className="h-5 w-5 mr-2 text-blue-500" />;
      case 'no2': return <Cloud className="h-5 w-5 mr-2 text-red-500" />;
      case 'so2': return <Cloud className="h-5 w-5 mr-2 text-yellow-500" />;
      case 'co': return <Thermometer className="h-5 w-5 mr-2 text-orange-500" />;
      case 'nh3': return <Droplet className="h-5 w-5 mr-2 text-green-500" />;
      default: return <Leaf className="h-5 w-5 mr-2 text-gray-500" />;
    }
  };

  if (!isAirQualityFeatureEnabled) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Leaf className="h-8 w-8 mr-3 text-gray-500" />
            Kualitas Udara Torino
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
                <Leaf className="h-5 w-5 mr-2 text-gray-500" />
                Fitur Kualitas Udara Dinonaktifkan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Fitur kualitas udara saat ini dinonaktifkan. Aktifkan di Pengaturan untuk melihat data kualitas udara.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 items-center justify-center">
        <Leaf className="h-12 w-12 mr-3 text-indigo-600 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Memuat Data Kualitas Udara...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Leaf className="h-8 w-8 mr-3 text-indigo-600" />
            Kualitas Udara Torino
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
                <Leaf className="h-5 w-5 mr-2" />
                Kesalahan Kualitas Udara
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Gagal memuat data kualitas udara: {error}</p>
              <p className="text-sm text-gray-500">Pastikan koneksi internet Anda stabil dan token API valid.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!data || data.aqi === undefined) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Leaf className="h-8 w-8 mr-3 text-indigo-600" />
            Kualitas Udara Torino
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
                <Leaf className="h-5 w-5 mr-2 text-indigo-600" />
                Data Kualitas Udara Tidak Tersedia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Tidak ada data kualitas udara yang dapat dimuat saat ini.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const aqiCategory = getAqiCategory(data.aqi);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Leaf className="h-8 w-8 mr-3 text-indigo-600" />
          Kualitas Udara Torino
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
              <Leaf className="h-5 w-5 mr-2 text-green-600" />
              Kualitas Udara Terkini di {data.city.split(',')[0]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-5xl font-bold">{data.aqi}</span>
                <span className="text-2xl font-semibold">AQI</span>
              </div>
              <Badge className={`text-lg px-4 py-2 ${aqiCategory.className}`}>{aqiCategory.label}</Badge>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Terakhir diperbarui: {data.time}</p>

            <h3 className="font-semibold text-xl mt-6 mb-3 text-gray-800 dark:text-gray-100">Konsentrasi Polutan (µg/m³)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(data.iaqi).map(([pollutant, value]) => (
                value !== undefined && (
                  <div key={pollutant} className="flex items-center p-3 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {getPollutantIcon(pollutant)}
                    <span className="font-medium uppercase mr-2">{pollutant}:</span>
                    <span className="text-gray-800 dark:text-gray-100">{value}</span>
                  </div>
                )
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              *Data disediakan oleh AQICN.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AirQualityPage;