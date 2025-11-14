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
  mapContainerRef: React.RefObject<HTMLDivElement>; // Accept the ref
  center: L.LatLngExpression;
  zoom: number;
}

interface MapLayers {
  geoJsonLayerGroup: L.LayerGroup;
  subwayStationsLayerGroup: L.LayerGroup;
  gtfsRoutesLayerGroup: L.LayerGroup;
}

export const useMapInitialization = ({ mapContainerRef, center, zoom }: MapInitializationProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const layerGroupsRef = useRef<MapLayers | null>(null);

  useEffect(() => {
    // Only initialize if the ref is available and map hasn't been initialized yet
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, { preferCanvas: true }).setView(center, zoom);
      mapRef.current = map;
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Initialize Layer Groups and ADD THEM TO THE MAP IMMEDIATELY
      const geoJsonLayerGroup = L.layerGroup().addTo(map);
      const subwayStationsLayerGroup = L.layerGroup().addTo(map);
      const gtfsRoutesLayerGroup = L.layerGroup().addTo(map);

      layerGroupsRef.current = {
        geoJsonLayerGroup,
        subwayStationsLayerGroup,
        gtfsRoutesLayerGroup,
      };

      // Set mapInstance ONLY after the map is fully loaded and its internal structures are ready
      map.whenReady(() => {
        setMapInstance(map);
      });

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          setMapInstance(null);
          layerGroupsRef.current = null;
        }
      };
    }
    // If mapContainerRef.current is null, do nothing and wait for it to be available
  }, [mapContainerRef, center, zoom]);

  return { map: mapInstance, layerGroups: layerGroupsRef.current };
};