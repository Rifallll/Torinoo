"use client";

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';

interface TomTomTrafficLayerProps {
  map: L.Map | null;
  tomtomApiKey: string | undefined;
  torinoBounds: L.LatLngBoundsExpression;
}

export const useTomTomTrafficLayer = ({ map, tomtomApiKey, torinoBounds }: TomTomTrafficLayerProps) => {
  const tomtomTrafficFlowLayerRef = useRef<L.TileLayer | null>(null);
  const { isTomTomLayerEnabled } = useSettings();

  const updateTomTomTrafficVisibility = useCallback(() => {
    if (!map || !tomtomTrafficFlowLayerRef.current) return;

    const currentMapBounds = map.getBounds();
    const isTomTomLayerActive = map.hasLayer(tomtomTrafficFlowLayerRef.current);
    const isWithinTorino = currentMapBounds.intersects(torinoBounds);

    if (isTomTomLayerEnabled && isWithinTorino) {
      if (!isTomTomLayerActive) {
        tomtomTrafficFlowLayerRef.current.addTo(map);
        toast.info("Lapisan lalu lintas TomTom diaktifkan untuk Torino.");
      }
    } else {
      if (isTomTomLayerActive) {
        map.removeLayer(tomtomTrafficFlowLayerRef.current);
        toast.info("Lapisan lalu lintas TomTom dinonaktifkan (di luar Torino atau dimatikan).");
      }
    }
  }, [map, tomtomApiKey, torinoBounds, isTomTomLayerEnabled]);

  useEffect(() => {
    if (!map) return;

    if (!tomtomTrafficFlowLayerRef.current && tomtomApiKey && tomtomApiKey !== 'YOUR_TOMTOM_API_KEY_HERE') {
      tomtomTrafficFlowLayerRef.current = L.tileLayer(
        `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
        {
          attribution: '&copy; <a href="https://tomtom.com">TomTom</a>',
          maxZoom: 19,
          opacity: 1.0,
        }
      );
    } else if (!tomtomApiKey || tomtomApiKey === 'YOUR_TOMTOM_API_KEY_HERE') {
      if (!tomtomTrafficFlowLayerRef.current) { // Only show warning once
        toast.warning("Kunci API TomTom tidak ditemukan atau belum diatur. Lapisan lalu lintas TomTom tidak akan tersedia.");
        console.warn("TomTom API Key is missing or is the placeholder. TomTom traffic layer will not be available.");
      }
    }

    map.on('moveend', updateTomTomTrafficVisibility);
    map.on('zoomend', updateTomTomTrafficVisibility);
    updateTomTomTrafficVisibility(); // Initial check

    return () => {
      map.off('moveend', updateTomTomTrafficVisibility);
      map.off('zoomend', updateTomTomTrafficVisibility);
      if (tomtomTrafficFlowLayerRef.current) {
        map.removeLayer(tomtomTrafficFlowLayerRef.current);
        tomtomTrafficFlowLayerRef.current = null;
      }
    };
  }, [map, tomtomApiKey, updateTomTomTrafficVisibility]);

  return tomtomTrafficFlowLayerRef.current;
};