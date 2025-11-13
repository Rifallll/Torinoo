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

interface OpenMeteoParsedData {
  current: OpenMeteoCurrentData;
  hourly: OpenMeteoHourlyData;
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
    past_days: 0, // Only fetch current/forecast
    forecast_days: 1, // Only need current day's forecast for current weather
  };
  const url = "https://api.open-meteo.com/v1/forecast";

  const responses = await fetchWeatherApi(url, params);

  // Process first location
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const hourly = response.hourly()!;

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