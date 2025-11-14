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

    const setupSubwayStationsLayer = () => {
      // Explicitly check if the map is loaded
      // @ts-ignore - _loaded is an internal Leaflet property
      if (!map._loaded) {
        console.warn("Map not fully loaded for Subway Stations layer, deferring creation.");
        setTimeout(setupSubwayStationsLayer, 100); // Retry after a short delay
        return;
      }

      // Defensive check: Ensure map panes are ready before adding markers
      // @ts-ignore - _panes is an internal Leaflet property
      if (!map._panes || !map._panes.markerPane) {
        console.warn("Map panes not ready for Subway markers, deferring creation.");
        subwayStationsLayerGroup.clearLayers();
        // Re-schedule this function call to run after a short delay
        setTimeout(setupSubwayStationsLayer, 50);
        return;
      }

      // The layer group is now assumed to be already on the map from useMapInitialization.
      // No need for subwayStationsLayerGroup.addTo(map) here.

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
          subwayStationsLayerGroup.eachLayer(layer => {
            if (layer instanceof L.Marker) {
              layer.setOpacity(1);
            }
          });
        } else {
          subwayStationsLayerGroup.eachLayer(layer => {
            if (layer instanceof L.Marker) {
              layer.setOpacity(0);
            }
          });
        }
      };

      map.on('zoomend', updateVisibility);
      updateVisibility(); // Initial check

      return () => {
        map.off('zoomend', updateVisibility);
        subwayStationsLayerGroup.clearLayers();
        // The layer group itself remains on the map.
      };
    };

    // Call setup function directly
    setupSubwayStationsLayer();

    return () => {
      subwayStationsLayerGroup.clearLayers(); // Clear all layers on unmount
      // The layer group itself remains on the map.
    };
  }, [map, subwayStationsLayerGroup, subwayStationsData, minZoomForSubwayStations]);
};