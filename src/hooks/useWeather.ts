"use client";

import { useQuery } from "@tanstack/react-query";

// Mendefinisikan ulang antarmuka agar sesuai dengan respons JSON langsung dari Open-Meteo API
interface OpenMeteoCurrentData {
  time: string; // ISO 8601 string
  temperature_2m: number;
  weathercode: number;
  windspeed_10m: number;
  relativehumidity_2m: number;
}

interface OpenMeteoHourlyData {
  time: string[]; // Array of ISO 8601 strings
  temperature_2m: number[];
  rain: number[];
}

interface OpenMeteoDailyData {
  time: string[]; // Array of ISO 8601 date strings
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
  uv_index_max: number[];
  // relativehumidity_2m_mean: number[]; // Dihapus karena bukan parameter daily yang valid
}

// Antarmuka untuk respons API mentah
interface OpenMeteoApiResponse {
  latitude: number;
  longitude: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: any;
  current: OpenMeteoCurrentData;
  hourly_units: any;
  hourly: OpenMeteoHourlyData;
  daily_units: any;
  daily: OpenMeteoDailyData;
}

// Antarmuka untuk data yang sudah diurai dan siap digunakan di komponen
interface OpenMeteoParsedData {
  current: {
    time: Date; // Dikonversi ke objek Date
    temperature_2m: number;
    weathercode: number;
    windspeed_10m: number;
    relativehumidity_2m: number;
  };
  hourly: {
    time: Date[]; // Dikonversi ke objek Date
    temperature_2m: number[];
    rain: number[];
  };
  daily: {
    time: Date[]; // Dikonversi ke objek Date
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
    uv_index_max: number[];
    // relativehumidity_2m_mean: number[]; // Dihapus
  };
  city: string;
  country: string;
}

const fetchOpenMeteoWeather = async (city: string): Promise<OpenMeteoParsedData> => {
  const latitude = 45.0705;
  const longitude = 7.6868;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: "temperature_2m,rain",
    current: "temperature_2m,weathercode,windspeed_10m,relativehumidity_2m",
    daily: "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,uv_index_max", // 'relativehumidity_2m_mean' dihapus
    past_days: "0",
    forecast_days: "7",
    timezone: "Europe/Rome", // Secara eksplisit meminta zona waktu untuk konversi waktu yang benar
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  const apiResponse: OpenMeteoApiResponse = await response.json();

  // Mengonversi string ISO ke objek Date
  const parsedData: OpenMeteoParsedData = {
    current: {
      time: new Date(apiResponse.current.time),
      temperature_2m: apiResponse.current.temperature_2m,
      weathercode: apiResponse.current.weathercode,
      windspeed_10m: apiResponse.current.windspeed_10m,
      relativehumidity_2m: apiResponse.current.relativehumidity_2m,
    },
    hourly: {
      time: apiResponse.hourly.time.map(t => new Date(t)),
      temperature_2m: apiResponse.hourly.temperature_2m,
      rain: apiResponse.hourly.rain,
    },
    daily: {
      time: apiResponse.daily.time.map(t => new Date(t)),
      weathercode: apiResponse.daily.weathercode,
      temperature_2m_max: apiResponse.daily.temperature_2m_max,
      temperature_2m_min: apiResponse.daily.temperature_2m_min,
      precipitation_sum: apiResponse.daily.precipitation_sum,
      windspeed_10m_max: apiResponse.daily.windspeed_10m_max,
      uv_index_max: apiResponse.daily.uv_index_max,
      // relativehumidity_2m_mean: apiResponse.daily.relativehumidity_2m_mean, // Dihapus
    },
    city: "Torino", // Hardcode untuk saat ini
    country: "IT", // Hardcode untuk saat ini
  };

  return parsedData;
};

export const useWeather = (city: string = "Torino", enabled: boolean = true) => {
  return useQuery<OpenMeteoParsedData, Error>({
    queryKey: ["weather", city],
    queryFn: () => fetchOpenMeteoWeather(city),
    staleTime: 30 * 1000, // Data considered stale after 30 seconds
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchInterval: 60 * 1000, // Auto-refetch every 1 minute
    enabled: enabled, // Only run query if enabled
  });
};