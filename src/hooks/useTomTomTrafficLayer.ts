"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';

interface UseTomTomTrafficLayerProps {
  map: L.Map | null;
  isTomTomLayerEnabled: boolean;
  tomtomApiKey: string | undefined;
  torinoBounds: L.LatLngBoundsExpression;
}

export const useTomTomTrafficLayer = ({
  map,
  isTomTomLayerEnabled,
  tomtomApiKey,
  torinoBounds,
}: UseTomTomTrafficLayerProps) => {
  const tomtomTrafficFlowLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize TomTom layer once
  useEffect(() => {
    if (!map || tomtomTrafficFlowLayerRef.current) return;

    if (tomtomApiKey) {
      tomtomTrafficFlowLayerRef.current = L.tileLayer(
        `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
        {
          attribution: '&copy; <a href="https://tomtom.com">TomTom</a>',
          maxZoom: 19,
          opacity: 0.7,
        }
      );
    } else {
      toast.warning("Kunci API TomTom tidak ditemukan. Lapisan lalu lintas TomTom tidak akan tersedia.");
    }
  }, [map, tomtomApiKey]);

  // Effect for managing TomTom Traffic Flow layer visibility
  useEffect(() => {
    if (!map || !tomtomTrafficFlowLayerRef.current) return;

    const updateTomTomTrafficVisibility = () => {
      const currentMapBounds = map.getBounds();
      const isTomTomLayerActive = map.hasLayer(tomtomTrafficFlowLayerRef.current!);
      const isWithinTorino = L.latLngBounds(torinoBounds).intersects(currentMapBounds);

      if (isTomTomLayerEnabled && isWithinTorino) {
        if (!isTomTomLayerActive) {
          tomtomTrafficFlowLayerRef.current!.addTo(map);
          toast.info("Lapisan lalu lintas TomTom diaktifkan untuk Torino.");
        }
      } else {
        if (isTomTomLayerActive) {
          map.removeLayer(tomtomTrafficFlowLayerRef.current!);
          toast.info("Lapisan lalu lintas TomTom dinonaktifkan (di luar Torino atau dimatikan).");
        }
      }
    };

    map.on('moveend', updateTomTomTrafficVisibility);
    map.on('zoomend', updateTomTomTrafficVisibility);
    updateTomTomTrafficVisibility(); // Initial check

    return () => {
      map.off('moveend', updateTomTomTrafficVisibility);
      map.off('zoomend', updateTomTomTrafficVisibility);
      if (tomtomTrafficFlowLayerRef.current && map.hasLayer(tomtomTrafficFlowLayerRef.current)) {
        map.removeLayer(tomtomTrafficFlowLayerRef.current);
      }
    };
  }, [map, isTomTomLayerEnabled, tomtomApiKey, torinoBounds]);

  return tomtomTrafficFlowLayerRef.current;
};