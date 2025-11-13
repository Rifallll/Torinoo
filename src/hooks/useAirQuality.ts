"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface AirQualityData {
  city: string;
  aqi: number;
  time: string;
  iaqi: {
    co?: number;
    no2?: number;
    o3?: number;
    so2?: number;
    pm25?: number;
    pm10?: number;
    nh3?: number;
    co2?: number;
    ch4?: number;
    // Add other pollutants as needed
    [key: string]: number | undefined;
  };
}

interface UseAirQualityResult {
  data: AirQualityData | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => void;
}

export const useAirQuality = (stationUID: string = '@9364', enabled: boolean = true): UseAirQualityResult => {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAirQualityData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const AQI_TOKEN = import.meta.env.VITE_AQICN_API_TOKEN;

    if (!AQI_TOKEN) {
      const errorMessage = "AQICN API Token not found. Please set VITE_AQICN_API_TOKEN in your .env file.";
      console.error(errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }

    const apiUrl = `https://api.waqi.info/feed/${stationUID}/?token=${AQI_TOKEN}`;

    console.log(`Attempting to fetch Torino Air Quality (AQICN) data from station ${stationUID}...`);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();

      if (json.status === 'ok') {
        console.log("✅ Torino Air Quality Data Found (AQICN):", json.data);
        const rawData = json.data;

        const parsedData: AirQualityData = {
          city: rawData.city.name,
          aqi: rawData.aqi,
          time: rawData.time.s,
          iaqi: {},
        };

        for (const key in rawData.iaqi) {
          if (rawData.iaqi[key] && typeof rawData.iaqi[key].v === 'number') {
            parsedData.iaqi[key] = rawData.iaqi[key].v;
          }
        }
        setData(parsedData);
        toast.success("Real-time Torino air quality data loaded from AQICN!");
      } else {
        const errorMessage = `Failed to get data from AQICN API: ${json.data}. Message: ${json.data}`;
        console.warn(errorMessage);
        setError(errorMessage);
        toast.warning("Gagal memuat data kualitas udara dari AQICN. Token mungkin tidak valid atau stasiun tidak mengirim data.");
      }
    } catch (err) {
      console.error("❌ Failed to load AQICN Air Quality data:", err);
      setError(`Failed to load Torino air quality data from AQICN: ${err instanceof Error ? err.message : String(err)}. Please ensure your AQICN API quota is available.`);
      toast.error("Failed to load real-time Torino air quality data from AQICN.");
    } finally {
      setIsLoading(false);
    }
  }, [stationUID, enabled]);

  useEffect(() => {
    fetchAirQualityData(); // Initial fetch

    const interval = setInterval(fetchAirQualityData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchAirQualityData]);

  return { data, isLoading, error, fetchData: fetchAirQualityData };
};