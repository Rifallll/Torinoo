"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Leaf, Wind } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAirQuality } from '@/hooks/useAirQuality';
import { useSettings } from '@/contexts/SettingsContext'; // Import useSettings

const AirQualityCard: React.FC = () => {
  const { isAirQualityFeatureEnabled } = useSettings(); // Get air quality feature status

  // Only fetch air quality data if the feature is enabled
  const { data, isLoading, error } = useAirQuality('@9364', isAirQualityFeatureEnabled); // Default station UID for Torino (Rubino)

  const getAqiCategory = (aqi: number | undefined) => {
    if (aqi === undefined) return { label: 'N/A', className: 'bg-gray-100 text-gray-600' };
    if (aqi <= 50) return { label: 'Baik', className: 'bg-green-100 text-green-700' };
    if (aqi <= 100) return { label: 'Sedang', className: 'bg-yellow-100 text-yellow-700' };
    if (aqi <= 150) return { label: 'Tidak Sehat (Sensitif)', className: 'bg-orange-100 text-orange-700' };
    if (aqi <= 200) return { label: 'Tidak Sehat', className: 'bg-red-100 text-red-700' };
    if (aqi <= 300) return { label: 'Sangat Tidak Sehat', className: 'bg-purple-100 text-purple-700' };
    return { label: 'Berbahaya', className: 'bg-maroon-100 text-maroon-700' }; // Using a custom maroon for dangerous
  };

  if (!isAirQualityFeatureEnabled) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-gray-500" />
            <span className="ml-2">Fitur Kualitas Udara Dinonaktifkan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Fitur kualitas udara saat ini dinonaktifkan. Aktifkan di Pengaturan untuk melihat data kualitas udara.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-indigo-600 animate-pulse" />
            <span className="ml-2">Memuat Kualitas Udara...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Mengambil data kualitas udara terkini untuk Torino.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg border-red-500">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-500 flex items-center">
            <Leaf className="h-5 w-5 mr-2" />
            <span className="ml-2">Kesalahan Kualitas Udara</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Gagal memuat data kualitas udara: {error}</p>
          <p className="text-sm text-gray-500">Pastikan koneksi internet Anda stabil dan token API valid.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.aqi === undefined) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-indigo-600" />
            <span className="ml-2">Data Kualitas Udara Tidak Tersedia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Tidak ada data kualitas udara yang dapat dimuat saat ini.</p>
        </CardContent>
      </Card>
    );
  }

  const aqiCategory = getAqiCategory(data.aqi);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Leaf className="h-5 w-5 mr-2 text-green-600" />
          <span className="ml-2">Kualitas Udara di {data.city.split(',')[0]}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold">{data.aqi} AQI</span>
          <Badge className={`text-base px-3 py-1 ${aqiCategory.className}`}>{aqiCategory.label}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Terakhir diperbarui: {data.time}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {data.iaqi.pm25 !== undefined && (
            <div className="flex items-center">
              <Cloud className="h-4 w-4 mr-1 text-gray-500" />
              <span>PM2.5: {data.iaqi.pm25} µg/m³</span>
            </div>
          )}
          {data.iaqi.o3 !== undefined && (
            <div className="flex items-center">
              <Wind className="h-4 w-4 mr-1 text-blue-500" />
              <span>O3: {data.iaqi.o3} µg/m³</span>
            </div>
          )}
          {data.iaqi.no2 !== undefined && (
            <div className="flex items-center">
              <Cloud className="h-4 w-4 mr-1 text-red-500" />
              <span>NO2: {data.iaqi.no2} µg/m³</span>
            </div>
          )}
          {data.iaqi.so2 !== undefined && (
            <div className="flex items-center">
              <Cloud className="h-4 w-4 mr-1 text-yellow-500" />
              <span>SO2: {data.iaqi.so2} µg/m³</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityCard;