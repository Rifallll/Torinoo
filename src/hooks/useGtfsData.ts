"use client";

import { useQuery } from "@tanstack/react-query";
import { loadGtfsData, ParsedGtfsData } from '@/utils/gtfsParser';

export const useGtfsData = () => {
  return useQuery<ParsedGtfsData, Error>({
    queryKey: ["gtfsData"],
    queryFn: loadGtfsData,
    staleTime: Infinity, // GTFS data is static, so it's always fresh once loaded
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};