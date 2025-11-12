"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

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
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null); // Ref for GeoJSON layer

  const torinoCenter: [number, number] = [45.0703, 7.6869];
  const defaultZoom = 13;

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
      L.control.layers(baseLayers).addTo(mapRef.current);

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
    }

    // Fetch and add GeoJSON data
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/export.geojson'); // Path to the GeoJSON file in the public folder
        const data = await response.json();

        if (mapRef.current) {
          // Clear existing GeoJSON layer if any
          if (geoJsonLayerRef.current) {
            mapRef.current.removeLayer(geoJsonLayerRef.current);
          }

          geoJsonLayerRef.current = L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
              // Bind popup with all properties
              if (feature.properties) {
                let popupContent = "<table>";
                for (const key in feature.properties) {
                  popupContent += `<tr><td><b>${key}:</b></td><td>${feature.properties[key]}</td></tr>`;
                }
                popupContent += "</table>";
                layer.bindPopup(popupContent);
              }
            },
            pointToLayer: (feature, latlng) => {
              // Custom marker for points (e.g., if GeoJSON contains points)
              return L.marker(latlng);
            },
            style: (feature) => {
              // Custom style for lines/polygons based on properties
              // Example: color based on a 'traffic_level' property
              const trafficLevel = feature?.properties?.traffic_level;
              let color = '#3388ff'; // Default blue

              if (trafficLevel === 'high') {
                color = 'red';
              } else if (trafficLevel === 'moderate') {
                color = 'orange';
              } else if (trafficLevel === 'low') {
                color = 'green';
              }

              return {
                color: color,
                weight: 3,
                opacity: 0.7
              };
            }
          }).addTo(mapRef.current);

          // Optionally, fit map bounds to the GeoJSON layer
          if (geoJsonLayerRef.current.getBounds().isValid()) {
            mapRef.current.fitBounds(geoJsonLayerRef.current.getBounds());
          }
        }
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    };

    fetchGeoJSON();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;