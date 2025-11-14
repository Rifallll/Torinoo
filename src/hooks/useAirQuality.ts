"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface AirQualityData {
  aqi: number;
  dominant_pollutant: string;
  city: { name: string; url: string; }; // FIX 1: Changed city to an object
  country: string;
  iaqi: {
    co?: { v: number };
    no2?: { v: number };
    o3?: { v: number };
    so2?: { v: number };
    pm25?: { v: number };
    pm10?: { v: number };
  };
  time: {
    s: string; // "2023-11-15 10:00:00"
    tz: string; // "+01:00"
    v: number; // timestamp
    iso: string; // "2023-11-15T10:00:00+01:00"
  };
}

interface AirQualityApiResponse {
  status: string;
  data: AirQualityData;
}

const fetchAirQualityData = async (city: string): Promise<AirQualityData> => {
  const apiKey = import.meta.env.VITE_AQICN_API_KEY;
  if (!apiKey) {
    throw new Error("AQICN API Key tidak ditemukan di environment variables.");
  }

  // Coordinates for Torino, Italy
  const latitude = 45.0705;
  const longitude = 7.6868;

  const url = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Gagal mengambil data kualitas udara: ${response.statusText}`);
  }

  const result: AirQualityApiResponse = await response.json();

  if (result.status === "ok") {
    return {
      ...result.data,
      city: result.data.city, // FIX 1: Use the city object directly
      country: "IT", // Hardcode country for Torino
    };
  } else {
    throw new Error(`API AQICN mengembalikan status error: ${result.data}`);
  }
};

export const useAirQuality = (city: string = "Torino", enabled: boolean = true) => {
  return useQuery<AirQualityData, Error>({
    queryKey: ["airQuality", city],
    queryFn: () => fetchAirQualityData(city),
    staleTime: 10 * 60 * 1000, // Data considered fresh for 10 minutes
    refetchOnWindowFocus: false,
    enabled: enabled, // Only run the query if enabled is true
    // FIX 2: Removed onError to resolve TypeScript compile error
  });
};