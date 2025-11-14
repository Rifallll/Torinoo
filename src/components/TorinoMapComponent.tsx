"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { toast } from 'sonner'; // Import toast for user feedback
import { convertCoordinates } from '../utils/coordinateConverter'; // Import the coordinate converter
import { useSettings } from '@/contexts/SettingsContext'; // Import useSettings

// Fix for default marker icon issue with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface TorinoMapComponentProps {
  selectedVehicleType: string;
  roadConditionFilter: string;
}

const TorinoMapComponent: React.FC<TorinoMapComponentProps> = React.memo(({ selectedVehicleType, roadConditionFilter }) => {
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null); // Ref for GeoJSON data itself
  const geoJsonLayerGroupRef = useRef<L.LayerGroup | null>(null); // Ref for the layer group to manage visibility
  const subwayStationsLayerGroupRef = useRef<L.LayerGroup | null>(null); // Ref for subway stations layer group
  const tomtomTrafficFlowLayerRef = useRef<L.TileLayer | null>(null); // Ref for TomTom layer

  const { isTomTomLayerEnabled } = useSettings(); // Use the setting

  const torinoCenter: [number, number] = [45.0703, 7.6869];
  const defaultZoom = 13;
  const minZoomForGeoJSON = 15; // Increased from 14 to 15 to reduce clutter at lower zoom levels
  const minZoomForSubwayStations = 12; // Changed: Minimum zoom level for subway stations to appear (was 14)

  // Define approximate bounding box for Torino (South-West, North-East)
  const torinoBounds = L.latLngBounds([44.95, 7.50], [45.18, 7.85]);

  // Dummy data for subway stations (using original EPSG:3003 coordinates)
  const subwayStationsData = [
    { name: "Fermi", x: 1494000, y: 4990000 },
    { name: "Paradiso", x: 1495000, y: 4990500 },
    { name: "Marche", x: 1496000, y: 4991000 },
    { name: "Racconigi", x: 1497000, y: 4991500 },
    { name: "Bernini", x: 1498000, y: 4992000 },
    { name: "Principi d'Acaja", x: 1499000, y: 4992500 },
    { name: "XVIII Dicembre", x: 1500000, y: 4993000 },
    { name: "Porta Susa", x: 1500500, y: 4993200 },
    { name: "Vinzaglio", x: 1501000, y: 4993500 },
    { name: "Re Umberto", x: 1501500, y: 4993800 },
    { name: "Porta Nuova", x: 1502000, y: 4994000 },
    { name: "Marconi", x: 1502500, y: 4994300 },
    { name: "Nizza", x: 1503000, y: 4994600 },
    { name: "Dante", x: 1503500, y: 4994900 },
    { name: "Carducci-Molinette", x: 1504000, y: 4995200 },
    { name: "Spezia", x: 1504500, y: 4995500 },
    { name: "Lingotto", x: 1505000, y: 4995800 },
    { name: "Italia 61 - Regione Piemonte", x: 1505500, y: 4996100 },
    { name: "Bengasi", x: 1506000, y: 4996400 },
  ];

  // Helper function to get custom icon for features
  const getCustomIcon = (feature: L.GeoJSON.Feature) => {
    const properties = feature.properties;
    let iconColor = '#3b82f6'; // Default blue
    let iconText = '?';
    let iconSize = 24;
    let iconShape = 'circle'; // Default shape

    if (properties) {
      const vehicleType = properties.vehicle_type;
      const amenity = properties.amenity;
      const buildingType = properties.building_type; // Assuming this might exist for buildings

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
          case 'apartment': // Explicitly handle 'apartment'
            iconColor = '#6b7280'; // Gray
            iconText = 'B'; // 'B' for Building, or 'A' for Apartment if preferred
            iconShape = 'square';
            break;
          default: // For other amenities not explicitly listed
            iconColor = '#3b82f6'; // Default blue
            iconText = 'L'; // 'L' for Location/Landmark
            iconSize = 20;
            iconShape = 'circle';
        }
      } else if (buildingType && buildingType.toLowerCase() === 'residential') { // Handle generic residential buildings
        iconColor = '#800080'; // Purple
        iconText = 'R';
        iconShape = 'square';
      } else {
        // Fallback for any point feature without specific vehicle_type or amenity/building_type
        iconColor = '#6b7280'; // Darker gray for generic points
        iconText = 'P'; // 'P' for Point of Interest
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

  // Function to update GeoJSON layer visibility based on zoom
  const updateGeoJSONVisibility = () => {
    if (!mapRef.current || !geoJsonLayerGroupRef.current) return;

    if (mapRef.current.getZoom() >= minZoomForGeoJSON) {
      if (!mapRef.current.hasLayer(geoJsonLayerGroupRef.current)) {
        geoJsonLayerGroupRef.current.addTo(mapRef.current);
        toast.info("Lapisan data lalu lintas ditampilkan (perbesar untuk detail).");
      }
    } else {
      if (mapRef.current.hasLayer(geoJsonLayerGroupRef.current)) {
        mapRef.current.removeLayer(geoJsonLayerGroupRef.current);
        toast.info("Lapisan data lalu lintas disembunyikan (perkecil untuk performa).");
      }
    }
  };

  // Function to update Subway Stations layer visibility based on zoom
  const updateSubwayStationsVisibility = () => {
    if (!mapRef.current || !subwayStationsLayerGroupRef.current) return;

    if (mapRef.current.getZoom() >= minZoomForSubwayStations) {
      if (!mapRef.current.hasLayer(subwayStationsLayerGroupRef.current)) {
        subwayStationsLayerGroupRef.current.addTo(mapRef.current);
        toast.info("Lapisan halte kereta bawah tanah ditampilkan.");
      }
    } else {
      if (mapRef.current.hasLayer(subwayStationsLayerGroupRef.current)) {
        mapRef.current.removeLayer(subwayStationsLayerGroupRef.current);
        toast.info("Lapisan halte kereta bawah tanah disembunyikan (perkecil untuk performa).");
      }
    }
  };

  // Function to manage TomTom Traffic Flow layer visibility based on map bounds AND toggle state
  const updateTomTomTrafficVisibility = () => {
    if (!mapRef.current || !tomtomTrafficFlowLayerRef.current) return;

    const currentMapBounds = mapRef.current.getBounds();
    const isTomTomLayerActive = mapRef.current.hasLayer(tomtomTrafficFlowLayerRef.current);
    const isWithinTorino = currentMapBounds.intersects(torinoBounds);

    console.log("TomTom Visibility Check:");
    console.log("  isTomTomLayerEnabled:", isTomTomLayerEnabled);
    console.log("  isWithinTorinoBounds:", isWithinTorino);
    console.log("  isTomTomLayerCurrentlyActive:", isTomTomLayerActive);

    if (isTomTomLayerEnabled && isWithinTorino) {
      if (!isTomTomLayerActive) {
        tomtomTrafficFlowLayerRef.current.addTo(mapRef.current);
        toast.info("Lapisan lalu lintas TomTom diaktifkan untuk Torino.");
        console.log("  Adding TomTom layer to map.");
      } else {
        console.log("  TomTom layer already active.");
      }
    } else {
      if (isTomTomLayerActive) {
        mapRef.current.removeLayer(tomtomTrafficFlowLayerRef.current);
        toast.info("Lapisan lalu lintas TomTom dinonaktifkan (di luar Torino atau dimatikan).");
        console.log("  Removing TomTom layer from map.");
      } else {
        console.log("  TomTom layer already inactive or not added.");
      }
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map with preferCanvas: true for better performance with complex vector data
      mapRef.current = L.map('torino-map', { preferCanvas: true }).setView(torinoCenter, defaultZoom);

      // Add OpenStreetMap tile layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      osmLayer.addTo(mapRef.current);

      // Initialize Layer Groups
      geoJsonLayerGroupRef.current = L.layerGroup();
      subwayStationsLayerGroupRef.current = L.layerGroup();

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
          .addTo(subwayStationsLayerGroupRef.current!);
        }
      });

      // Get TomTom API Key from environment variables
      const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;
      console.log("TomTom API Key (masked):", tomtomApiKey ? tomtomApiKey.substring(0, 5) + '...' + tomtomApiKey.substring(tomtomApiKey.length - 5) : 'NOT_SET');
      
      if (tomtomApiKey && tomtomApiKey !== 'YOUR_TOMTOM_API_KEY_HERE') {
        tomtomTrafficFlowLayerRef.current = L.tileLayer(
          `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
          {
            attribution: '&copy; <a href="https://tomtom.com">TomTom</a>',
            maxZoom: 19,
            opacity: 1.0, // Mengubah opasitas menjadi 1.0
          }
        );
      } else {
        toast.warning("Kunci API TomTom tidak ditemukan atau belum diatur. Lapisan lalu lintas TomTom tidak akan tersedia.");
        console.warn("TomTom API Key is missing or is the placeholder. TomTom traffic layer will not be available.");
      }

      // Add Geocoder control
      L.Control.geocoder({
        defaultMarkGeocode: false,
      })
      .on('markgeocode', function(e: any) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
          [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
          [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
          [bbox.getSouthWest().lat, bbox.getSouthWest().lng]
        ]).addTo(mapRef.current!);
        mapRef.current!.fitBounds(poly.getBounds());
      })
      .addTo(mapRef.current!);

      // Add Fullscreen control (simple custom button)
      const FullscreenControl = L.Control.extend({
        onAdd: function(map: L.Map) {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          container.innerHTML = '<button title="Toggle Fullscreen" style="width:30px;height:30px;line-height:30px;text-align:center;cursor:pointer;">&#x26F6;</button>';
          container.onclick = () => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              map.getContainer().requestFullscreen();
            }
          };
          return container;
        },
        onRemove: function(map: L.Map) {},
      });
      new FullscreenControl({ position: 'topleft' }).addTo(mapRef.current);

      // Add Layer control
      const baseLayers = {
        "OpenStreetMap": osmLayer,
        "Dark Mode": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
        "Terrain": L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
      };
      const overlayLayers: { [key: string]: L.Layer } = {
        "Traffic Data (GeoJSON)": geoJsonLayerGroupRef.current,
        "Subway Stations": subwayStationsLayerGroupRef.current,
      };

      // Only add TomTom layer to control if it was successfully initialized
      if (tomtomTrafficFlowLayerRef.current) {
        overlayLayers["TomTom Traffic Flow"] = tomtomTrafficFlowLayerRef.current;
      }

      L.control.layers(baseLayers, overlayLayers).addTo(mapRef.current);

      // Reset view control
      const ResetViewControl = L.Control.extend({
        onAdd: function(map: L.Map) {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          container.innerHTML = '<button title="Reset View" style="width:30px;height:30px;line-height:30px;text-align:center;cursor:pointer;">&#x21BA;</button>';
          container.onclick = () => {
            map.setView(torinoCenter, defaultZoom);
          };
          return container;
        },
        onRemove: function(map: L.Map) {},
      });
      new ResetViewControl({ position: 'topleft' }).addTo(mapRef.current);

      // Add event listeners for zoom and move changes
      mapRef.current.on('zoomend', updateGeoJSONVisibility);
      mapRef.current.on('zoomend', updateSubwayStationsVisibility);
      mapRef.current.on('moveend', updateTomTomTrafficVisibility);
      mapRef.current.on('zoomend', updateTomTomTrafficVisibility);

      // Initial check for visibility
      updateGeoJSONVisibility();
      updateSubwayStationsVisibility();
    }

    // Fetch and add GeoJSON data
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/export.geojson'); // Path to the GeoJSON file in the public folder
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data = await response.json();

        if (mapRef.current && geoJsonLayerGroupRef.current) {
          // Clear existing GeoJSON layer from the group
          geoJsonLayerGroupRef.current.clearLayers();

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
              // Bind popup with all properties
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
              // Custom marker for points based on 'vehicle_type' or 'amenity' property
              return L.marker(latlng, { icon: getCustomIcon(feature) });
            },
            style: (feature) => {
              // Custom style for lines/polygons based on properties
              const trafficLevel = feature?.properties?.traffic_level;
              let color = '#6b7280'; // Changed default to a darker gray
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

              // Apply roadConditionFilter to line styles as well
              if (roadConditionFilter !== 'all' && trafficLevel?.toLowerCase() !== roadConditionFilter.toLowerCase()) {
                return { opacity: 0 }; // Hide if it doesn't match the filter
              }

              return {
                color: color,
                weight: weight,
                opacity: 0.6 // Mengubah opasitas menjadi 0.6 untuk membuatnya lebih terlihat
              };
            }
          });
          geoJsonLayerRef.current.addTo(geoJsonLayerGroupRef.current); // Add to the layer group

          // Update visibility after loading new data
          if (mapRef.current.getZoom() >= minZoomForGeoJSON) {
            if (!mapRef.current.hasLayer(geoJsonLayerGroupRef.current)) {
              mapRef.current.addLayer(geoJsonLayerGroupRef.current);
            }
          }

          // Optionally, fit map bounds to the GeoJSON layer if it's valid
          if (geoJsonLayerRef.current.getBounds().isValid()) {
            mapRef.current.fitBounds(geoJsonLayerRef.current.getBounds());
          }
        }
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        toast.error(`Gagal memuat data GeoJSON: ${error instanceof Error ? error.message : String(error)}. Pastikan file 'export.geojson' ada di folder 'public'.`);
      }
    };

    fetchGeoJSON();

    return () => {
      if (mapRef.current) {
        mapRef.current.off('zoomend', updateGeoJSONVisibility);
        mapRef.current.off('zoomend', updateSubwayStationsVisibility);
        mapRef.current.off('moveend', updateTomTomTrafficVisibility);
        mapRef.current.off('zoomend', updateTomTomTrafficVisibility);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedVehicleType, roadConditionFilter]); // Re-run when filters change

  // This useEffect specifically handles the TomTom layer based on `isTomTomLayerEnabled`
  useEffect(() => {
    console.log("TomTom layer enabled state changed:", isTomTomLayerEnabled);
    updateTomTomTrafficVisibility();
  }, [isTomTomLayerEnabled]); // Re-run when the toggle state changes

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
});

export default TorinoMapComponent;