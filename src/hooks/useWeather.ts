"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWeatherApi } from "openmeteo";

// Define interfaces for Open-Meteo's current weather response structure
interface OpenMeteoCurrentData {
  time: Date;
  temperature_2m: number;
  weathercode: number;
  windspeed_10m: number;
  relativehumidity_2m: number;
}

interface OpenMeteoHourlyData {
  time: Date[];
  temperature_2m: Float32Array;
  rain: Float32Array;
}

// New: Interface for daily weather data
interface OpenMeteoDailyData {
  time: Date[];
  weathercode: Float32Array;
  temperature_2m_max: Float32Array;
  temperature_2m_min: Float32Array;
  precipitation_sum: Float32Array;
  windspeed_10m_max: Float32Array;
  uv_index_max: Float32Array;
  relativehumidity_2m_mean: Float32Array;
}

interface OpenMeteoParsedData {
  current: OpenMeteoCurrentData;
  hourly: OpenMeteoHourlyData;
  daily: OpenMeteoDailyData; // New: Add daily data
  city: string;
  country: string;
}

const fetchOpenMeteoWeather = async (city: string): Promise<OpenMeteoParsedData> => {
  // For simplicity, we'll use fixed coordinates for Torino.
  // In a real app, you might use a geocoding service to get coords from city name.
  const latitude = 45.0705;
  const longitude = 7.6868;

  const params = {
    latitude: latitude,
    longitude: longitude,
    hourly: ["temperature_2m", "rain"],
    current: ["temperature_2m", "weathercode", "windspeed_10m", "relativehumidity_2m"],
    daily: ["weathercode", "temperature_2m_max", "temperature_2m_min", "precipitation_sum", "windspeed_10m_max", "uv_index_max", "relativehumidity_2m_mean"], // New: Request daily parameters
    past_days: 0, // Only fetch current/forecast
    forecast_days: 7, // Fetch 7 days of daily forecast
  };
  const url = "https://api.open-meteo.com/v1/forecast";

  const responses = await fetchWeatherApi(url, params);

  // Process first location
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!; // New: Get daily data

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData: OpenMeteoParsedData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature_2m: current.variables(0)!.value(),
      weathercode: current.variables(1)!.value(),
      windspeed_10m: current.variables(2)!.value(),
      relativehumidity_2m: current.variables(3)!.value(),
    },
    hourly: {
      time: Array.from(
        { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature_2m: hourly.variables(0)!.valuesArray()!,
      rain: hourly.variables(1)!.valuesArray()!,
    },
    daily: { // New: Parse daily data
      time: Array.from(
        { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
      ),
      weathercode: daily.variables(0)!.valuesArray()!,
      temperature_2m_max: daily.variables(1)!.valuesArray()!,
      temperature_2m_min: daily.variables(2)!.valuesArray()!,
      precipitation_sum: daily.variables(3)!.valuesArray()!,
      windspeed_10m_max: daily.variables(4)!.valuesArray()!,
      uv_index_max: daily.variables(5)!.valuesArray()!,
      relativehumidity_2m_mean: daily.variables(6)!.valuesArray()!,
    },
    city: "Torino", // Hardcode for now, or use a reverse geocoding service
    country: "IT", // Hardcode for now
  };

  return weatherData;
};

export const useWeather = (city: string = "Torino", enabled: boolean = true) => {
  return useQuery<OpenMeteoParsedData, Error>({
    queryKey: ["weather", city],
    queryFn: () => fetchOpenMeteoWeather(city),
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    enabled: enabled, // Only run the query if enabled is true
  });
};