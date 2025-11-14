"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRef } from "react"; // Import useRef

interface AirQualityData {
  aqi: number;
  dominant_pollutant: string;
  city: { name: string; url: string; };
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
  if (!apiKey || apiKey === "YOUR_AQICN_API_KEY_HERE") {
    throw new Error("AQICN API Key tidak ditemukan atau belum diatur di environment variables.");
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
      city: result.data.city,
      country: "IT", // Hardcode country for Torino
    };
  } else {
    throw new Error(`API AQICN mengembalikan status error: ${result.data}`);
  }
};

export const useAirQuality = (city: string = "Torino", enabled: boolean = true) => {
  const hasWarnedAboutApiKey = useRef(false); // To prevent repeated toasts

  const queryResult = useQuery<AirQualityData, Error>({
    queryKey: ["airQuality", city],
    queryFn: () => fetchAirQualityData(city),
    staleTime: 10 * 60 * 1000, // Data considered fresh for 10 minutes
    refetchOnWindowFocus: false,
    enabled: enabled,
  });

  // Show warning if API key is missing/placeholder and feature is enabled
  if (enabled && !hasWarnedAboutApiKey.current && (!import.meta.env.VITE_AQICN_API_KEY || import.meta.env.VITE_AQICN_API_KEY === "YOUR_AQICN_API_KEY_HERE")) {
    toast.warning("Kunci API AQICN tidak ditemukan atau belum diatur. Fitur kualitas udara tidak akan tersedia.");
    console.warn("AQICN API Key is missing or is the placeholder. Air quality feature will not be available.");
    hasWarnedAboutApiKey.current = true;
  }

  return queryResult;
};