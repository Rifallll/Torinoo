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
        // Defer fitBounds to allow Leaflet to fully render layers
        if (geoJsonLayerRef.current.getBounds().isValid()) {
          setTimeout(() => {
            if (map && geoJsonLayerRef.current) { // Check if map and layer still exist
              map.fitBounds(geoJsonLayerRef.current.getBounds());
            }
          }, 100); // A small delay, adjust if needed
        }

      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        toast.error(`Gagal memuat data GeoJSON: ${error instanceof Error ? error.message : String(error)}. Pastikan file 'export.geojson' ada di folder 'public'.`);
      }

      // Effect for managing visibility based on zoom
      const updateVisibility = () => {
        if (map.getZoom() >= minZoomForGeoJSON) {
          // Layer group is already on the map, just ensure its contents are visible
          geoJsonLayerGroup.eachLayer(layer => {
            if (layer instanceof L.Path || layer instanceof L.Marker) {
              layer.setOpacity(1); // Or whatever default opacity you want for visible features
            }
          });
        } else {
          // Hide contents by setting opacity to 0
          geoJsonLayerGroup.eachLayer(layer => {
            if (layer instanceof L.Path || layer instanceof L.Marker) {
              layer.setOpacity(0);
            }
          });
        }
      };

      map.on('zoomend', updateVisibility);
      updateVisibility(); // Initial check

      return () => {
        map.off('zoomend', updateVisibility);
        // On cleanup, clear layers but keep the layer group on the map
        geoJsonLayerGroup.clearLayers();
      };
    };

    // Call setup function directly
    setupGeoJsonLayer();

    // Cleanup function for the useEffect
    return () => {
      if (geoJsonLayerRef.current) {
        geoJsonLayerGroup.removeLayer(geoJsonLayerRef.current);
        geoJsonLayerRef.current = null;
      }
      // The layer group itself remains on the map, only its contents are cleared.
    };
  }, [map, geoJsonLayerGroup, selectedVehicleType, roadConditionFilter, minZoomForGeoJSON]);
};