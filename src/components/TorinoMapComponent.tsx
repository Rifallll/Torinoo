"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { toast } from 'sonner';

// Fix for default marker icon issue with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Import custom hooks and utilities
import { useSettings } from '@/contexts/SettingsContext';
import { useGtfsRealtimeData } from '@/hooks/useGtfsRealtimeData';
import { getRouteTypeIcon, getVehicleStatus, getCongestionBadgeClass, formatCongestionLevel, formatRelativeTime } from '@/utils/gtfsRealtimeParser';
import { renderToString } from 'react-dom/server';
import { convertCoordinates } from '../utils/coordinateConverter';

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
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const subwayStationsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tomtomTrafficFlowLayerRef = useRef<L.TileLayer | null>(null);
  const publicTransportVehiclesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkersRef = useRef<{ [key: string]: L.Marker }>({}); // For public transport vehicles

  const { isTomTomLayerEnabled, isPublicTransportLayerEnabled } = useSettings();
  const { data: gtfsRealtimeData } = useGtfsRealtimeData();

  const torinoCenter: [number, number] = [45.0703, 7.6869];
  const defaultZoom = 13;
  const minZoomForGeoJSON = 15;
  const minZoomForSubwayStations = 12;
  const minZoomForPublicTransport = 12;
  const torinoBounds = L.latLngBounds([44.95, 7.50], [45.18, 7.85]);
  const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;

  // Helper function to get custom icon for features
  const getCustomIcon = useCallback((feature: L.GeoJSON.Feature) => {
    const properties = feature.properties;
    let iconColor = '#3b82f6'; // Default blue
    let iconText = '?';
    let iconSize = 24;
    let iconShape = 'circle'; // Default shape

    if (properties) {
      const vehicleType = properties.vehicle_type;
      const amenity = properties.amenity;
      const buildingType = properties.building_type;

      if (vehicleType) {
        switch (vehicleType.toLowerCase()) {
          case 'car':
            iconColor = '#3b82f6'; // Blue
            iconText = 'C';
            break;
          case 'motorcycle':
            iconColor = '#f97316'; // Orange
            iconText = 'M';
            break;
          case 'bus':
            iconColor = '#22c55e'; // Green
            iconText = 'B';
            break;
          case 'truck':
            iconColor = '#ef4444'; // Red
            iconText = 'T';
            break;
          case 'tram':
            iconColor = '#a855f7'; // Purple
            iconText = 'TR';
            iconSize = 30;
            iconShape = 'square';
            break;
          case 'subway':
            iconColor = '#6b7280'; // Gray
            iconText = 'S';
            iconSize = 30;
            iconShape = 'square';
            break;
          default:
            iconColor = '#3b82f6';
            iconText = '?';
        }
      } else if (amenity) {
        switch (amenity.toLowerCase()) {
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
          case 'building':
          case 'apartment':
            iconColor = '#6b7280'; // Gray
            iconText = 'B';
            iconShape = 'square';
            break;
          default:
            iconColor = '#3b82f6';
            iconText = 'L';
            iconSize = 20;
            iconShape = 'circle';
        }
      } else if (buildingType && buildingType.toLowerCase() === 'residential') {
        iconColor = '#800080'; // Purple
        iconText = 'R';
        iconShape = 'square';
      } else {
        iconColor = '#6b7280';
        iconText = 'P';
        iconSize = 20;
        iconShape = 'circle';
      }
    }

    const borderRadius = iconShape === 'circle' ? '50%' : '5px';

    return L.divIcon({
      className: 'custom-poi-marker',
      html: `<div style="background-color:${iconColor}; width:${iconSize}px; height:${iconSize}px; border-radius:${borderRadius}; display:flex; align-items:center; justify-content:center; color:white; font-size:${iconSize / 2}px; font-weight:bold; opacity:0.1;">${iconText}</div>`,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2]
    });
  }, []); // No dependencies, so memoized once

  // Subway Stations Static Data
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

  // --- Layer Visibility Callbacks ---
  const updateGeoJSONVisibility = useCallback(() => {
    const map = mapRef.current;
    if (!map || !geoJsonLayerGroupRef.current) return;

    if (map.getZoom() >= minZoomForGeoJSON) {
      if (!map.hasLayer(geoJsonLayerGroupRef.current)) {
        geoJsonLayerGroupRef.current.addTo(map);
        toast.info("Lapisan data lalu lintas ditampilkan (perbesar untuk detail).");
      }
    } else {
      if (map.hasLayer(geoJsonLayerGroupRef.current)) {
        map.removeLayer(geoJsonLayerGroupRef.current);
        toast.info("Lapisan data lalu lintas disembunyikan (perkecil untuk performa).");
      }
    }
  }, [minZoomForGeoJSON]);

  const updateSubwayStationsVisibility = useCallback(() => {
    const map = mapRef.current;
    if (!map || !subwayStationsLayerGroupRef.current) return;

    if (map.getZoom() >= minZoomForSubwayStations) {
      if (!map.hasLayer(subwayStationsLayerGroupRef.current)) {
        subwayStationsLayerGroupRef.current.addTo(map);
        toast.info("Lapisan halte kereta bawah tanah ditampilkan.");
      }
    } else {
      if (map.hasLayer(subwayStationsLayerGroupRef.current)) {
        map.removeLayer(subwayStationsLayerGroupRef.current);
        toast.info("Lapisan halte kereta bawah tanah disembunyikan (perkecil untuk performa).");
      }
    }
  }, [minZoomForSubwayStations]);

  const updateTomTomTrafficVisibility = useCallback(() => {
    const map = mapRef.current;
    if (!map || !tomtomTrafficFlowLayerRef.current) return;

    const currentMapBounds = map.getBounds();
    const isTomTomLayerActive = map.hasLayer(tomtomTrafficFlowLayerRef.current);
    const isWithinTorino = currentMapBounds.intersects(torinoBounds);

    if (isTomTomLayerEnabled && isWithinTorino) {
      if (!isTomTomLayerActive) {
        tomtomTrafficFlowLayerRef.current.addTo(map);
        toast.info("Lapisan lalu lintas TomTom diaktifkan untuk Torino.");
      }
    } else {
      if (isTomTomLayerActive) {
        map.removeLayer(tomtomTrafficFlowLayerRef.current);
        toast.info("Lapisan lalu lintas TomTom dinonaktifkan (di luar Torino atau dimatikan).");
      }
    }
  }, [isTomTomLayerEnabled, torinoBounds]);

  const updatePublicTransportVisibility = useCallback(() => {
    const map = mapRef.current;
    if (!map || !publicTransportVehiclesLayerGroupRef.current) return;

    const isPublicTransportLayerActive = map.hasLayer(publicTransportVehiclesLayerGroupRef.current);
    const isWithinTorino = map.getBounds().intersects(torinoBounds);

    if (isPublicTransportLayerEnabled && isWithinTorino && map.getZoom() >= minZoomForPublicTransport) {
      if (!isPublicTransportLayerActive) {
        publicTransportVehiclesLayerGroupRef.current.addTo(map);
        toast.info("Lapisan kendaraan transportasi publik diaktifkan.");
      }
    } else {
      if (isPublicTransportLayerActive) {
        map.removeLayer(publicTransportVehiclesLayerGroupRef.current);
        toast.info("Lapisan kendaraan transportasi publik dinonaktifkan.");
      }
    }
  }, [isPublicTransportLayerEnabled, minZoomForPublicTransport, torinoBounds]);

  // --- Main Map Initialization Effect ---
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('torino-map', { preferCanvas: true }).setView(torinoCenter, defaultZoom);
      mapRef.current = map;

      // Add OpenStreetMap tile layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      osmLayer.addTo(map);

      // Initialize Layer Groups and add to map
      geoJsonLayerGroupRef.current = L.layerGroup().addTo(map);
      subwayStationsLayerGroupRef.current = L.layerGroup().addTo(map);
      publicTransportVehiclesLayerGroupRef.current = L.layerGroup().addTo(map);

      // Add subway stations to their layer group
      subwayStationsData.forEach(station => {
        const { latitude, longitude } = convertCoordinates(station.x, station.y);
        if (latitude !== 0 || longitude !== 0) {
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'subway-station-marker',
              html: `<div style="background-color:#007bff; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold;">M</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          })
          .bindPopup(`<b>${station.name}</b><br/>Subway Station`)
          .addTo(subwayStationsLayerGroupRef.current!);
        }
      });

      // Initialize TomTom Traffic Layer
      if (tomtomApiKey && tomtomApiKey !== 'YOUR_TOMTOM_API_KEY_HERE') {
        tomtomTrafficFlowLayerRef.current = L.tileLayer(
          `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
          {
            attribution: '&copy; <a href="https://tomtom.com">TomTom</a>',
            maxZoom: 19,
            opacity: 1.0,
          }
        );
      } else {
        toast.warning("Kunci API TomTom tidak ditemukan atau belum diatur. Lapisan lalu lintas TomTom tidak akan tersedia.");
        console.warn("TomTom API Key is missing or is the placeholder. TomTom traffic layer will not be available.");
      }

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
        ]).addTo(map);
        map.fitBounds(poly.getBounds());
      })
      .addTo(map);

      // Add Fullscreen control
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
      new FullscreenControl({ position: 'topleft' }).addTo(map);

      // Add Reset view control
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
      new ResetViewControl({ position: 'topleft' }).addTo(map);

      // Base layers for the layer control
      const baseLayers = {
        "OpenStreetMap": osmLayer,
        "Dark Mode": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
        "Terrain": L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
      };
      
      // Overlay layers
      const overlayLayers: { [key: string]: L.Layer } = {
        "Traffic Data (GeoJSON)": geoJsonLayerGroupRef.current,
        "Subway Stations": subwayStationsLayerGroupRef.current,
        "Public Transport Vehicles": publicTransportVehiclesLayerGroupRef.current,
      };

      if (tomtomTrafficFlowLayerRef.current) {
        overlayLayers["TomTom Traffic Flow"] = tomtomTrafficFlowLayerRef.current;
      }

      L.control.layers(baseLayers, overlayLayers).addTo(map);

      // Initial visibility checks
      updateGeoJSONVisibility();
      updateSubwayStationsVisibility();
      updatePublicTransportVisibility();

      // Add event listeners for zoom and move changes
      map.on('zoomend', updateGeoJSONVisibility);
      map.on('zoomend', updateSubwayStationsVisibility);
      map.on('moveend', updateTomTomTrafficVisibility);
      map.on('zoomend', updateTomTomTrafficVisibility);
      map.on('zoomend', updatePublicTransportVisibility);
      map.on('moveend', updatePublicTransportVisibility);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [tomtomApiKey, updateGeoJSONVisibility, updateSubwayStationsVisibility, updateTomTomTrafficVisibility, updatePublicTransportVisibility]); // Dependencies for main map effect

  // --- Effects for individual layers (data fetching and rendering) ---

  // Effect for GeoJSON layer (data fetching and filtering)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoJsonLayerGroupRef.current) return;

    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/export.geojson');
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data = await response.json();

        geoJsonLayerGroupRef.current.clearLayers();

        const filteredFeatures = data.features.filter((feature: L.GeoJSON.Feature) => {
          const properties = feature.properties;
          const matchesVehicleType = selectedVehicleType === 'all' ||
                                     (properties?.vehicle_type && properties.vehicle_type.toLowerCase() === selectedVehicleType.toLowerCase());
          const matchesRoadCondition = roadConditionFilter === 'all' ||
                                       (properties?.traffic_level && properties.traffic_level.toLowerCase() === roadConditionFilter.toLowerCase());
          return matchesVehicleType && matchesRoadCondition;
        });

        const geoJsonLayer = L.geoJSON({ ...data, features: filteredFeatures }, {
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
            return L.marker(latlng, { icon: getCustomIcon(feature) });
          },
          style: (feature) => {
            const trafficLevel = feature?.properties?.traffic_level;
            let color = '#6b7280';
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

            if (roadConditionFilter !== 'all' && trafficLevel?.toLowerCase() !== roadConditionFilter.toLowerCase()) {
              return { opacity: 0 };
            }

            return {
              color: color,
              weight: weight,
              opacity: 0.1
            };
          }
        });
        geoJsonLayer.addTo(geoJsonLayerGroupRef.current);
        updateGeoJSONVisibility();
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        toast.error(`Gagal memuat data GeoJSON: ${error instanceof Error ? error.message : String(error)}. Pastikan file 'export.geojson' ada di folder 'public'.`);
      }
    };

    fetchGeoJSON();

    return () => {
      if (geoJsonLayerGroupRef.current) {
        geoJsonLayerGroupRef.current.clearLayers();
      }
    };
  }, [selectedVehicleType, roadConditionFilter, getCustomIcon, updateGeoJSONVisibility]); // Dependencies for GeoJSON effect

  // Effect for Public Transport Vehicles Layer (real-time data rendering)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !publicTransportVehiclesLayerGroupRef.current || !gtfsRealtimeData) return;

    const currentMarkers = vehicleMarkersRef.current;
    const newVehicleIds = new Set<string>();

    if (isPublicTransportLayerEnabled && map.getZoom() >= minZoomForPublicTransport) {
      gtfsRealtimeData.vehiclePositions.forEach(vp => {
        if (vp.position?.latitude && vp.position?.longitude) {
          newVehicleIds.add(vp.id);
          const latlng: L.LatLngExpression = [vp.position.latitude, vp.position.longitude];
          const routeId = vp.trip?.route_id || 'N/A';
          const vehicleLabel = vp.vehicle?.label || vp.id;
          const vehicleTypeIcon = getRouteTypeIcon(routeId, vp.trip?.route_id?.includes('BUS') ? 3 : (routeId.includes('TRAM') ? 0 : undefined));

          const vehicleIconHtml = renderToString(
            <div className="flex items-center justify-center p-1 rounded-full bg-indigo-600 text-white shadow-md" style={{ width: '30px', height: '30px' }}>
              {vehicleTypeIcon}
            </div>
          );

          const vehicleIcon = L.divIcon({
            className: 'custom-vehicle-marker',
            html: vehicleIconHtml,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });

          const popupContent = `
            <div class="font-sans text-sm">
              <h3 class="font-bold text-base mb-1 flex items-center">
                ${renderToString(vehicleTypeIcon)} Jalur ${routeId}
              </h3>
              <p><strong>Kendaraan:</strong> ${vehicleLabel}</p>
              <p><strong>Status:</strong> ${getVehicleStatus(vp.current_status, vp.occupancy_status)}</p>
              <p><strong>Kecepatan:</strong> ${vp.position?.speed ? `${vp.position.speed.toFixed(1)} km/h` : 'N/A'}</p>
              <p><strong>Kemacetan:</strong> <span class="${getCongestionBadgeClass(vp.congestion_level).replace('hover:bg-gray-100', '')} px-2 py-0.5 rounded-full text-xs">${formatCongestionLevel(vp.congestion_level)}</span></p>
              <p><strong>Terakhir Diperbarui:</strong> ${formatRelativeTime(vp.timestamp)}</p>
            </div>
          `;

          if (currentMarkers[vp.id]) {
            currentMarkers[vp.id].setLatLng(latlng);
            currentMarkers[vp.id].setPopupContent(popupContent);
          } else {
            const marker = L.marker(latlng, { icon: vehicleIcon })
              .bindPopup(popupContent);
            marker.addTo(publicTransportVehiclesLayerGroupRef.current);
            currentMarkers[vp.id] = marker;
          }
        }
      });

      for (const id in currentMarkers) {
        if (!newVehicleIds.has(id)) {
          publicTransportVehiclesLayerGroupRef.current.removeLayer(currentMarkers[id]);
          delete currentMarkers[id];
        }
      }

      if (!map.hasLayer(publicTransportVehiclesLayerGroupRef.current)) {
        publicTransportVehiclesLayerGroupRef.current.addTo(map);
      }
    } else {
      if (map && publicTransportVehiclesLayerGroupRef.current) {
        for (const id in currentMarkers) {
          publicTransportVehiclesLayerGroupRef.current.removeLayer(currentMarkers[id]);
          delete currentMarkers[id];
        }
        if (map.hasLayer(publicTransportVehiclesLayerGroupRef.current)) {
          map.removeLayer(publicTransportVehiclesLayerGroupRef.current);
        }
      }
    }
  }, [isPublicTransportLayerEnabled, minZoomForPublicTransport, gtfsRealtimeData, torinoBounds, getVehicleStatus, getCongestionBadgeClass, formatCongestionLevel, formatRelativeTime, getRouteTypeIcon]); // Added all necessary dependencies

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;