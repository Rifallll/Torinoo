"use client";

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { toast } from 'sonner';
import Papa from 'papaparse'; // Import PapaParse for CSV parsing
import { convertCoordinates } from '../utils/coordinateConverter';

// Fix for default marker icon issue with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface SubwayStation {
  name: string;
  x: number;
  y: number;
}

const TorinoMapComponent: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const geoJsonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const subwayStationsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [subwayStations, setSubwayStations] = useState<SubwayStation[]>([]); // State to hold parsed subway station data

  const torinoCenter: [number, number] = [45.0703, 7.6869];
  const defaultZoom = 13;
  const minZoomForGeoJSON = 15;
  const minZoomForSubwayStations = 12;

  // Effect to fetch and parse subway station CSV
  useEffect(() => {
    const fetchSubwayStations = async () => {
      try {
        const response = await fetch('/fermate_linee_metro.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch subway stations CSV: ${response.statusText}`);
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true, // Automatically convert numbers
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("CSV parsing errors for subway stations:", results.errors);
              toast.error(`Gagal mengurai CSV stasiun kereta bawah tanah: ${results.errors[0].message}`);
              return;
            }
            const parsedStations = results.data.map((row: any) => ({
              name: row.name || 'Unknown Station',
              x: row.x,
              y: row.y,
            })).filter(station => typeof station.x === 'number' && typeof station.y === 'number'); // Filter out invalid entries
            setSubwayStations(parsedStations);
            toast.success(`Berhasil memuat ${parsedStations.length} stasiun kereta bawah tanah.`);
          },
          error: (error: Error) => {
            console.error("Error parsing subway stations CSV:", error);
            toast.error(`Terjadi kesalahan saat mengurai file stasiun kereta bawah tanah: ${error.message}`);
          }
        });
      } catch (error: any) {
        console.error("Error fetching subway stations CSV:", error);
        toast.error(`Gagal memuat data stasiun kereta bawah tanah: ${error.message}`);
      }
    };

    fetchSubwayStations();
  }, []); // Run once on mount

  useEffect(() => {
    // Function to update GeoJSON layer visibility based on zoom
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

    // Function to update Subway Stations layer visibility based on zoom
    const updateSubwayStationsVisibility = () => {
      if (!mapRef.current || !subwayStationsLayerGroupRef.current) return;

      if (mapRef.current.getZoom() >= minZoomForSubwayStations) {
        if (!mapRef.current.hasLayer(subwayStationsLayerGroupRef.current)) {
          subwayStationsLayerGroupRef.current.addTo(mapRef.current);
          toast.info("Lapisan halte kereta bawah tanah ditampilkan.");
        }
      } else {
        if (mapRef.current.hasLayer(subwayStationsLayerGroupRef.current)) {
          mapRef.current.removeLayer(subwayStationsLayerGroupRef.current);
          toast.info("Lapisan halte kereta bawah tanah disembunyikan (perkecil untuk performa).");
        }
      }
    };


    if (!mapRef.current) {
      mapRef.current = L.map('torino-map', { preferCanvas: true }).setView(torinoCenter, defaultZoom);

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      osmLayer.addTo(mapRef.current);

      geoJsonLayerGroupRef.current = L.layerGroup();
      subwayStationsLayerGroupRef.current = L.layerGroup();

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

      const baseLayers = {
        "OpenStreetMap": osmLayer,
        "Dark Mode": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
        "Terrain": L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
      };
      const overlayLayers = {
        "Traffic Data (GeoJSON)": geoJsonLayerGroupRef.current,
        "Subway Stations": subwayStationsLayerGroupRef.current
      };
      L.control.layers(baseLayers, overlayLayers).addTo(mapRef.current);

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

      mapRef.current.on('zoomend', updateGeoJSONVisibility);
      mapRef.current.on('zoomend', updateSubwayStationsVisibility);

      updateGeoJSONVisibility();
      updateSubwayStationsVisibility();
    }

    // Add subway stations to the map whenever `subwayStations` state changes
    if (mapRef.current && subwayStationsLayerGroupRef.current) {
      subwayStationsLayerGroupRef.current.clearLayers(); // Clear existing markers

      const subwayIcon = L.divIcon({
        className: 'custom-subway-icon',
        html: '<div style="background-color:#DC143C; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:16px; font-weight:bold;">M</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      subwayStations.forEach(station => {
        const { latitude, longitude } = convertCoordinates(station.x, station.y);
        if (latitude !== 0 || longitude !== 0) {
          L.marker([latitude, longitude], { icon: subwayIcon })
            .bindPopup(`<b>${station.name}</b><br>Subway Station`)
            .addTo(subwayStationsLayerGroupRef.current!);
        }
      });

      // Ensure visibility is updated after adding new markers
      updateSubwayStationsVisibility();
    }

    // Fetch and add GeoJSON data
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/export.geojson');
        const data = await response.json();

        if (mapRef.current && geoJsonLayerGroupRef.current) {
          geoJsonLayerGroupRef.current.clearLayers();

          geoJsonLayerRef.current = L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
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
              if (feature.properties && feature.properties.amenity) {
                const amenity = feature.properties.amenity;
                let iconColor = '#3b82f6';
                let iconText = '';
                let iconSize = 24;

                switch (amenity) {
                  case 'hospital':
                    iconColor = '#ef4444';
                    iconText = '+';
                    break;
                  case 'school':
                    iconColor = '#22c55e';
                    iconText = 'S';
                    break;
                  case 'park':
                    iconColor = '#10b981';
                    iconText = 'P';
                    break;
                  case 'building':
                    iconColor = '#6b7280';
                    iconText = 'B';
                    break;
                  case 'restaurant':
                    iconColor = '#f97316';
                    iconText = 'R';
                    break;
                  case 'cafe':
                    iconColor = '#a855f7';
                    iconText = 'C';
                    break;
                  case 'shop':
                    iconColor = '#ec4899';
                    iconText = 'S';
                    break;
                  default:
                    iconColor = '#3b82f6';
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
              return L.marker(latlng);
            },
            style: (feature) => {
              const trafficLevel = feature?.properties?.traffic_level;
              let color = '#e0e0e0';
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
                opacity: 0.1
              };
            }
          });
          geoJsonLayerRef.current.addTo(geoJsonLayerGroupRef.current);

          if (mapRef.current.getZoom() >= minZoomForGeoJSON) {
            if (!mapRef.current.hasLayer(geoJsonLayerGroupRef.current)) {
              mapRef.current.addLayer(geoJsonLayerGroupRef.current);
            }
          }

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
        mapRef.current.off('zoomend', updateSubwayStationsVisibility);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [subwayStations]); // Re-run this effect when subwayStations data changes

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;