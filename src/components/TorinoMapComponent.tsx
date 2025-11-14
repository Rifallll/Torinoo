"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { toast } from 'sonner';
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering React component into Leaflet control

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
import MapLegend from './MapLegend'; // Import the new MapLegend component

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

  // Initialize the map and get layer groups
  const {
    map,
    geoJsonLayerGroup,
    subwayStationsLayerGroup,
    tomtomTrafficFlowLayer,
    publicTransportVehiclesLayerGroup,
    isMapLoaded, // Receive the new state
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
    // Removed getCustomIcon prop as it's handled internally by useGeoJsonLayer
    isMapLoaded, // Pass the state
  });

  // Manage Subway Stations layer
  useSubwayStationsLayer({
    map,
    layerGroup: subwayStationsLayerGroup,
    minZoom: minZoomForSubwayStations,
    subwayStationsData: subwayStationsData,
    isMapLoaded, // Pass the state
  });

  // Manage TomTom Traffic layer
  useTomTomTrafficLayer({
    map,
    layer: tomtomTrafficFlowLayer,
    bounds: torinoBounds,
    isMapLoaded, // Pass the state
  });

  // Manage Public Transport Vehicles layer
  usePublicTransportVehiclesLayer({
    map,
    layerGroup: publicTransportVehiclesLayerGroup,
    minZoom: minZoomForPublicTransport,
    bounds: torinoBounds,
    isMapLoaded, // Pass the state
  });

  // Effect to add the React-based legend control
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    let reactRoot: ReactDOM.Root | null = null; // To store the React root instance

    // Create a custom Leaflet control for the React component
    const ReactControl = L.Control.extend({
      onAdd: function(map: L.Map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        // Prevent click events from propagating to the map
        L.DomEvent.disableClickPropagation(container);
        
        // Add inline style for z-index to ensure visibility
        container.style.zIndex = '1000'; 
        
        // Create and render the React component
        reactRoot = ReactDOM.createRoot(container);
        reactRoot.render(<MapLegend />);
        
        console.log("Legend control container created and React component rendered.");
        return container;
      },
      onRemove: function(map: L.Map) {
        if (reactRoot) {
          reactRoot.unmount(); // Proper cleanup for React 18
          reactRoot = null;
          console.log("Legend control React component unmounted.");
        }
      },
    });

    const legendControl = new ReactControl({ position: 'bottomright' });
    legendControl.addTo(map);

    return () => {
      if (map.hasControl(legendControl)) {
        map.removeControl(legendControl);
      }
    };
  }, [map, isMapLoaded]); // Re-run when map or isMapLoaded changes

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;