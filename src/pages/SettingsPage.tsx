"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TomTomLayerToggle from '@/components/TomTomLayerToggle'; // Import the TomTom toggle component
import WeatherFeatureToggle from '@/components/WeatherFeatureToggle'; // New: Import the weather toggle component

const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Settings className="h-8 w-8 mr-3 text-indigo-600" />
          Pengaturan Aplikasi
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full space-y-6">
        <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <Settings className="h-5 w-5 mr-2 text-blue-600" /> Pengaturan Peta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TomTomLayerToggle />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aktifkan atau nonaktifkan lapisan lalu lintas real-time dari TomTom di peta. Menonaktifkan dapat menghemat penggunaan API.
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <Settings className="h-5 w-5 mr-2 text-green-600" /> Pengaturan Umum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <WeatherFeatureToggle /> {/* New: Add the weather feature toggle here */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aktifkan atau nonaktifkan fitur prakiraan cuaca di seluruh aplikasi. Menonaktifkan dapat menghemat penggunaan API.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Pengaturan umum lainnya akan ditambahkan di sini.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SettingsPage;