"use client";

import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string; // City name
}

const fetchWeather = async (city: string) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeatherMap API key is not set in environment variables (VITE_OPENWEATHER_API_KEY).");
  }
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data for ${city}: ${response.statusText}`);
  }
  return response.json();
};

export const useWeather = (city: string = "Torino,it") => {
  const isTorino = city === "Torino,it"; // Memeriksa apakah kota yang diminta adalah Torino

  return useQuery<WeatherData, Error>({
    queryKey: ["weather", city],
    queryFn: isTorino ? () => fetchWeather(city) : undefined, // Hanya jalankan queryFn jika kota adalah Torino
    enabled: isTorino, // Hanya aktifkan query jika kota adalah Torino
    staleTime: 5 * 60 * 1000, // Data dianggap segar selama 5 menit
    refetchOnWindowFocus: false, // Mencegah pengambilan ulang saat jendela fokus
  });
};