"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { toast } from 'sonner'; // Import toast for user feedback

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
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null); // Ref for GeoJSON data itself
  const geoJsonLayerGroupRef = useRef<L.LayerGroup | null>(null); // Ref for the layer group to manage visibility

  const torinoCenter: [number, number] = [45.0703, 7.6869];
  const defaultZoom = 13;
  const minZoomForGeoJSON = 14; // Minimum zoom level to display the GeoJSON layer

  useEffect(() => {
    // Function to update GeoJSON layer visibility based on zoom
    // Defined here so it's accessible throughout the effect, including cleanup
    const updateGeoJSONVisibility = () => {
      if (!mapRef.current || !geoJsonLayerGroupRef.current) return;

      if (mapRef.current.getZoom() >= minZoomForGeoJSON) {
        if (!mapRef.current.hasLayer(geoJsonLayerGroupRef.current)) {
          geoJsonLayerGroupRef.current.addTo(mapRef.current);
          toast.info("Lapisan data lalu lintas ditampilkan (perbesar untuk detail).");
        }
      } else {
        if (mapRef.current.hasLayer(geoJsonLayerGroupRef.current)) {
          mapRef.current.removeLayer(geoJsonLayerGroupRef.current);
          toast.info("Lapisan data lalu lintas disembunyikan (perkecil untuk performa).");
        }
      }
    };

    if (!mapRef.current) {
      // Initialize map with preferCanvas: true for better performance with complex vector data
      mapRef.current = L.map('torino-map', { preferCanvas: true }).setView(torinoCenter, defaultZoom);

      // Add OpenStreetMap tile layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      osmLayer.addTo(mapRef.current);

      // Initialize GeoJSON Layer Group
      geoJsonLayerGroupRef.current = L.layerGroup();

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

      // Add Layer control
      const baseLayers = {
        "OpenStreetMap": osmLayer,
        "Dark Mode": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
        "Terrain": L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
      };
      const overlayLayers = {
        "Traffic Data (GeoJSON)": geoJsonLayerGroupRef.current // Add the layer group here
      };
      L.control.layers(baseLayers, overlayLayers).addTo(mapRef.current);

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

      // Add event listener for zoom changes
      mapRef.current.on('zoomend', updateGeoJSONVisibility);

      // Initial check for visibility
      updateGeoJSONVisibility();
    }

    // Fetch and add GeoJSON data
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/export.geojson'); // Path to the GeoJSON file in the public folder
        const data = await response.json();

        if (mapRef.current && geoJsonLayerGroupRef.current) {
          // Clear existing GeoJSON layer from the group
          geoJsonLayerGroupRef.current.clearLayers();

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
              // Custom marker for points based on 'amenity' property
              if (feature.properties && feature.properties.amenity) {
                const amenity = feature.properties.amenity;
                let iconColor = '#3b82f6'; // Default blue
                let iconText = '';
                let iconSize = 24;

                switch (amenity) {
                  case 'hospital':
                    iconColor = '#ef4444'; // Red
                    iconText = '+';
                    break;
                  case 'school':
                    iconColor = '#22c55e'; // Green
                    iconText = 'S';
                    break;
                  case 'park':
                    iconColor = '#10b981'; // Teal
                    iconText = 'P';
                    break;
                  case 'building': // Generic building
                    iconColor = '#6b7280'; // Gray
                    iconText = 'B';
                    break;
                  case 'restaurant':
                    iconColor = '#f97316'; // Orange
                    iconText = 'R';
                    break;
                  case 'cafe':
                    iconColor = '#a855f7'; // Purple
                    iconText = 'C';
                    break;
                  case 'shop':
                    iconColor = '#ec4899'; // Pink
                    iconText = 'S';
                    break;
                  // Add more cases as needed for other amenities
                  default:
                    iconColor = '#3b82f6'; // Default blue
                    iconText = '?';
                }

                return L.marker(latlng, {
                  icon: L.divIcon({
                    className: 'custom-poi-marker',
                    html: `<div style="background-color:${iconColor}; width:${iconSize}px; height:${iconSize}px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:${iconSize/2}px; font-weight:bold;">${iconText}</div>`,
                    iconSize: [iconSize, iconSize],
                    iconAnchor: [iconSize / 2, iconSize / 2]
                  })
                });
              }
              // For other point features without amenity, use a default Leaflet marker
              return L.marker(latlng);
            },
            style: (feature) => {
              // Custom style for lines/polygons based on properties
              const trafficLevel = feature?.properties?.traffic_level;
              let color = '#3388ff'; // Default blue
              let weight = 3;

              if (trafficLevel === 'high') {
                color = 'red';
                weight = 4;
              } else if (trafficLevel === 'moderate') {
                color = 'orange';
                weight = 3;
              } else if (trafficLevel === 'low') {
                color = 'green';
                weight = 2;
              }

              return {
                color: color,
                weight: weight,
                opacity: 0.7
              };
            }
          });
          geoJsonLayerRef.current.addTo(geoJsonLayerGroupRef.current); // Add to the layer group

          // Update visibility after loading new data
          if (mapRef.current.getZoom() >= minZoomForGeoJSON) {
            if (!mapRef.current.hasLayer(geoJsonLayerGroupRef.current)) {
              mapRef.current.addLayer(geoJsonLayerGroupRef.current);
            }
          }

          // Optionally, fit map bounds to the GeoJSON layer if it's valid
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
        mapRef.current.off('zoomend', updateGeoJSONVisibility);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;