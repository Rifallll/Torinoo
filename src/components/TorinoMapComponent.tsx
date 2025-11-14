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

  // Initialize the map and get base layers
  const { mapInstance: map, baseLayers } = useMapInitialization({
    mapContainerId: 'torino-map',
    center: torinoCenter,
    zoom: defaultZoom,
  });

  // Conditionally call layer hooks only if map is initialized
  const geoJsonLayerGroup = useGeoJsonLayer({
    map, // Pass the actual map instance
    geoJsonPath: '/export.geojson',
    minZoomForGeoJSON,
    selectedVehicleType,
    roadConditionFilter,
  });

  const subwayStationsLayerGroup = useSubwayStationsLayer({
    map, // Pass the actual map instance
    minZoomForSubwayStations,
  });

  const tomtomTrafficLayer = useTomTomTrafficLayer({
    map, // Pass the actual map instance
    tomtomApiKey,
    torinoBounds,
  });

  const publicTransportVehiclesLayerGroup = usePublicTransportLayer({
    map, // Pass the actual map instance
    minZoomForPublicTransport,
    torinoBounds,
  });

  // Effect to add Layer Control once map and all overlay layers are ready
  useEffect(() => {
    if (map && Object.keys(baseLayers).length > 0) { // Ensure baseLayers are also loaded
      const overlayLayers: { [key: string]: L.Layer } = {};
      if (geoJsonLayerGroup) overlayLayers["Traffic Data (GeoJSON)"] = geoJsonLayerGroup;
      if (subwayStationsLayerGroup) overlayLayers["Subway Stations"] = subwayStationsLayerGroup;
      if (publicTransportVehiclesLayerGroup) overlayLayers["Public Transport Vehicles"] = publicTransportVehiclesLayerGroup;
      if (tomtomTrafficLayer) overlayLayers["TomTom Traffic Flow"] = tomtomTrafficLayer;

      const layerControl = L.control.layers(baseLayers, overlayLayers).addTo(map);

      return () => {
        map.removeControl(layerControl);
      };
    }
  }, [map, baseLayers, geoJsonLayerGroup, subwayStationsLayerGroup, publicTransportVehiclesLayerGroup, tomtomTrafficLayer]);


  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;