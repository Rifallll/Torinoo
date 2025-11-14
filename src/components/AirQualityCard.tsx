"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloudy, Wind, Droplet, Leaf, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAirQuality } from '@/hooks/useAirQuality';
import { useSettings } from '@/contexts/SettingsContext';

const AirQualityCard: React.FC = () => {
  const { isAirQualityFeatureEnabled } = useSettings();
  const { data, isLoading, error } = useAirQuality("Torino", isAirQualityFeatureEnabled);

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-100 text-green-700"; // Good
    if (aqi <= 100) return "bg-yellow-100 text-yellow-700"; // Moderate
    if (aqi <= 150) return "bg-orange-100 text-orange-700"; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return "bg-red-100 text-red-700"; // Unhealthy
    if (aqi <= 300) return "bg-purple-100 text-purple-700"; // Very Unhealthy
    return "bg-rose-100 text-rose-700"; // Hazardous
  };

  const getAqiDescription = (aqi: number) => {
    if (aqi <= 50) return "Baik";
    if (aqi <= 100) return "Sedang";
    if (aqi <= 150) return "Tidak Sehat (Kelompok Sensitif)";
    if (aqi <= 200) return "Tidak Sehat";
    if (aqi <= 300) return "Sangat Tidak Sehat";
    return "Berbahaya";
  };

  const getPollutantValue = (iaqi: any, pollutant: string) => {
    return iaqi?.[pollutant]?.v !== undefined ? iaqi[pollutant].v.toFixed(1) : 'N/A';
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
          <p>Fitur kualitas udara saat ini dinonaktifkan. Aktifkan di Pengaturan untuk melihat data.</p>
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
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="ml-2">Kesalahan Kualitas Udara</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Gagal memuat data kualitas udara: {error.message}</p>
          <p className="text-sm text-gray-500">Pastikan kunci API AQICN Anda benar dan koneksi internet stabil.</p>
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

  const aqi = data.aqi;
  const dominantPollutant = data.dominant_pollutant?.toUpperCase() || 'N/A';
  const aqiDescription = getAqiDescription(aqi);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Leaf className="h-5 w-5 mr-2 text-green-600" />
          <span className="ml-2">Kualitas Udara di {data.city}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold">{aqi} AQI</span>
          <Badge className={`text-base px-3 py-1 ${getAqiColor(aqi)}`}>{aqiDescription}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Polutan Dominan: <span className="font-medium">{dominantPollutant}</span></p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Indeks Polutan Utama:</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>PM2.5:</span>
              <Badge variant="secondary">{getPollutantValue(data.iaqi, 'pm25')}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>PM10:</span>
              <Badge variant="secondary">{getPollutantValue(data.iaqi, 'pm10')}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>O3:</span>
              <Badge variant="secondary">{getPollutantValue(data.iaqi, 'o3')}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>NO2:</span>
              <Badge variant="secondary">{getPollutantValue(data.iaqi, 'no2')}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>SO2:</span>
              <Badge variant="secondary">{getPollutantValue(data.iaqi, 'so2')}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>CO:</span>
              <Badge variant="secondary">{getPollutantValue(data.iaqi, 'co')}</Badge>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          *Data disediakan oleh AQICN.org. Terakhir diperbarui: {new Date(data.time.iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </p>
      </CardContent>
    </Card>
  );
};

export default AirQualityCard;