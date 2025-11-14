"use client";

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';

interface GeoJsonLayerProps {
  map: L.Map | null;
  layerGroup: L.LayerGroup | null;
  selectedVehicleType: string;
  roadConditionFilter: string;
  minZoom: number;
  getCustomIcon: (feature: L.GeoJSON.Feature) => L.DivIcon;
  isMapLoaded: boolean; // New prop
}

export const useGeoJsonLayer = ({
  map,
  layerGroup,
  selectedVehicleType,
  roadConditionFilter,
  minZoom,
  getCustomIcon,
  isMapLoaded, // Destructure new prop
}: GeoJsonLayerProps) => {
  const geoJsonDataRef = useRef<L.GeoJSON | null>(null);

  const updateVisibility = useCallback(() => {
    if (!map || !layerGroup || !isMapLoaded) return; // Check isMapLoaded

    if (map.getZoom() >= minZoom) {
      if (!map.hasLayer(layerGroup)) {
        layerGroup.addTo(map);
        toast.info("Lapisan data lalu lintas ditampilkan (perbesar untuk detail).");
      }
    } else {
      if (map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup);
        toast.info("Lapisan data lalu lintas disembunyikan (perkecil untuk performa).");
      }
    }
  }, [map, layerGroup, minZoom, isMapLoaded]); // Add isMapLoaded to dependencies

  useEffect(() => {
    if (!map || !layerGroup || !isMapLoaded) return; // Check isMapLoaded

    map.on('zoomend', updateVisibility);
    updateVisibility(); // Initial check

    return () => {
      map.off('zoomend', updateVisibility);
      layerGroup.clearLayers();
      geoJsonDataRef.current = null;
    };
  }, [map, layerGroup, updateVisibility, isMapLoaded]); // Add isMapLoaded to dependencies

  useEffect(() => {
    if (!map || !layerGroup || !isMapLoaded) return; // Check isMapLoaded

    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/export.geojson');
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data = await response.json();

        layerGroup.clearLayers();

        const filteredFeatures = data.features.filter((feature: L.GeoJSON.Feature) => {
          const properties = feature.properties;
          const matchesVehicleType = selectedVehicleType === 'all' ||
                                     (properties?.vehicle_type && properties.vehicle_type.toLowerCase() === selectedVehicleType.toLowerCase());
          const matchesRoadCondition = roadConditionFilter === 'all' ||
                                       (properties?.traffic_level && properties.traffic_level.toLowerCase() === roadConditionFilter.toLowerCase());
          return matchesVehicleType && matchesRoadCondition;
        });

        geoJsonDataRef.current = L.geoJSON({ ...data, features: filteredFeatures }, {
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
              opacity: 0.1
            };
          }
        });
        geoJsonDataRef.current.addTo(layerGroup);
        updateVisibility();
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        toast.error(`Gagal memuat data GeoJSON: ${error instanceof Error ? error.message : String(error)}. Pastikan file 'export.geojson' ada di folder 'public'.`);
      }
    };

    fetchGeoJSON();
  }, [map, layerGroup, selectedVehicleType, roadConditionFilter, getCustomIcon, updateVisibility, isMapLoaded]); // Add isMapLoaded to dependencies

  return layerGroup;
};