"use client";

import { useEffect } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { convertCoordinates } from '@/utils/coordinateConverter';

interface SubwayStation {
  name: string;
  x: number;
  y: number;
}

interface UseSubwayStationsLayerProps {
  map: L.Map | null;
  subwayStationsLayerGroup: L.LayerGroup | null;
  subwayStationsData: SubwayStation[];
  minZoomForSubwayStations: number;
}

export const useSubwayStationsLayer = ({
  map,
  subwayStationsLayerGroup,
  subwayStationsData,
  minZoomForSubwayStations,
}: UseSubwayStationsLayerProps) => {
  useEffect(() => {
    if (!map || !subwayStationsLayerGroup) return;

    // Clear existing markers
    subwayStationsLayerGroup.clearLayers();

    // Add subway stations to their layer group
    subwayStationsData.forEach(station => {
      const { latitude, longitude } = convertCoordinates(station.x, station.y);
      if (latitude !== 0 || longitude !== 0) { // Check for valid conversion
        L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: 'subway-station-marker',
            html: `<div style="background-color:#007bff; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold;">M</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        })
        .bindPopup(`<b>${station.name}</b><br/>Subway Station`)
        .addTo(subwayStationsLayerGroup);
      }
    });

    // Effect for managing visibility based on zoom
    const updateVisibility = () => {
      if (map.getZoom() >= minZoomForSubwayStations) {
        if (!map.hasLayer(subwayStationsLayerGroup)) {
          subwayStationsLayerGroup.addTo(map);
          toast.info("Lapisan halte kereta bawah tanah ditampilkan.");
        }
      } else {
        if (map.hasLayer(subwayStationsLayerGroup)) {
          map.removeLayer(subwayStationsLayerGroup);
          toast.info("Lapisan halte kereta bawah tanah disembunyikan (perkecil untuk performa).");
        }
      }
    };

    map.on('zoomend', updateVisibility);
    updateVisibility(); // Initial check

    return () => {
      map.off('zoomend', updateVisibility);
      subwayStationsLayerGroup.clearLayers(); // Clear all layers on unmount
    };
  }, [map, subwayStationsLayerGroup, subwayStationsData, minZoomForSubwayStations]);
};