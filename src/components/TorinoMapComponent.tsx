"use client";

import React, { useRef } from 'react'; // Import useRef
import L from 'leaflet'; // Import L for LatLngBoundsExpression

// Import custom hooks and utilities
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapControls } from '@/hooks/useMapControls';
import { useGeoJsonLayer } from '@/hooks/useGeoJsonLayer';
import { useSubwayStationsLayer } from '@/hooks/useSubwayStationsLayer';
import { useGtfsRoutesLayer } from '@/hooks/useGtfsRoutesLayer';
import { useTomTomTrafficLayer } from '@/hooks/useTomTomTrafficLayer';
import { useSettings } from '@/contexts/SettingsContext';
import { convertCoordinates } from '@/utils/coordinateConverter'; // Still needed for subway data

interface TorinoMapComponentProps {
  selectedVehicleType: string;
  roadConditionFilter: string;
  gtfsRouteTypeFilter: string;
}

const TorinoMapComponent: React.FC<TorinoMapComponentProps> = ({ selectedVehicleType, roadConditionFilter, gtfsRouteTypeFilter }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null); // Create a ref for the map container

  const torinoCenter: L.LatLngExpression = [45.0703, 7.6869];
  const defaultZoom = 13;
  const minZoomForGeoJSON = 15;
  const minZoomForSubwayStations = 12;
  const minZoomForGtfsRoutes = 12;

  // Define approximate bounding box for Torino (South-West, North-East)
  const torinoBounds: L.LatLngBoundsExpression = [[44.95, 7.50], [45.18, 7.85]];

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

  const { isTomTomLayerEnabled } = useSettings();
  const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;

  // 1. Initialize the map and get layer groups
  const { map, layerGroups } = useMapInitialization({
    mapContainerRef, // Pass the ref here
    center: torinoCenter,
    zoom: defaultZoom,
  });

  // 2. Initialize TomTom traffic layer (now only creates the layer instance)
  const tomtomTrafficFlowLayer = useTomTomTrafficLayer({
    map,
    tomtomApiKey,
    isTomTomLayerEnabled, // Pass the enabled state here
  });

  // 3. Add map controls and manage TomTom layer visibility
  useMapControls({
    map,
    layerGroups,
    tomtomTrafficFlowLayer, // Pass the created layer instance
    isTomTomLayerEnabled, // Pass the enabled state
    torinoBounds, // Pass the bounds for visibility logic
    torinoCenter,
    defaultZoom,
  });

  // 4. Manage GeoJSON layer
  useGeoJsonLayer({
    map,
    geoJsonLayerGroup: layerGroups?.geoJsonLayerGroup || null,
    selectedVehicleType,
    roadConditionFilter,
    minZoomForGeoJSON,
  });

  // 5. Manage Subway Stations layer
  useSubwayStationsLayer({
    map,
    subwayStationsLayerGroup: layerGroups?.subwayStationsLayerGroup || null,
    subwayStationsData,
    minZoomForSubwayStations,
  });

  // 6. Manage GTFS Routes layer
  useGtfsRoutesLayer({
    map,
    gtfsRoutesLayerGroup: layerGroups?.gtfsRoutesLayerGroup || null,
    gtfsRouteTypeFilter,
    minZoomForGtfsRoutes,
  });

  return <div id="torino-map" ref={mapContainerRef} className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;