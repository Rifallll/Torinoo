"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Leaf, Bike } from 'lucide-react'; // Import Leaf and Bike icons
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TomTomLayerToggle from '@/components/TomTomLayerToggle';
import WeatherFeatureToggle from '@/components/WeatherFeatureToggle';
import AirQualityFeatureToggle from '@/components/AirQualityFeatureToggle';
import TorinoPathsLayerToggle from '@/components/TorinoPathsLayerToggle'; // New: Import TorinoPathsLayerToggle

const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Settings className="h-8 w-8 mr-3 text-indigo-600" />
          Application Settings
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full space-y-6">
        <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <Settings className="h-5 w-5 mr-2 text-blue-600" /> Map Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TomTomLayerToggle />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enable or disable the real-time TomTom traffic layer on the map. Disabling it can save API usage.
            </p>
            <TorinoPathsLayerToggle /> {/* New: Add the Torino paths layer toggle here */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enable or disable the Torino bicycle and pedestrian paths layer on the map.
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <Settings className="h-5 w-5 mr-2 text-green-600" /> General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <WeatherFeatureToggle />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enable or disable the weather forecast feature across the application. Disabling it can save API usage.
            </p>
            <AirQualityFeatureToggle />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enable or disable the air quality feature across the application. Disabling it can save API usage.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Other general settings will be added here.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SettingsPage;