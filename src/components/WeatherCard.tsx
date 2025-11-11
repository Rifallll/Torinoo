"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Thermometer, Wind, Droplet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const WeatherCard: React.FC = () => {
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
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          {getWeatherIcon(weatherData.current.icon)}
          <span className="ml-2">Current Weather in Torino</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold">{weatherData.current.temperature}°C</span>
          <Badge className="text-base px-3 py-1">{weatherData.current.condition}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{weatherData.location}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Droplet className="h-4 w-4 mr-1 text-blue-500" />
            <span>Humidity: {weatherData.current.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-4 w-4 mr-1 text-gray-500" />
            <span>Wind: {weatherData.current.windSpeed} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;