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

    const htmlString = `<div style="background-color:${bgColor}; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:${textColor}; font-size:12px; font-weight:bold;">${iconText}</div>`;
    console.log("GeoJSON Icon HTML:", htmlString);

    return L.divIcon({
      className: 'custom-poi-marker',
      html: htmlString,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
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
    subwayStationsData: subwayStationsData,
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