"use client";

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BusFront } from 'lucide-react'; // Using BusFront for public transport
import { useSettings } from '@/contexts/SettingsContext';

const PublicTransportLayerToggle: React.FC = () => {
  const { isPublicTransportLayerEnabled, togglePublicTransportLayer } = useSettings();

  return (
    <div className="flex items-center justify-between space-x-2 px-4 py-2">
      <div className="flex items-center">
        <BusFront className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-200" />
        <Label htmlFor="public-transport-layer" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Lapisan Transportasi Publik
        </Label>
      </div>
      <Switch
        id="public-transport-layer"
        checked={isPublicTransportLayerEnabled}
        onCheckedChange={togglePublicTransportLayer}
      />
    </div>
  );
};

export default PublicTransportLayerToggle;