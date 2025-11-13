"use client";

import { useQuery } from "@tanstack/react-query";

// Define interfaces for OpenWeatherMap's current weather response structure
interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface MainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface WindData {
  speed: number;
  deg: number;
}

interface OpenWeatherMapData {
  coord: { lon: number; lat: number };
  weather: WeatherCondition[];
  base: string;
  main: MainData;
  visibility: number;
  wind: WindData;
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

const fetchWeather = async (city: string) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeatherMap API key is not set. Please add VITE_OPENWEATHER_API_KEY to your .env file.");
  }

  // Using city name for OpenWeatherMap API
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch weather data: ${errorData.message || response.statusText}`);
  }
  return response.json();
};

export const useWeather = (city: string = "Torino,it") => {
  return useQuery<OpenWeatherMapData, Error>({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};