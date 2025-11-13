"use client";

import { useQuery } from "@tanstack/react-query";

// Define interfaces for Open-Meteo's response structure
interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gust_10m: number;
}

interface CurrentWeatherUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: string;
  precipitation: string;
  rain: string;
  showers: string;
  snowfall: string;
  weather_code: string;
  cloud_cover: string;
  pressure_msl: string;
  surface_pressure: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  wind_gust_10m: string;
}

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentWeatherUnits;
  current: CurrentWeather;
}

const fetchWeather = async () => {
  // Open-Meteo API for Torino (latitude, longitude)
  const latitude = 45.0703;
  const longitude = 7.6869;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gust_10m&timezone=Europe%2FRome&forecast_days=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }
  return response.json();
};

export const useWeather = () => {
  return useQuery<WeatherData, Error>({
    queryKey: ["weather", "Torino"],
    queryFn: fetchWeather,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};