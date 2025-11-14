"use client";

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { convertCoordinates } from '@/utils/coordinateConverter';

interface SubwayStationsLayerProps {
  map: L.Map | null;
  layerGroup: L.LayerGroup | null;
  minZoom: number;
  subwayStationsData: { name: string; x: number; y: number }[];
}

export const useSubwayStationsLayer = ({
  map,
  layerGroup,
  minZoom,
  subwayStationsData,
}: SubwayStationsLayerProps) => {
  const stationMarkersRef = useRef<{ [key: string]: L.Marker }>({});

  const updateLayerAndMarkers = useCallback(() => {
    if (!map || !layerGroup) return;

    // Ensure markerPane exists before attempting to add markers
    if (!map.getPanes().markerPane) {
      console.warn("Leaflet markerPane not yet available. Skipping subway station marker creation for now.");
      return;
    }

    const currentMarkers = stationMarkersRef.current;
    const newStationNames = new Set<string>();
    const isLayerCurrentlyOnMap = map.hasLayer(layerGroup);
    const shouldShowLayer = map.getZoom() >= minZoom;

    if (shouldShowLayer) {
      if (!isLayerCurrentlyOnMap) {
        layerGroup.addTo(map);
        toast.info("Lapisan halte kereta bawah tanah ditampilkan.");
      }

      subwayStationsData.forEach(station => {
        newStationNames.add(station.name);
        const { latitude, longitude } = convertCoordinates(station.x, station.y);

        if (latitude !== 0 || longitude !== 0) {
          if (currentMarkers[station.name]) {
            currentMarkers[station.name].setLatLng([latitude, longitude]);
          } else {
            const marker = L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'subway-station-marker',
                html: `<div style="background-color:#007bff; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold;">M</div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            })
            .bindPopup(`<b>${station.name}</b><br/>Subway Station`);
            
            marker.addTo(layerGroup);
            currentMarkers[station.name] = marker;
          }
        }
      });

      for (const name of Object.keys(currentMarkers)) {
        if (!newStationNames.has(name)) {
          layerGroup.removeLayer(currentMarkers[name]);
          delete currentMarkers[name];
        }
      }

    } else {
      for (const name of Object.keys(currentMarkers)) {
        layerGroup.removeLayer(currentMarkers[name]);
        delete currentMarkers[name];
      }
      if (isLayerCurrentlyOnMap) {
        map.removeLayer(layerGroup);
        toast.info("Lapisan halte kereta bawah tanah disembunyikan (perkecil untuk performa).");
      }
    }
  }, [map, layerGroup, minZoom, subwayStationsData]);

  useEffect(() => {
    if (!map || !layerGroup) return;

    map.on('zoomend', updateLayerAndMarkers);
    updateLayerAndMarkers(); // Initial check

    return () => {
      map.off('zoomend', updateLayerAndMarkers);
      for (const name of Object.keys(stationMarkersRef.current)) {
        layerGroup.removeLayer(stationMarkersRef.current[name]);
      }
      stationMarkersRef.current = {};
      if (map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup);
      }
    };
  }, [map, layerGroup, updateLayerAndMarkers]);

  return layerGroup;
};