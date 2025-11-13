"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface TorinoTrafficSegment {
  roadName: string;
  speed: string;
  jam: boolean; // Changed to boolean for jam status
}

interface UseTorinoTrafficDataResult {
  data: TorinoTrafficSegment[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => void;
}

const useTorinoTrafficData = (): UseTorinoTrafficDataResult => {
  const [data, setData] = useState<TorinoTrafficSegment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTorinoTrafficData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

    if (!GEOAPIFY_API_KEY) {
      const errorMessage = "Geoapify API Key not found. Please set VITE_GEOAPIFY_API_KEY in your .env file.";
      console.error(errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }

    const lat = 45.0686;
    const lon = 7.6891;
    // Removed radius parameter to simplify the request
    const zoom = 14; 

    // Corrected URL to use /traffic/flow endpoint without radius
    const apiUrl = `https://api.geoapify.com/v1/traffic/flow?lat=${lat}&lon=${lon}&zoom=${zoom}&apiKey=${GEOAPIFY_API_KEY}`;

    console.log(`Attempting to fetch real-time traffic flow around Torino using Geoapify...`);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log("✅ Torino Traffic Flow Data Found (Geoapify):", data);
      
      const parsedResults: TorinoTrafficSegment[] = [];

      if (data.features && data.features.length > 0) {
        data.features.forEach((feature: any) => {
          const properties = feature.properties;
          const name = properties.name || 'Unknown Road';
          const speed = properties.speed_km_h ? `${properties.speed_km_h} km/h` : 'N/A';
          // jam_factor ranges from 0 (no jam) to 10 (full jam)
          const jamFactor = properties.jam_factor || 0; 
          const jam = jamFactor > 3; // Consider it jammed if jam_factor is above a certain threshold (e.g., 3)

          parsedResults.push({
            roadName: name,
            speed: speed,
            jam: jam,
          });
        });
      } else {
        console.log("⚠️ No traffic flow data found within the specified area.");
        toast.warning("Tidak ada data aliran lalu lintas yang ditemukan dalam area yang ditentukan dari Geoapify.");
      }
      setData(parsedResults);
      toast.success("Real-time Torino traffic data loaded from Geoapify!");

    } catch (err) {
      console.error("❌ Failed to load Geoapify Traffic data:", err);
      setError(`Failed to load Torino traffic data from Geoapify: ${err instanceof Error ? err.message : String(err)}. Please ensure your Geoapify Traffic API quota is available.`);
      toast.error("Failed to load real-time Torino traffic data from Geoapify.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTorinoTrafficData(); // Initial fetch

    const interval = setInterval(fetchTorinoTrafficData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, [fetchTorinoTrafficData]);

  return { data, isLoading, error, fetchData: fetchTorinoTrafficData };
};

export default useTorinoTrafficData;