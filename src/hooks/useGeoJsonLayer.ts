"use client";

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';

interface GeoJsonLayerProps {
  map: L.Map | null;
  geoJsonPath: string;
  minZoomForGeoJSON: number;
  selectedVehicleType: string;
  roadConditionFilter: string;
}

// Helper function to get custom icon for features (moved from TorinoMapComponent)
const getCustomIcon = (feature: L.GeoJSON.Feature) => {
  const properties = feature.properties;
  let iconColor = '#3b82f6'; // Default blue
  let iconText = '?';
  let iconSize = 24;
  let iconShape = 'circle'; // Default shape

  if (properties) {
    const vehicleType = properties.vehicle_type;
    const amenity = properties.amenity;
    const buildingType = properties.building_type;

    if (vehicleType) {
      switch (vehicleType.toLowerCase()) {
        case 'car':
          iconColor = '#3b82f6'; // Blue
          iconText = 'C';
          break;
        case 'motorcycle':
          iconColor = '#f97316'; // Orange
          iconText = 'M';
          break;
        case 'bus':
          iconColor = '#22c55e'; // Green
          iconText = 'B';
          break;
        case 'truck':
          iconColor = '#ef4444'; // Red
          iconText = 'T';
          break;
        case 'tram':
          iconColor = '#a855f7'; // Purple
          iconText = 'TR';
          iconSize = 30;
          iconShape = 'square';
          break;
        case 'subway':
          iconColor = '#6b7280'; // Gray
          iconText = 'S';
          iconSize = 30;
          iconShape = 'square';
          break;
        default:
          iconColor = '#3b82f6';
          iconText = '?';
      }
    } else if (amenity) {
      switch (amenity.toLowerCase()) {
        case 'hospital':
          iconColor = '#ef4444'; // Red
          iconText = '+';
          break;
        case 'school':
          iconColor = '#22c55e'; // Green
          iconText = 'S';
          break;
        case 'park':
          iconColor = '#10b981'; // Teal
          iconText = 'P';
          break;
        case 'restaurant':
          iconColor = '#f97316'; // Orange
          iconText = 'R';
          break;
        case 'cafe':
          iconColor = '#a855f7'; // Purple
          iconText = 'C';
          break;
        case 'shop':
          iconColor = '#ec4899'; // Pink
          iconText = 'S';
          break;
        case 'building':
        case 'apartment':
          iconColor = '#6b7280'; // Gray
          iconText = 'B';
          iconShape = 'square';
          break;
        default:
          iconColor = '#3b82f6';
          iconText = 'L';
          iconSize = 20;
          iconShape = 'circle';
      }
    } else if (buildingType && buildingType.toLowerCase() === 'residential') {
      iconColor = '#800080'; // Purple
      iconText = 'R';
      iconShape = 'square';
    } else {
      iconColor = '#6b7280';
      iconText = 'P';
      iconSize = 20;
      iconShape = 'circle';
    }
  }

  const borderRadius = iconShape === 'circle' ? '50%' : '5px';

  return L.divIcon({
    className: 'custom-poi-marker',
    html: `<div style="background-color:${iconColor}; width:${iconSize}px; height:${iconSize}px; border-radius:${borderRadius}; display:flex; align-items:center; justify-content:center; color:white; font-size:${iconSize / 2}px; font-weight:bold; opacity:0.1;">${iconText}</div>`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2]
  });
};

export const useGeoJsonLayer = ({ map, geoJsonPath, minZoomForGeoJSON, selectedVehicleType, roadConditionFilter }: GeoJsonLayerProps) => {
  const geoJsonLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const updateGeoJSONVisibility = useCallback(() => {
    if (!map || !geoJsonLayerGroupRef.current) return;

    if (map.getZoom() >= minZoomForGeoJSON) {
      if (!map.hasLayer(geoJsonLayerGroupRef.current)) {
        geoJsonLayerGroupRef.current.addTo(map);
        toast.info("Lapisan data lalu lintas ditampilkan (perbesar untuk detail).");
      }
    } else {
      if (map.hasLayer(geoJsonLayerGroupRef.current)) {
        map.removeLayer(geoJsonLayerGroupRef.current);
        toast.info("Lapisan data lalu lintas disembunyikan (perkecil untuk performa).");
      }
    }
  }, [map, minZoomForGeoJSON]);

  useEffect(() => {
    if (!map) return;

    if (!geoJsonLayerGroupRef.current) {
      geoJsonLayerGroupRef.current = L.layerGroup();
    }

    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(geoJsonPath);
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data = await response.json();

        if (geoJsonLayerGroupRef.current) {
          geoJsonLayerGroupRef.current.clearLayers();

          const filteredFeatures = data.features.filter((feature: L.GeoJSON.Feature) => {
            const properties = feature.properties;
            const matchesVehicleType = selectedVehicleType === 'all' ||
                                       (properties?.vehicle_type && properties.vehicle_type.toLowerCase() === selectedVehicleType.toLowerCase());
            const matchesRoadCondition = roadConditionFilter === 'all' ||
                                         (properties?.traffic_level && properties.traffic_level.toLowerCase() === roadConditionFilter.toLowerCase());
            return matchesVehicleType && matchesRoadCondition;
          });

          const geoJsonLayer = L.geoJSON({ ...data, features: filteredFeatures }, {
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
          geoJsonLayer.addTo(geoJsonLayerGroupRef.current);
        }
        updateGeoJSONVisibility(); // Update visibility after loading new data
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        toast.error(`Gagal memuat data GeoJSON: ${error instanceof Error ? error.message : String(error)}. Pastikan file 'export.geojson' ada di folder 'public'.`);
      }
    };

    map.on('zoomend', updateGeoJSONVisibility);
    fetchGeoJSON();

    return () => {
      map.off('zoomend', updateGeoJSONVisibility);
      if (geoJsonLayerGroupRef.current) {
        map.removeLayer(geoJsonLayerGroupRef.current);
        geoJsonLayerGroupRef.current = null;
      }
    };
  }, [map, geoJsonPath, minZoomForGeoJSON, selectedVehicleType, roadConditionFilter, updateGeoJSONVisibility]);

  return geoJsonLayerGroupRef.current;
};