"use client";

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Fix for default marker icon issue with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapInitializationProps {
  mapContainerId: string;
  center: L.LatLngExpression;
  zoom: number;
}

interface MapLayers {
  geoJsonLayerGroup: L.LayerGroup;
  subwayStationsLayerGroup: L.LayerGroup;
  gtfsRoutesLayerGroup: L.LayerGroup;
}

export const useMapInitialization = ({ mapContainerId, center, zoom }: MapInitializationProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const layerGroupsRef = useRef<MapLayers | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      return; // Map already initialized
    }

    const map = L.map(mapContainerId, { preferCanvas: true }).setView(center, zoom);
    mapRef.current = map;
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Initialize Layer Groups (DO NOT add to map yet)
    const geoJsonLayerGroup = L.layerGroup();
    const subwayStationsLayerGroup = L.layerGroup();
    const gtfsRoutesLayerGroup = L.layerGroup();

    layerGroupsRef.current = {
      geoJsonLayerGroup,
      subwayStationsLayerGroup,
      gtfsRoutesLayerGroup,
    };

    // Set mapInstance ONLY after the map is fully loaded and its internal structures are ready
    map.whenReady(() => {
      setMapInstance(map);
      // IMPORTANT: Layer groups are NOT added to the map here.
      // Individual layer hooks will manage adding/removing their respective layer groups.
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapInstance(null);
        layerGroupsRef.current = null;
      }
    };
  }, [mapContainerId, center, zoom]);

  return { map: mapInstance, layerGroups: layerGroupsRef.current };
};