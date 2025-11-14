"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';

interface UseTomTomTrafficLayerProps {
  map: L.Map | null;
  tomtomApiKey: string | undefined;
}

export const useTomTomTrafficLayer = ({
  map,
  tomtomApiKey,
}: UseTomTomTrafficLayerProps) => {
  const tomtomTrafficFlowLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    if (tomtomApiKey && !tomtomTrafficFlowLayerRef.current) {
      tomtomTrafficFlowLayerRef.current = L.tileLayer(
        `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
        {
          attribution: '&copy; <a href="https://tomtom.com">TomTom</a>',
          maxZoom: 19,
          opacity: 0, // Start with 0 opacity (hidden)
        }
      );
      console.log("TomTom Traffic Flow layer initialized (hidden).");
    } else if (!tomtomApiKey && tomtomTrafficFlowLayerRef.current) {
      // If API key is removed, clean up the layer
      tomtomTrafficFlowLayerRef.current = null;
      toast.warning("Kunci API TomTom tidak ditemukan. Lapisan lalu lintas TomTom tidak akan tersedia.");
    }

    // Cleanup for this effect: nullify ref if component unmounts or API key changes to null
    return () => {
      tomtomTrafficFlowLayerRef.current = null;
    };
  }, [map, tomtomApiKey]); // Only re-run if map or API key changes

  return tomtomTrafficFlowLayerRef.current;
};