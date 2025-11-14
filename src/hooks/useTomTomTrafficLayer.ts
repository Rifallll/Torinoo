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

  // Effect 1: Initialize or destroy TomTom layer based on API key and map presence
  useEffect(() => {
    if (!map) return;

    if (tomtomApiKey && !tomtomTrafficFlowLayerRef.current) {
      tomtomTrafficFlowLayerRef.current = L.tileLayer(
        `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
        {
          attribution: '&copy; <a href="https://tomtom.com">TomTom</a>',
          maxZoom: 19,
          opacity: 0.7,
        }
      );
    } else if (!tomtomApiKey && tomtomTrafficFlowLayerRef.current) {
      if (map.hasLayer(tomtomTrafficFlowLayerRef.current)) {
        map.removeLayer(tomtomTrafficFlowLayerRef.current);
      }
      tomtomTrafficFlowLayerRef.current = null;
      toast.warning("Kunci API TomTom tidak ditemukan. Lapisan lalu lintas TomTom tidak akan tersedia.");
    }
  }, [map, tomtomApiKey]);

  // Effect 2: Manage TomTom Traffic Flow layer visibility based on map bounds and toggle state
  useEffect(() => {
    if (!map) return;

    const currentLayer = tomtomTrafficFlowLayerRef.current;

    const updateTomTomTrafficVisibility = () => {
      // Crucial check: Ensure the layer instance exists AND map is fully loaded
      // @ts-ignore - _loaded is an internal Leaflet property, but useful here
      if (!map || !currentLayer || !map._loaded) {
        return;
      }

      const currentMapBounds = map.getBounds();
      const isTomTomLayerActive = map.hasLayer(currentLayer);
      const isWithinTorino = L.latLngBounds(torinoBounds).intersects(currentMapBounds);

      if (isTomTomLayerEnabled && isWithinTorino) {
        if (!isTomTomLayerActive) {
          currentLayer.addTo(map);
          toast.info("Lapisan lalu lintas TomTom diaktifkan untuk Torino.");
        }
      } else {
        if (isTomTomLayerActive) {
          map.removeLayer(currentLayer);
          toast.info("Lapisan lalu lintas TomTom dinonaktifkan (di luar Torino atau dimatikan).");
        }
      }
    };

    // Attach listeners
    map.on('moveend', updateTomTomTrafficVisibility);
    map.on('zoomend', updateTomTomTrafficVisibility);
    // Only run initial visibility check AFTER the map has fully loaded
    map.on('load', updateTomTomTrafficVisibility);

    return () => {
      // Detach listeners and clean up layer if it exists during unmount/re-run
      map.off('moveend', updateTomTomTrafficVisibility);
      map.off('zoomend', updateTomTomTrafficVisibility);
      map.off('load', updateTomTomTrafficVisibility); // Clean up load listener
      if (currentLayer && map.hasLayer(currentLayer)) {
        map.removeLayer(currentLayer);
      }
    };
  }, [map, isTomTomLayerEnabled, tomtomApiKey, torinoBounds]); // tomtomApiKey is a dependency because currentLayer depends on it.

  return tomtomTrafficFlowLayerRef.current;
};