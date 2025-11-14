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

  // Effect for fetching and rendering GeoJSON data
  useEffect(() => {
    if (!map || !geoJsonLayerGroup) return;

    const fetchAndRenderGeoJSON = async () => {
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

        // Only fit map bounds if the layer group is currently on the map
        // and the map is ready. This prevents the _leaflet_pos error.
        if (map.hasLayer(geoJsonLayerGroup) && geoJsonLayerRef.current.getBounds().isValid()) {
          map.fitBounds(geoJsonLayerRef.current.getBounds());
        }

      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        toast.error(`Gagal memuat data GeoJSON: ${error instanceof Error ? error.message : String(error)}. Pastikan file 'export.geojson' ada di folder 'public'.`);
      }
    };

    // Call fetch and render when map is ready
    map.whenReady(fetchAndRenderGeoJSON);

    // Cleanup function
    return () => {
      if (geoJsonLayerRef.current) {
        geoJsonLayerGroup.removeLayer(geoJsonLayerRef.current);
        geoJsonLayerRef.current = null;
      }
    };
  }, [map, geoJsonLayerGroup, selectedVehicleType, roadConditionFilter]); // Dependencies for re-fetching/re-rendering

  // Effect for managing visibility based on zoom
  useEffect(() => {
    if (!map || !geoJsonLayerGroup) return;

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
    map.whenReady(updateVisibility); // Initial check after map is ready

    return () => {
      map.off('zoomend', updateVisibility);
      if (map.hasLayer(geoJsonLayerGroup)) { // Ensure layer is removed on unmount
        map.removeLayer(geoJsonLayerGroup);
      }
    };
  }, [map, geoJsonLayerGroup, minZoomForGeoJSON]); // Dependencies for visibility management

};