"use client";

import Papa from 'papaparse';
import { toast } from 'sonner';

// Define the interface for a single row of your traffic data
export interface TorinoTrafficDataRow {
  day: string;
  interval: string;
  detid: string;
  flow: number;
  occ: number;
  error: number;
  city: string;
  speed: number;
}

/**
 * Loads and parses the torino_cleaned_ordered.csv file.
 * @returns A promise that resolves to an array of TorinoTrafficDataRow objects.
 */
export const loadTorinoTrafficData = async (): Promise<TorinoTrafficDataRow[]> => {
  const filePath = '/torino_cleaned_ordered.csv';
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
          // Ensure the data matches the interface
          const parsedData = results.data.map((row: any) => ({
            day: String(row.day),
            interval: String(row.interval),
            detid: String(row.detid),
            flow: Number(row.flow),
            occ: Number(row.occ),
            error: Number(row.error),
            city: String(row.city),
            speed: Number(row.speed),
          })) as TorinoTrafficDataRow[];
          
          toast.success("Torino traffic data loaded successfully!");
          console.log("Torino Traffic Data Loaded:", parsedData);
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
    toast.error(`Failed to load Torino traffic data CSV.`);
    return [];
  }
};