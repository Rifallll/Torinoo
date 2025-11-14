"use client";

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bike } from 'lucide-react'; // Using Bike icon for paths
import { useSettings } from '@/contexts/SettingsContext';

const TorinoPathsLayerToggle: React.FC = () => {
  const { isTorinoPathsLayerEnabled, toggleTorinoPathsLayer } = useSettings();

  return (
    <div className="flex items-center justify-between space-x-2 px-4 py-2">
      <div className="flex items-center">
        <Bike className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-200" />
        <Label htmlFor="torino-paths-layer" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Torino Paths Layer
        </Label>
      </div>
      <Switch
        id="torino-paths-layer"
        checked={isTorinoPathsLayerEnabled}
        onCheckedChange={toggleTorinoPathsLayer}
      />
    </div>
  );
};

export default TorinoPathsLayerToggle;