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

  // Helper function to get custom icon for features (kept here as it's used by GeoJSON layer)
  const getCustomIconInternal = useCallback((feature: L.GeoJSON.Feature) => {
    const properties = feature.properties;
    let iconText = '?';
    let bgColor = '#6b7280'; // Default gray
    let textColor = 'white';

    if (properties) {
      const vehicleType = properties.vehicle_type;
      const amenity = properties.amenity;
      const buildingType = properties.building_type;

      if (vehicleType) {
        iconText = vehicleType.charAt(0).toUpperCase();
        bgColor = '#3b82f6'; // Blue for vehicles
      } else if (amenity) {
        iconText = amenity.charAt(0).toUpperCase();
        bgColor = '#10b981'; // Green for amenities
      } else if (buildingType) {
        iconText = buildingType.charAt(0).toUpperCase();
        bgColor = '#f59e0b'; // Amber for buildings
      }
    }

    // Increased size for better visibility
    const htmlString = `<div style="background-color:${bgColor}; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:${textColor}; font-size:14px; font-weight:bold;">${iconText}</div>`;
    console.log("GeoJSON Icon HTML:", htmlString);

    return L.divIcon({
      className: 'custom-poi-marker',
      html: htmlString,
      iconSize: [28, 28], // Increased icon size
      iconAnchor: [14, 14] // Adjusted anchor for new size
    });
  }, []);


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
              let popupContent = `<div class="font-sans text-sm p-2">`;
              
              // Determine a title for the feature, prioritizing OSM ID if available
              const featureId = feature.id || feature.properties.osm_id || 'N/A';
              popupContent += `<h3 class="font-bold text-base mb-1">Way ${featureId}</h3>`;
              
              const propertyKeys = Object.keys(feature.properties);
              popupContent += `<p class="text-xs text-gray-600 mb-2">Tags ${propertyKeys.length}</p>`;
              
              popupContent += `<div class="space-y-1">`;
              for (const key of propertyKeys) {
                // Exclude internal Leaflet properties or other non-relevant ones if needed
                if (!key.startsWith('_') && key !== 'id' && key !== 'osm_id') { // Exclude id/osm_id if already used in title
                  popupContent += `<p><strong>${key}:</strong> ${feature.properties[key]}</p>`;
                }
              }
              popupContent += `</div>`;
              popupContent += `</div>`;
              layer.bindPopup(popupContent);
            }
          },
          pointToLayer: (feature, latlng) => {
            // Explicitly check for markerPane before creating marker with divIcon
            if (!map?.getPanes().markerPane) {
              console.warn("Leaflet markerPane not yet available. Skipping GeoJSON marker creation for now.");
              return L.marker(latlng); // Fallback to default marker if pane not ready
            }
            return L.marker(latlng, { icon: getCustomIconInternal(feature) }); // Use the internal getCustomIcon
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
              opacity: 0.7 // Opacity ditingkatkan dari 0.1 menjadi 0.7
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
  }, [map, layerGroup, selectedVehicleType, roadConditionFilter, getCustomIconInternal, updateVisibility, isMapLoaded]); // Add isMapLoaded to dependencies

  return layerGroup;
};