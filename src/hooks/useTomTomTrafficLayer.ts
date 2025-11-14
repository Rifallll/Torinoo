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
  const isLayerAddedToMapRef = useRef(false); // Track if the layer has been added to the map at least once

  // Effect 1: Initialize TomTom layer and add it to map once
  useEffect(() => {
    if (!map) return;

    const addTomTomLayerWhenReady = () => {
      if (tomtomApiKey && !tomtomTrafficFlowLayerRef.current) {
        tomtomTrafficFlowLayerRef.current = L.tileLayer(
          `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
          {
            attribution: '&copy; <a href="https://tomtom.com">TomTom</a>',
            maxZoom: 19,
            opacity: 0, // Start with 0 opacity (hidden)
          }
        );
        // Add the layer to the map immediately, but keep it hidden
        tomtomTrafficFlowLayerRef.current.addTo(map);
        isLayerAddedToMapRef.current = true;
        console.log("TomTom Traffic Flow layer initialized and added to map (hidden).");
      } else if (!tomtomApiKey && tomtomTrafficFlowLayerRef.current) {
        // If API key is removed, clean up the layer
        if (map.hasLayer(tomtomTrafficFlowLayerRef.current)) {
          map.removeLayer(tomtomTrafficFlowLayerRef.current);
        }
        tomtomTrafficFlowLayerRef.current = null;
        isLayerAddedToMapRef.current = false;
        toast.warning("Kunci API TomTom tidak ditemukan. Lapisan lalu lintas TomTom tidak akan tersedia.");
      }
    };

    // Call the function to add the TomTom layer only when the map is fully ready
    map.whenReady(addTomTomLayerWhenReady);

    // Cleanup for this effect: remove layer if component unmounts or API key changes to null
    return () => {
      if (map && tomtomTrafficFlowLayerRef.current && isLayerAddedToMapRef.current) {
        map.removeLayer(tomtomTrafficFlowLayerRef.current);
        tomtomTrafficFlowLayerRef.current = null;
        isLayerAddedToMapRef.current = false;
      }
    };
  }, [map, tomtomApiKey]); // Only re-run if map or API key changes

  // Effect 2: Manage TomTom Traffic Flow layer visibility (opacity)
  useEffect(() => {
    if (!map || !tomtomTrafficFlowLayerRef.current || !isLayerAddedToMapRef.current) {
      return;
    }

    const currentLayer = tomtomTrafficFlowLayerRef.current;

    const updateTomTomTrafficVisibility = () => {
      // @ts-ignore - _loaded is an internal Leaflet property, but useful here
      if (!map || !currentLayer || !map._loaded) {
        return;
      }

      const currentMapBounds = map.getBounds();
      const isWithinTorino = L.latLngBounds(torinoBounds).intersects(currentMapBounds);

      if (isTomTomLayerEnabled && isWithinTorino) {
        currentLayer.setOpacity(0.7); // Make visible
        toast.info("Lapisan lalu lintas TomTom diaktifkan untuk Torino.");
      } else {
        currentLayer.setOpacity(0); // Hide
        toast.info("Lapisan lalu lintas TomTom dinonaktifkan (di luar Torino atau dimatikan).");
      }
    };

    // Attach listeners
    map.on('moveend', updateTomTomTrafficVisibility);
    map.on('zoomend', updateTomTomTrafficVisibility);
    map.on('load', updateTomTomTrafficVisibility); // Initial check after map loads

    // Initial visibility update when the component mounts or dependencies change
    updateTomTomTrafficVisibility();

    return () => {
      // Detach listeners
      map.off('moveend', updateTomTomTrafficVisibility);
      map.off('zoomend', updateTomTomTrafficVisibility);
      map.off('load', updateTomTomTrafficVisibility);
    };
  }, [map, isTomTomLayerEnabled, torinoBounds]); // tomtomApiKey is NOT a dependency here, as layer creation is in Effect 1

  return tomtomTrafficFlowLayerRef.current;
};