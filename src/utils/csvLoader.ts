"use client";

import Papa from 'papaparse';
import { toast } from 'sonner';

// Define the interface for a single row of your traffic data
export interface TorinoTrafficDataRow {
  day: string;
  day_of_week: string;
  interval: number; // interval is in seconds, so number
  hour: number;
  minute: number;
  time: string; // e.g., "08:30"
  time_of_day: string; // e.g., "pagi", "siang"
  flow: number;
  speed: number;
  occ: number;
  city: string;
  day_of_month: number;
  month: number;
  month_name: string;
  quarter: number;
  week_number: number;
  is_weekend: boolean;
}

/**
 * Loads and parses the sa.txt file, including all data without filtering.
 * @returns A promise that resolves to an array of TorinoTrafficDataRow objects.
 */
export const loadTorinoTrafficData = async (): Promise<TorinoTrafficDataRow[]> => {
  const filePath = `${import.meta.env.BASE_URL}sa.txt`; // Mengubah path file ke sa.txt
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically convert numbers, booleans, etc.
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error(`Errors parsing ${filePath}:`, results.errors);
            toast.error(`Failed to parse traffic data CSV: ${results.errors[0].message}`);
            reject(new Error(`Parsing error in ${filePath}`));
          }

          const parsedData = results.data.map((row: any) => ({
            day: String(row.day),
            day_of_week: String(row.day_of_week),
            interval: Number(row.interval),
            hour: Number(row.hour),
            minute: Number(row.minute),
            time: String(row.time),
            time_of_day: String(row.time_of_day),
            flow: Number(row.flow),
            speed: Number(row.speed),
            occ: Number(row.occ),
            city: String(row.city),
            day_of_month: Number(row.day_of_month),
            month: Number(row.month),
            month_name: String(row.month_name),
            quarter: Number(row.quarter),
            week_number: Number(row.week_number),
            is_weekend: Boolean(row.is_weekend),
          })) as TorinoTrafficDataRow[];

          // Menghapus logika pemfilteran tanggal agar semua data dimuat

          toast.success(`Traffic data from 'sa.txt' loaded successfully! Total records: ${parsedData.length}`);
          console.log("Traffic Data Loaded from 'sa.txt':", parsedData);
          resolve(parsedData);
        },
        error: (error: Error) => {
          console.error(`Error reading ${filePath}:`, error);
          toast.error(`An error occurred while reading traffic data CSV: ${error.message}`);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
    toast.error(`Failed to load traffic data from 'sa.txt'.`);
    return [];
  }
};