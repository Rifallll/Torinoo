"use client";

import { useEffect, useCallback } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';

interface TomTomTrafficLayerProps {
  map: L.Map | null;
  layer: L.TileLayer | null;
  bounds: L.LatLngBoundsExpression;
}

export const useTomTomTrafficLayer = ({
  map,
  layer,
  bounds,
}: TomTomTrafficLayerProps) => {
  const { isTomTomLayerEnabled } = useSettings();

  const updateVisibility = useCallback(() => {
    if (!map || !layer) return;

    const currentMapBounds = map.getBounds();
    const isTomTomLayerActive = map.hasLayer(layer);
    const isWithinBounds = currentMapBounds.intersects(bounds);

    if (isTomTomLayerEnabled && isWithinBounds) {
      if (!isTomTomLayerActive) {
        layer.addTo(map);
        toast.info("Lapisan lalu lintas TomTom diaktifkan untuk Torino.");
      }
    } else {
      if (isTomTomLayerActive) {
        map.removeLayer(layer);
        toast.info("Lapisan lalu lintas TomTom dinonaktifkan (di luar Torino atau dimatikan).");
      }
    }
  }, [map, layer, bounds, isTomTomLayerEnabled]);

  useEffect(() => {
    if (!map || !layer) return;

    map.on('moveend', updateVisibility);
    map.on('zoomend', updateVisibility);
    updateVisibility(); // Initial check

    return () => {
      map.off('moveend', updateVisibility);
      map.off('zoomend', updateVisibility);
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    };
  }, [map, layer, updateVisibility]);

  return layer;
};