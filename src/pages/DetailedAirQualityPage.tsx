"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, AlertCircle, Thermometer, Wind, Droplet, Cloud, Sun, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAirQuality } from '@/hooks/useAirQuality';
import { useSettings } from '@/contexts/SettingsContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer }
  from 'recharts';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const DetailedAirQualityPage: React.FC = () => {
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

  const getHealthRecommendation = (aqi: number) => {
    if (aqi <= 50) return "Kualitas udara memuaskan, polusi udara menimbulkan sedikit atau tanpa risiko.";
    if (aqi <= 100) return "Kualitas udara dapat diterima; namun, bagi beberapa polutan mungkin ada kekhawatiran kesehatan moderat untuk sejumlah kecil orang yang sangat sensitif terhadap polusi udara.";
    if (aqi <= 150) return "Anggota kelompok sensitif mungkin mengalami efek kesehatan. Masyarakat umum tidak mungkin terpengaruh.";
    if (aqi <= 200) return "Setiap orang mungkin mulai mengalami efek kesehatan; anggota kelompok sensitif mungkin mengalami efek yang lebih serius.";
    if (aqi <= 300) return "Peringatan kesehatan: setiap orang mungkin mengalami efek kesehatan yang lebih serius.";
    return "Peringatan kesehatan: setiap orang mungkin mengalami efek kesehatan yang sangat serius.";
  };

  const getPollutantValue = (iaqi: any, pollutant: string) => {
    return iaqi?.[pollutant]?.v !== undefined ? iaqi[pollutant].v.toFixed(1) : 'N/A';
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
              <p>Fitur kualitas udara saat ini dinonaktifkan. Aktifkan di Pengaturan untuk melihat data.</p>
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Memuat Kualitas Udara...</h1>
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
                <AlertCircle className="h-5 w-5 mr-2" />
                Kesalahan Kualitas Udara
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Gagal memuat data kualitas udara: {error.message}</p>
              <p className="text-sm text-gray-500">Pastikan kunci API AQICN Anda benar dan koneksi internet stabil.</p>
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

  const aqi = data!.aqi;
  const dominantPollutant = data!.dominant_pollutant?.toUpperCase() || 'N/A';
  const aqiDescription = getAqiDescription(aqi);
  const healthRecommendation = getHealthRecommendation(aqi); // Define healthRecommendation here

  // Dummy data for historical trend (replace with actual API data if available)
  const historicalData = [
    { date: '2023-11-08', aqi: 65 },
    { date: '2023-11-09', aqi: 72 },
    { date: '2023-11-10', aqi: 80 },
    { date: '2023-11-11', aqi: 95 },
    { date: '2023-11-12', aqi: 110 },
    { date: '2023-11-13', aqi: 105 },
    { date: '2023-11-14', aqi: 98 },
    { date: '2023-11-15', aqi: aqi }, // Current day
  ];

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

      <main className="flex-1 max-w-6xl mx-auto w-full space-y-8">
        {/* Current Air Quality Summary */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-green-600" />
              Kualitas Udara Terkini di {data!.city.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-5xl font-bold">{aqi} AQI</span>
              <Badge className={`text-lg px-4 py-2 ${getAqiColor(aqi)}`}>{aqiDescription}</Badge>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Polutan Dominan: <span className="font-medium">{dominantPollutant}</span></p>
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
              <p className="text-base">{healthRecommendation}</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              *Data disediakan oleh AQICN.org. Terakhir diperbarui: {new Date(data!.time.iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </p>
          </CardContent>
        </Card>

        {/* Pollutant Details */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Cloud className="h-5 w-5 mr-2 text-gray-600" />
              Detail Polutan Utama
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data!.iaqi || {}).map(([pollutant, valueObj]) => {
              return (
                <div key={pollutant} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <span className="font-medium text-gray-800 dark:text-gray-100">{pollutant.toUpperCase()}:</span>
                  <Badge variant="secondary" className="text-base">{getPollutantValue(data!.iaqi, pollutant)}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Historical AQI Trend (Simulated) */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
              Tren AQI Historis (7 Hari Terakhir)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="date" tickFormatter={(dateStr) => format(new Date(dateStr), 'dd MMM', { locale: id })} className="text-sm text-gray-600 dark:text-gray-400" />
                <YAxis domain={[0, 300]} className="text-sm text-gray-600 dark:text-gray-400" />
                <Tooltip
                  labelFormatter={(label) => format(new Date(label), 'EEEE, dd MMMM yyyy', { locale: id })}
                  formatter={(value: number) => [`${value} AQI`, 'AQI']}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="aqi" stroke="#8884d8" activeDot={{ r: 8 }} name="AQI" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4 text-center">
              *Ini adalah data tren historis yang disimulasikan. Data aktual mungkin bervariasi.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DetailedAirQualityPage;