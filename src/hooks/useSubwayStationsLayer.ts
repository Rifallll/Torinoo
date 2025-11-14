"use client";

import { useEffect, useCallback } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';

interface SubwayStationsLayerProps {
  map: L.Map | null;
  layerGroup: L.LayerGroup | null;
  minZoom: number;
}

export const useSubwayStationsLayer = ({
  map,
  layerGroup,
  minZoom,
}: SubwayStationsLayerProps) => {

  const updateVisibility = useCallback(() => {
    if (!map || !layerGroup) return;

    if (map.getZoom() >= minZoom) {
      if (!map.hasLayer(layerGroup)) {
        layerGroup.addTo(map);
        toast.info("Lapisan halte kereta bawah tanah ditampilkan.");
      }
    } else {
      if (map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup);
        toast.info("Lapisan halte kereta bawah tanah disembunyikan (perkecil untuk performa).");
      }
    }
  }, [map, layerGroup, minZoom]);

  useEffect(() => {
    if (!map || !layerGroup) return;

    map.on('zoomend', updateVisibility);
    updateVisibility(); // Initial check

    return () => {
      map.off('zoomend', updateVisibility);
      if (map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup);
      }
    };
  }, [map, layerGroup, updateVisibility]);

  return layerGroup;
};