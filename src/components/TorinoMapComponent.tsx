"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { toast } from 'sonner';

// Import custom hooks and utilities
import { useSettings } from '@/contexts/SettingsContext';
import { useGtfsRealtimeData } from '@/hooks/useGtfsRealtimeData';
import { getRouteTypeIcon, getVehicleStatus, getCongestionBadgeClass, formatCongestionLevel, formatRelativeTime } from '@/utils/gtfsRealtimeParser';
// import { renderToString } from 'react-dom/server'; // No longer needed
import { convertCoordinates } from '../utils/coordinateConverter';

// Import new modular hooks
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useGeoJsonLayer } from '@/hooks/useGeoJsonLayer';
import { useSubwayStationsLayer } from '@/hooks/useSubwayStationsLayer';
import { useTomTomTrafficLayer } from '@/hooks/useTomTomTrafficLayer';
import { usePublicTransportVehiclesLayer } from '@/hooks/usePublicTransportVehiclesLayer';

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

const TorinoMapComponent: React.FC<TorinoMapComponentProps> = ({ selectedVehicleType, roadConditionFilter }) => {
  const torinoCenter: [number, number] = [45.0703, 7.6869];
  const defaultZoom = 13;
  const minZoomForGeoJSON = 15;
  const minZoomForSubwayStations = 12;
  const minZoomForPublicTransport = 12;
  const torinoBounds = L.latLngBounds([44.95, 7.50], [45.18, 7.85]);
  const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;

  // Subway Stations Static Data (moved here to be passed to useMapInitialization)
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

  // Helper function to get custom icon for features (kept here as it's used by GeoJSON layer)
  const getCustomIcon = useCallback((feature: L.GeoJSON.Feature) => {
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

    // SUPER SIMPLIFIED HTML FOR DEBUGGING
    const htmlString = `<div style="background-color:${iconColor}; color:white; width:${iconSize}px; height:${iconSize}px; border-radius:${iconShape === 'circle' ? '50%' : '5px'}; display:flex; align-items:center; justify-content:center; font-size:${iconSize / 2}px;">${iconText}</div>`;
    console.log("Generated custom icon HTML:", htmlString); // Log the HTML string

    return L.divIcon({
      className: 'custom-poi-marker',
      html: htmlString,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2]
    });
  }, []);

  // Initialize the map and get layer groups
  const {
    map,
    geoJsonLayerGroup,
    subwayStationsLayerGroup,
    tomtomTrafficFlowLayer,
    publicTransportVehiclesLayerGroup,
  } = useMapInitialization({
    mapContainerId: 'torino-map',
    center: torinoCenter,
    zoom: defaultZoom,
    bounds: torinoBounds,
    tomtomApiKey: tomtomApiKey,
    subwayStationsData: subwayStationsData,
  });

  // Manage GeoJSON layer
  useGeoJsonLayer({
    map,
    layerGroup: geoJsonLayerGroup,
    selectedVehicleType,
    roadConditionFilter,
    minZoom: minZoomForGeoJSON,
    getCustomIcon,
  });

  // Manage Subway Stations layer
  useSubwayStationsLayer({
    map,
    layerGroup: subwayStationsLayerGroup,
    minZoom: minZoomForSubwayStations,
  });

  // Manage TomTom Traffic layer
  useTomTomTrafficLayer({
    map,
    layer: tomtomTrafficFlowLayer,
    bounds: torinoBounds,
  });

  // Manage Public Transport Vehicles layer
  usePublicTransportVehiclesLayer({
    map,
    layerGroup: publicTransportVehiclesLayerGroup,
    minZoom: minZoomForPublicTransport,
    bounds: torinoBounds,
  });

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;