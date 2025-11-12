"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Database, RefreshCcw, TrafficCone, Gauge, AlertCircle, Clock, Map, Car, ParkingSquare, Target, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import ProjectPlanningSection from '@/components/ProjectPlanningSection';
import { useTrafficData } from '@/contexts/TrafficDataContext'; // Import the new hook

const DataAnalysisPage = () => {
  const { uploadedData, analysisStatus, analysisProgress, analysisResults, startAnalysis, resetAnalysis } = useTrafficData();

  const getStatusMessage = () => {
    switch (analysisStatus) {
      case 'idle':
        return "Menunggu unggahan data CSV untuk memulai analisis.";
      case 'processing':
        return "Sistem Python sedang memproses data lalu lintas yang diunggah.";
      case 'completed':
        return "Analisis data lalu lintas selesai! Data siap disinkronkan.";
      case 'error':
        return "Terjadi kesalahan selama analisis data.";
      default:
        return "Status tidak diketahui.";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <BarChart2 className="h-8 w-8 mr-3 text-indigo-600" />
          Analisis & Sinkronisasi Data
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Status Analisis Data</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-gray-700">
                {getStatusMessage()}
              </p>
              {analysisStatus !== 'idle' && (
                <div className="space-y-2">
                  <Label htmlFor="analysis-progress">Progres:</Label>
                  <Progress value={analysisProgress} id="analysis-progress" className="w-full" />
                  <p className="text-sm text-gray-500 text-right">{analysisProgress}% Selesai</p>
                </div>
              )}
              {uploadedData && (
                <p className="text-sm text-gray-600 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Data diunggah: {uploadedData.length} baris.
                </p>
              )}
              <p className="text-sm text-gray-600">
                Analisis mencakup pola kemacetan, kecepatan rata-rata, dan prediksi aliran.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              {analysisStatus === 'completed' && (
                <Button variant="outline" onClick={resetAnalysis} className="flex items-center">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset Analisis
                </Button>
              )}
              {analysisStatus === 'idle' && uploadedData && (
                <Button variant="secondary" onClick={startAnalysis} className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Mulai Analisis Ulang
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Sinkronisasi Data</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-gray-700">
                Setelah analisis selesai, Anda dapat menyinkronkan data terbaru ke dashboard untuk visualisasi.
              </p>
              <p className="text-sm text-gray-600">
                Data yang disinkronkan akan memperbarui peta lalu lintas, prediksi, dan laporan.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="flex items-center" disabled={analysisStatus !== 'completed'}>
                <Database className="h-4 w-4 mr-2" />
                Sinkronkan Data Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysisStatus === 'completed' && analysisResults && (
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" /> Hasil Analisis Simulasi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div className="space-y-2">
                <p><strong>Total Catatan:</strong> {analysisResults.totalRecords}</p>
                <p><strong>Lokasi Unik:</strong> {analysisResults.uniqueLocations}</p>
                <p><strong>Kecepatan Rata-rata:</strong> {analysisResults.averageSpeed}</p>
                <p><strong>Segmen Kemacetan Tinggi:</strong> {analysisResults.highCongestionSegments}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">Wawasan Tambahan (Simulasi):</h3>
                <ul className="list-disc list-inside pl-4">
                  <li>Puncak kemacetan terdeteksi pada jam 07:00-09:00 dan 17:00-19:00.</li>
                  <li>Via Roma dan Piazza Castello menunjukkan tingkat kemacetan tertinggi.</li>
                  <li>Rekomendasi: Optimalkan lampu lalu lintas di persimpangan utama.</li>
                </ul>
              </div>
              <p className="lg:col-span-2 text-sm text-gray-500 mt-4">
                *Ini adalah hasil analisis simulasi. Sistem backend Python yang sebenarnya akan memberikan wawasan yang lebih mendalam.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" /> Metrik Analisis Lalu Lintas Utama
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-2">Jenis Analisis Umum:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <TrafficCone className="h-5 w-5 mr-2 text-red-500" />
                  <span>Analisis Kemacetan: Mengidentifikasi dan mengukur hambatan lalu lintas.</span>
                </li>
                <li className="flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Analisis Kecepatan Rata-rata: Melacak kecepatan di berbagai segmen jalan.</span>
                </li>
                <li className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>Analisis Dampak Insiden: Menilai bagaimana insiden memengaruhi aliran lalu lintas.</span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-500" />
                  <span>Keandalan Waktu Tempuh: Mengukur konsistensi waktu tempuh.</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-2">Analisis Lanjutan:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-purple-500" />
                  <span>Analisis Asal-Tujuan: Memahami sumber dan tujuan lalu lintas.</span>
                </li>
                <li className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-orange-500" />
                  <span>Klasifikasi Kendaraan: Mengkategorikan kendaraan (mobil, truk, sepeda motor).</span>
                </li>
                <li className="flex items-center">
                  <ParkingSquare className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Analisis Pola Parkir: Mengoptimalkan ketersediaan dan penggunaan parkir.</span>
                </li>
                <li className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
                  <span>Analisis Tren Historis: Menganalisis pola lalu lintas jangka panjang.</span>
                </li>
              </ul>
            </div>
            <p className="lg:col-span-2 text-sm text-gray-500 mt-4">
              *Analisis ini dilakukan oleh sistem Python backend dan divisualisasikan di sini.
            </p>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <Target className="h-6 w-6 mr-2 text-indigo-600" /> Ikhtisar Perencanaan Proyek
          </h2>
          <ProjectPlanningSection id="project-planning-overview" />
        </div>
      </main>
    </div>
  );
};

export default DataAnalysisPage;