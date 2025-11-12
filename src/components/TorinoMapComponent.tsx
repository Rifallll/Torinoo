"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { openDataPortals } from '@/data/openDataPortals'; // Import the new data

// Fix for default marker icon issue with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const TorinoMapComponent: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const openDataLayerRef = useRef<L.LayerGroup | null>(null); // New ref for open data markers

  const torinoCenter: [number, number] = [45.0703, 7.6869];
  const defaultZoom = 13;

  const dummyTrafficMarkers = [
    { lat: 45.075, lng: 7.675, popupText: "Area Padat: Via Roma", color: "red" },
    { lat: 45.065, lng: 7.690, popupText: "Area Lancar: Piazza Castello", color: "green" },
    { lat: 45.080, lng: 7.680, popupText: "Area Sedang: Corso Vittorio Emanuele II", color: "orange" },
  ];

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map('torino-map').setView(torinoCenter, defaultZoom);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

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

      // Add Layer control (simple example)
      const baseLayers = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
        "Dark Mode": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
        "Terrain": L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
      };
      
      // Initialize layer groups for control
      markerLayerRef.current = L.layerGroup().addTo(mapRef.current);
      openDataLayerRef.current = L.layerGroup().addTo(mapRef.current);

      const overlayLayers = {
        "Traffic Markers": markerLayerRef.current,
        "Open Data Portals": openDataLayerRef.current,
      };

      L.control.layers(baseLayers, overlayLayers).addTo(mapRef.current);

      // Add main Torino city center marker
      L.marker(torinoCenter)
        .bindPopup("<b>Pusat Kota Torino</b><br/>Titik Fokus Analisis")
        .addTo(markerLayerRef.current);
    }

    // Clear existing dummy markers
    markerLayerRef.current?.clearLayers();
    openDataLayerRef.current?.clearLayers(); // Clear open data markers too

    // Add main Torino city center marker back (if cleared)
    L.marker(torinoCenter)
      .bindPopup("<b>Pusat Kota Torino</b><br/>Titik Fokus Analisis")
      .addTo(markerLayerRef.current!);

    // Add dummy traffic markers
    dummyTrafficMarkers.forEach(markerData => {
      const customIcon = new L.DivIcon({
        className: `custom-div-icon bg-${markerData.color}-500 rounded-full w-3 h-3 border-2 border-white shadow-md`,
        iconAnchor: [6, 6],
      });

      L.marker([markerData.lat, markerData.lng], { icon: customIcon })
        .bindPopup(markerData.popupText)
        .addTo(markerLayerRef.current!);
    });

    // Add Open Data Portals markers
    openDataPortals.forEach(portal => {
      const openDataIcon = new L.DivIcon({
        className: `custom-div-icon bg-blue-500 rounded-full w-3 h-3 border-2 border-white shadow-md`, // Distinct color
        iconAnchor: [6, 6],
      });

      L.marker(portal.location, { icon: openDataIcon })
        .bindPopup(`
          <b>${portal.title}</b><br/>
          ${portal.description}<br/>
          <a href="${portal.url}" target="_blank" rel="noopener noreferrer">${portal.url}</a>
        `)
        .addTo(openDataLayerRef.current!);
    });

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


    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;