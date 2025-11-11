"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CloudSun, Thermometer, Wind, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WeatherPage: React.FC = () => {
  // Dummy weather data for Torino
  const weatherData = {
    location: 'Torino, Italy',
    current: {
      temperature: 22, // Celsius
      condition: 'Partly Cloudy',
      icon: 'cloud-sun',
      humidity: 65, // percentage
      windSpeed: 15, // km/h
    },
    forecast: [
      { day: 'Today', temp: 24, condition: 'Clear', icon: 'sun' },
      { day: 'Tomorrow', temp: 20, condition: 'Light Rain', icon: 'cloud-rain' },
      { day: 'Day After', temp: 23, condition: 'Cloudy', icon: 'cloud' },
    ],
  };

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return <CloudSun className="h-6 w-6 text-yellow-500" />;
      case 'cloud-sun': return <CloudSun className="h-6 w-6 text-yellow-500" />;
      case 'cloud-rain': return <Droplet className="h-6 w-6 text-blue-500" />;
      case 'cloud': return <CloudSun className="h-6 w-6 text-gray-500" />;
      default: return <CloudSun className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <CloudSun className="h-8 w-8 mr-3 text-indigo-600" />
          Torino Weather Forecast
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-red-600" />
              Current Weather
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(weatherData.current.icon)}
                <span className="text-5xl font-bold">{weatherData.current.temperature}°C</span>
              </div>
              <Badge className="text-lg px-4 py-2">{weatherData.current.condition}</Badge>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">{weatherData.location}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Droplet className="h-5 w-5 mr-2 text-blue-500" />
                <span>Humidity: {weatherData.current.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="h-5 w-5 mr-2 text-gray-500" />
                <span>Wind Speed: {weatherData.current.windSpeed} km/h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <CloudSun className="h-5 w-5 mr-2 text-indigo-600" />
              3-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            {weatherData.forecast.map((dayForecast, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                <span className="font-medium">{dayForecast.day}</span>
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(dayForecast.icon)}
                  <span>{dayForecast.temp}°C</span>
                  <Badge variant="outline">{dayForecast.condition}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WeatherPage;