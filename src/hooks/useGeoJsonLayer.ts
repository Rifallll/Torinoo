"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { getCustomIcon } from '@/utils/mapUtils';

interface UseGeoJsonLayerProps {
  map: L.Map | null;
  geoJsonLayerGroup: L.LayerGroup | null;
  selectedVehicleType: string;
  roadConditionFilter: string;
  minZoomForGeoJSON: number;
}

export const useGeoJsonLayer = ({
  map,
  geoJsonLayerGroup,
  selectedVehicleType,
  roadConditionFilter,
  minZoomForGeoJSON,
}: UseGeoJsonLayerProps) => {
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!map || !geoJsonLayerGroup) return;

    const setupGeoJsonLayer = async () => {
      // Defensive check: Ensure map panes are ready before adding markers
      // This specifically targets the "appendChild" error on _initIcon
      // @ts-ignore - _panes is an internal Leaflet property
      if (!map._panes || !map._panes.markerPane) {
        console.warn("Map panes not ready for GeoJSON markers, deferring creation.");
        // Clear layers to prevent partial rendering if this happens mid-update
        geoJsonLayerGroup.clearLayers();
        // Re-schedule this function call to run after a short delay
        // This gives Leaflet's internal DOM setup more time.
        setTimeout(setupGeoJsonLayer, 50); 
        return;
      }

      // 1. Add the layer group to the map first (if not already added)
      // This ensures the layer group's internal DOM structures are ready
      if (!map.hasLayer(geoJsonLayerGroup)) {
        geoJsonLayerGroup.addTo(map);
      }

      try {
        const response = await fetch('/export.geojson');
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data = await response.json();

        // Clear existing GeoJSON layer from the group
        geoJsonLayerGroup.clearLayers();

        // Filter features based on selectedVehicleType and roadConditionFilter
        const filteredFeatures = data.features.filter((feature: L.GeoJSON.Feature) => {
          const properties = feature.properties;
          const matchesVehicleType = selectedVehicleType === 'all' ||
                                     (properties?.vehicle_type && properties.vehicle_type.toLowerCase() === selectedVehicleType.toLowerCase());
          const matchesRoadCondition = roadConditionFilter === 'all' ||
                                       (properties?.traffic_level && properties.traffic_level.toLowerCase() === roadConditionFilter.toLowerCase());
          return matchesVehicleType && matchesRoadCondition;
        });

        geoJsonLayerRef.current = L.geoJSON({ ...data, features: filteredFeatures }, {
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              let popupContent = "<table>";
              for (const key in feature.properties) {
                popupContent += `<tr><td><b>${key}:</b></td><td>${feature.properties[key]}</td></tr>`;
              }
              popupContent += "</table>";
              layer.bindPopup(popupContent);
            }
          },
          pointToLayer: (feature, latlng) => {
            return L.marker(latlng, { icon: getCustomIcon(feature) });
          },
          style: (feature) => {
            const trafficLevel = feature?.properties?.traffic_level;
            let color = '#6b7280';
            let weight = 3;

            if (trafficLevel === 'high') {
              color = 'red';
              weight = 4;
            } else if (trafficLevel === 'moderate') {
              color = 'orange';
              weight = 3;
            } else if (trafficLevel === 'low') {
              color = 'green';
              weight = 2;
            }

            if (roadConditionFilter !== 'all' && trafficLevel?.toLowerCase() !== roadConditionFilter.toLowerCase()) {
              return { opacity: 0 };
            }

            return {
              color: color,
              weight: weight,
              opacity: 0.4
            };
          }
        });
        geoJsonLayerRef.current.addTo(geoJsonLayerGroup);

        // Only fit map bounds if the layer has valid bounds
        if (geoJsonLayerRef.current.getBounds().isValid()) {
          map.fitBounds(geoJsonLayerRef.current.getBounds());
        }

      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        toast.error(`Gagal memuat data GeoJSON: ${error instanceof Error ? error.message : String(error)}. Pastikan file 'export.geojson' ada di folder 'public'.`);
      }

      // Effect for managing visibility based on zoom
      const updateVisibility = () => {
        if (map.getZoom() >= minZoomForGeoJSON) {
          if (!map.hasLayer(geoJsonLayerGroup)) {
            geoJsonLayerGroup.addTo(map);
            toast.info("Lapisan data lalu lintas ditampilkan (perbesar untuk detail).");
          }
        } else {
          if (map.hasLayer(geoJsonLayerGroup)) {
            map.removeLayer(geoJsonLayerGroup);
            toast.info("Lapisan data lalu lintas disembunyikan (perkecil untuk performa).");
          }
        }
      };

      map.on('zoomend', updateVisibility);
      updateVisibility(); // Initial check

      return () => {
        map.off('zoomend', updateVisibility);
        if (map.hasLayer(geoJsonLayerGroup)) {
          map.removeLayer(geoJsonLayerGroup);
        }
      };
    };

    // Call setup function when map is ready
    map.whenReady(setupGeoJsonLayer);

    // Cleanup function for the useEffect
    return () => {
      if (geoJsonLayerRef.current) {
        geoJsonLayerGroup.removeLayer(geoJsonLayerRef.current);
        geoJsonLayerRef.current = null;
      }
      // Ensure the layer group is removed from the map on unmount
      if (map.hasLayer(geoJsonLayerGroup)) {
        map.removeLayer(geoJsonLayerGroup);
      }
    };
  }, [map, geoJsonLayerGroup, selectedVehicleType, roadConditionFilter, minZoomForGeoJSON]);
};