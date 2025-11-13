"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Define interfaces for Transitland API v2 response
interface TransitlandRoute {
  onestop_id: string;
  route_short_name?: string; // Changed from short_name
  route_long_name?: string;  // Changed from long_name
  route_name?: string;       // New: often a combination or primary name
  vehicle_type?: string;     // e.g., 'bus', 'tram', 'subway' - might be derived or explicit
  description?: string;
  operator_name?: string;    // Operator name might be nested or directly on route
  route_type?: number;       // GTFS route_type (e.g., 0 for tram, 3 for bus)
}

interface TransitlandRoutesResponse {
  routes: TransitlandRoute[];
  meta: {
    total: number;
    per_page: number;
    offset: number;
  };
}

const fetchTransitlandRoutes = async (city: string): Promise<TransitlandRoute[]> => {
  try {
    // Operator ID GTT Torino: 'o-st8m-gtt'
    const operatorId = 'o-st8m-gtt';
    // Menggunakan domain API Transitland yang lebih umum untuk akses browser
    const apiUrl = `https://api.transit.land/api/v2/rest/routes?operator_onestop_id=${operatorId}&per_page=5&limit=5`;

    console.log(`Mencoba memuat rute dari: ${apiUrl}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    const data: TransitlandRoutesResponse = await response.json();
    
    if (data && data.routes && data.routes.length > 0) {
      console.log("✅ Rute Transportasi GTT Torino (Transitland) berhasil dimuat.");
      return data.routes;
    } else {
      console.warn("⚠️ Data rute ditemukan, tetapi kosong atau tidak ada rute aktif.");
      return [];
    }
  } catch (error) {
    console.error("❌ Gagal memuat rute:", error);
    toast.error(`Gagal memuat rute transportasi publik: ${error instanceof Error ? error.message : String(error)}. Ini mungkin masalah jaringan atau CORS.`);
    throw error;
  }
};

export const useTransitlandRoutes = (city: string = "Torino") => {
  return useQuery<TransitlandRoute[], Error>({
    queryKey: ["transitlandRoutes", city],
    queryFn: () => fetchTransitlandRoutes(city),
    staleTime: 10 * 60 * 1000, // Data considered fresh for 10 minutes
    refetchOnWindowFocus: false,
  });
};