"use client";

import React, { useEffect, useState } from 'react';
import MapComponent from '@/components/MapComponent';
import { fetchAndParseTorinoCSV } from '@/utils/csvParser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

interface MapMarker {
  lat: number;
  lng: number;
  popupText: string;
  color?: string;
}

const TorinoDataMap = () => {
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAndParseTorinoCSV('/torinoo/torino.csv'); // Path to your CSV
        const markers: MapMarker[] = data.map(item => ({
          lat: item.latitude,
          lng: item.longitude,
          popupText: `Lat: ${item.latitude.toFixed(4)}, Lng: ${item.longitude.toFixed(4)}`, // Customize popup
          color: 'blue', // Default color for Torino data points
        }));
        setMapMarkers(markers);
      } catch (err) {
        console.error("Error loading Torino data:", err);
        setError("Failed to load Torino data. Please check the CSV file and its path.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 p-4 md:p-6">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Torino Data Map</CardTitle>
          <p className="text-sm text-gray-600">Visualizing geographical data from `torino.csv`.</p>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-gray-700">Loading Torino data...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-600">
              <p className="mb-2">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <div className="h-full w-full rounded-md">
              <MapComponent markers={mapMarkers} />
            </div>
          )}
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default TorinoDataMap;