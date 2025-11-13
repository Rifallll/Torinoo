"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Define interfaces for Transitland API response
interface TransitlandRoute {
  onestop_id: string;
  name: string;
  vehicle_type: string; // e.g., 'bus', 'tram', 'subway'
  short_name?: string;
  long_name?: string;
  description?: string;
  operator_name?: string;
  route_type?: number; // GTFS route_type (e.g., 0 for tram, 3 for bus)
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
    // Using a specific operator_id for Torino's GTT (Gruppo Torinese Trasporti)
    // This might need adjustment if the operator_id changes or if other operators are desired.
    // A more robust solution would involve first querying for operators in Torino.
    const operatorOnestopId = "o-spsv-gtt"; // Example Onestop ID for GTT Torino
    const response = await fetch(`https://api.transit.land/api/v1/routes?operator_onestop_id=${operatorOnestopId}&per_page=20`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch Transitland routes: ${response.statusText}`);
    }

    const data: TransitlandRoutesResponse = await response.json();
    return data.routes;
  } catch (error) {
    console.error("Error fetching Transitland routes:", error);
    toast.error(`Gagal memuat rute transportasi publik: ${error instanceof Error ? error.message : String(error)}`);
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