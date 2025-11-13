"use client";

import proj4 from 'proj4';

// Define the EPSG:3003 projection (Monte Mario / Italy zone 1)
// Source: https://epsg.io/3003
proj4.defs("EPSG:3003", "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.974,-2.917,-0.714,-11.68 +units=m +no_defs +type=crs");

// Define the WGS84 projection (standard for Leaflet)
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");

/**
 * Converts coordinates from EPSG:3003 (Monte Mario / Italy zone 1) to WGS84 (latitude, longitude).
 * @param x The X coordinate in EPSG:3003.
 * @param y The Y coordinate in EPSG:3003.
 * @returns An object with latitude and longitude, or { latitude: 0, longitude: 0 } if conversion fails.
 */
export const convertCoordinates = (x: number, y: number): { latitude: number; longitude: number } => {
  try {
    const [longitude, latitude] = proj4("EPSG:3003", "EPSG:4326", [x, y]);
    return { latitude, longitude };
  } catch (error) {
    console.error("Error converting coordinates:", error);
    return { latitude: 0, longitude: 0 }; // Return default invalid coordinates
  }
};