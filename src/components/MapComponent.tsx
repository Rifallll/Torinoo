"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: { lat: number; lng: number; popupText: string; color?: string }[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [51.505, -0.09],
  zoom = 13,
  markers = [],
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      markerLayerRef.current = L.layerGroup().addTo(mapRef.current);
    } else {
      mapRef.current.setView(center, zoom);
    }

    // Clear existing markers
    markerLayerRef.current?.clearLayers();

    // Add new markers
    markers.forEach(markerData => {
      const customIcon = new L.DivIcon({
        className: `custom-div-icon ${markerData.color ? `bg-${markerData.color}-500` : 'bg-indigo-500'} rounded-full w-3 h-3 border-2 border-white shadow-md`,
        iconAnchor: [6, 6],
      });

      L.marker([markerData.lat, markerData.lng], { icon: customIcon })
        .bindPopup(markerData.popupText)
        .addTo(markerLayerRef.current!);
    });

    // Fit bounds if there are markers
    if (markers.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup map on component unmount if it's the only instance
      if (mapRef.current && document.getElementById('map')?.children.length === 1) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom, markers]);

  return <div id="map" className="h-full w-full rounded-md"></div>;
};

export default MapComponent;