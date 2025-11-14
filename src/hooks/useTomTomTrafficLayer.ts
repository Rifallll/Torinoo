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
    if (!map) return; // Map must exist to initialize/destroy layer

    // If API key is present AND layer hasn't been created yet, create it
    if (tomtomApiKey && !tomtomTrafficFlowLayerRef.current) {
      tomtomTrafficFlowLayerRef.current = L.tileLayer(
        `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
        {
          attribution: '&copy; <a href="https://tomtom.com">TomTom</a>',
          maxZoom: 19,
          opacity: 0.7,
        }
      );
      // No toast here, as visibility is managed by the second useEffect
    } 
    // If API key is missing, or becomes missing, and the layer exists, remove it and clear ref
    else if (!tomtomApiKey && tomtomTrafficFlowLayerRef.current) {
      if (map.hasLayer(tomtomTrafficFlowLayerRef.current)) {
        map.removeLayer(tomtomTrafficFlowLayerRef.current);
      }
      tomtomTrafficFlowLayerRef.current = null;
      toast.warning("Kunci API TomTom tidak ditemukan. Lapisan lalu lintas TomTom tidak akan tersedia.");
    } 
    // If API key is missing from the start and layer doesn't exist, just warn once
    else if (!tomtomApiKey && !tomtomTrafficFlowLayerRef.current) {
      // Only show warning if it hasn't been shown before (or if map is just initialized)
      // This toast is now handled by the first render of the component, not repeatedly.
    }
  }, [map, tomtomApiKey]); // Re-run if map or API key changes

  // Effect 2: Manage TomTom Traffic Flow layer visibility based on map bounds and toggle state
  useEffect(() => {
    if (!map) return; // Map must exist for event listeners

    const currentLayer = tomtomTrafficFlowLayerRef.current; // Capture current ref value for this effect's lifecycle

    const updateTomTomTrafficVisibility = () => {
      // Crucial check: Ensure the layer instance actually exists before trying to use it
      if (!currentLayer) {
        return; // Cannot proceed if layer was never initialized (e.g., missing API key)
      }

      const currentMapBounds = map.getBounds();
      const isTomTomLayerActive = map.hasLayer(currentLayer); // Use currentLayer directly
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
    updateTomTomTrafficVisibility(); // Initial check when component mounts or dependencies change

    return () => {
      // Detach listeners and clean up layer if it exists during unmount/re-run
      map.off('moveend', updateTomTomTrafficVisibility);
      map.off('zoomend', updateTomTomTrafficVisibility);
      if (currentLayer && map.hasLayer(currentLayer)) {
        map.removeLayer(currentLayer);
      }
    };
  }, [map, isTomTomLayerEnabled, torinoBounds]); // Dependencies: map, toggle state, bounds. tomtomApiKey is handled by the first useEffect.

  return tomtomTrafficFlowLayerRef.current;
};