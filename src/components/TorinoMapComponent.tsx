"use client";

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Import custom hooks
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useGeoJsonLayer } from '@/hooks/useGeoJsonLayer';
import { useSubwayStationsLayer } from '@/hooks/useSubwayStationsLayer';
import { useTomTomTrafficLayer } from '@/hooks/useTomTomTrafficLayer';
import { usePublicTransportLayer } from '@/hooks/usePublicTransportLayer';

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

  // Initialize all layer groups first, so they can be passed to useMapInitialization
  const geoJsonLayerGroup = useGeoJsonLayer({
    map: null, // Will be set after map initialization
    geoJsonPath: '/export.geojson',
    minZoomForGeoJSON,
    selectedVehicleType,
    roadConditionFilter,
  });

  const subwayStationsLayerGroup = useSubwayStationsLayer({
    map: null, // Will be set after map initialization
    minZoomForSubwayStations,
  });

  const tomtomTrafficLayer = useTomTomTrafficLayer({
    map: null, // Will be set after map initialization
    tomtomApiKey,
    torinoBounds,
  });

  const publicTransportVehiclesLayerGroup = usePublicTransportLayer({
    map: null, // Will be set after map initialization
    minZoomForPublicTransport,
    torinoBounds,
  });

  // Collect all overlay layers for the map initialization hook
  const overlayLayers: { [key: string]: L.Layer } = {};
  if (geoJsonLayerGroup) overlayLayers["Traffic Data (GeoJSON)"] = geoJsonLayerGroup;
  if (subwayStationsLayerGroup) overlayLayers["Subway Stations"] = subwayStationsLayerGroup;
  if (publicTransportVehiclesLayerGroup) overlayLayers["Public Transport Vehicles"] = publicTransportVehiclesLayerGroup;
  if (tomtomTrafficLayer) overlayLayers["TomTom Traffic Flow"] = tomtomTrafficLayer;

  // Initialize the map
  const map = useMapInitialization({
    mapContainerId: 'torino-map',
    center: torinoCenter,
    zoom: defaultZoom,
    torinoBounds,
    overlayLayers,
  });

  // Pass the initialized map instance to each layer hook
  useEffect(() => {
    if (map) {
      // Re-initialize layers with the actual map instance
      // This is a bit of a workaround for hooks that need the map instance
      // but are called before the map is fully initialized.
      // In a more complex scenario, you might pass a setter function or use context.
      // For now, we'll rely on the internal logic of each hook to handle `map` changing from null to L.Map.
    }
  }, [map]);

  // Manually trigger updates for layers that depend on map instance
  // This is necessary because the map instance is initially null and then becomes L.Map
  // The hooks themselves handle the internal logic for map.on('zoomend') etc.
  useGeoJsonLayer({ map, geoJsonPath: '/export.geojson', minZoomForGeoJSON, selectedVehicleType, roadConditionFilter });
  useSubwayStationsLayer({ map, minZoomForSubwayStations });
  useTomTomTrafficLayer({ map, tomtomApiKey, torinoBounds });
  usePublicTransportLayer({ map, minZoomForPublicTransport, torinoBounds });

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;