"use client";

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CloudSun } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const WeatherFeatureToggle: React.FC = () => {
  const { isWeatherFeatureEnabled, toggleWeatherFeature } = useSettings();

  return (
    <div className="flex items-center justify-between space-x-2 px-4 py-2">
      <div className="flex items-center">
        <CloudSun className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-200" />
        <Label htmlFor="weather-feature" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Fitur Cuaca
        </Label>
      </div>
      <Switch
        id="weather-feature"
        checked={isWeatherFeatureEnabled}
        onCheckedChange={toggleWeatherFeature}
      />
    </div>
  );
};

export default WeatherFeatureToggle;