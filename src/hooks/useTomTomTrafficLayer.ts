"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';

interface UseTomTomTrafficLayerProps {
  map: L.Map | null;
  tomtomApiKey: string | undefined;
  isTomTomLayerEnabled: boolean; // Add this prop
}

export const useTomTomTrafficLayer = ({
  map,
  tomtomApiKey,
  isTomTomLayerEnabled, // Use this prop
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
          opacity: isTomTomLayerEnabled ? 0.7 : 0, // Set initial opacity based on state
        }
      );
      console.log("TomTom Traffic Flow layer initialized (opacity set based on state).");
    } else if (!tomtomApiKey && tomtomTrafficFlowLayerRef.current) {
      // If API key is removed, clean up the layer
      tomtomTrafficFlowLayerRef.current = null;
      toast.warning("Kunci API TomTom tidak ditemukan. Lapisan lalu lintas TomTom tidak akan tersedia.");
    }

    // Cleanup for this effect: nullify ref if component unmounts or API key changes to null
    return () => {
      tomtomTrafficFlowLayerRef.current = null;
    };
  }, [map, tomtomApiKey, isTomTomLayerEnabled]); // isTomTomLayerEnabled is now a dependency

  return tomtomTrafficFlowLayerRef.current;
};