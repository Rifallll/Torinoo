"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Info, MapPin, Car, Landmark, ParkingSquare } from 'lucide-react';

interface MapFeatureInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  featureProperties: { [key: string]: any } | null;
}

const MapFeatureInfoPanel: React.FC<MapFeatureInfoPanelProps> = ({ isOpen, onClose, featureProperties }) => {
  if (!featureProperties) {
    return null;
  }

  const getIconForFeature = (properties: { [key: string]: any }) => {
    if (properties.vehicle_type) return <Car className="h-5 w-5 mr-2 text-blue-600" />;
    if (properties.amenity === 'parking') return <ParkingSquare className="h-5 w-5 mr-2 text-green-600" />;
    if (properties.building_type === 'landmark') return <Landmark className="h-5 w-5 mr-2 text-amber-600" />;
    if (properties.road_name || properties.traffic_level) return <MapPin className="h-5 w-5 mr-2 text-red-600" />;
    return <Info className="h-5 w-5 mr-2 text-gray-600" />;
  };

  const getTitleForFeature = (properties: { [key: string]: any }) => {
    if (properties.name) return properties.name;
    if (properties.road_name) return properties.road_name;
    if (properties.vehicle_type) return `Kendaraan (${properties.vehicle_type})`;
    if (properties.amenity) return `Amenity (${properties.amenity})`;
    if (properties.building_type) return `Bangunan (${properties.building_type})`;
    return "Detail Fitur Peta";
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            {getIconForFeature(featureProperties)}
            {getTitleForFeature(featureProperties)}
          </SheetTitle>
          <SheetDescription>
            Properti detail untuk fitur peta yang dipilih.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <ScrollArea className="flex-1 py-4 pr-4">
          <div className="grid gap-4 text-sm">
            {Object.entries(featureProperties).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="text-gray-800 dark:text-gray-100">
                  {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MapFeatureInfoPanel;