"use client";

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrafficCone } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const TomTomLayerToggle: React.FC = () => {
  const { isTomTomLayerEnabled, toggleTomTomLayer } = useSettings();

  return (
    <div className="flex items-center justify-between space-x-2 px-4 py-2">
      <div className="flex items-center">
        <TrafficCone className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-200" />
        <Label htmlFor="tomtom-layer" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          TomTom Traffic Layer
        </Label>
      </div>
      <Switch
        id="tomtom-layer"
        checked={isTomTomLayerEnabled}
        onCheckedChange={toggleTomTomLayer}
      />
    </div>
  );
};

export default TomTomLayerToggle;