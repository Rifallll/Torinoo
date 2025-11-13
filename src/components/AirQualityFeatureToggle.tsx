"use client";

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Leaf } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const AirQualityFeatureToggle: React.FC = () => {
  const { isAirQualityFeatureEnabled, toggleAirQualityFeature } = useSettings();

  return (
    <div className="flex items-center justify-between space-x-2 px-4 py-2">
      <div className="flex items-center">
        <Leaf className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-200" />
        <Label htmlFor="air-quality-feature" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Fitur Kualitas Udara
        </Label>
      </div>
      <Switch
        id="air-quality-feature"
        checked={isAirQualityFeatureEnabled}
        onCheckedChange={toggleAirQualityFeature}
      />
    </div>
  );
};

export default AirQualityFeatureToggle;