"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Database, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const DataAnalysisPage = () => {
  const [analysisProgress, setAnalysisProgress] = React.useState(70); // Dummy progress

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
                Sistem Python sedang memproses data lalu lintas yang diunggah. Anda dapat melihat kemajuan di sini.
              </p>
              <div className="space-y-2">
                <Label htmlFor="analysis-progress">Kemajuan:</Label>
                <Progress value={analysisProgress} id="analysis-progress" className="w-full" />
                <p className="text-sm text-gray-500 text-right">{analysisProgress}% Selesai</p>
              </div>
              <p className="text-sm text-gray-600">
                Analisis mencakup pola kemacetan, kecepatan rata-rata, dan prediksi arus.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" className="flex items-center">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Perbarui Status
              </Button>
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
              <Button className="flex items-center" disabled={analysisProgress < 100}>
                <Database className="h-4 w-4 mr-2" />
                Sinkronkan Data Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DataAnalysisPage;