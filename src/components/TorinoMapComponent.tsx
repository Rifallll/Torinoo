"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { toast } from 'sonner'; // Import toast for user feedback
import { convertCoordinates } from '../utils/coordinateConverter'; // Import the coordinate converter
import { useSettings } from '@/contexts/SettingsContext'; // Import useSettings
import { Car, Bus, TramFront, Bike, Truck, TrainFront, Info } from 'lucide-react'; // Import icons

// Fix for default marker icon issue with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface TorinoMapComponentProps {
  selectedVehicleType: string;
}

const TorinoMapComponent: React.FC<TorinoMapComponentProps> = ({ selectedVehicleType }) => {
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null); // Ref for GeoJSON data itself
  const geoJsonLayerGroupRef = useRef<L.LayerGroup | null>(null); // Ref for the layer group to manage visibility
  const subwayStationsLayerGroupRef = useRef<L.LayerGroup | null>(null); // Ref for subway stations layer group
  const tomtomTrafficFlowLayerRef = useRef<L.TileLayer | null>(null); // Ref for TomTom layer

  const { isTomTomLayerEnabled } = useSettings(); // Use the setting

  const torinoCenter: [number, number] = [45.0703, 7.6869];
  const defaultZoom = 13;
  const minZoomForGeoJSON = 15; // Increased from 14 to 15 to reduce clutter at lower zoom levels
  const minZoomForSubwayStations = 12; // Changed: Minimum zoom level for subway stations to appear (was 14)

  // Define approximate bounding box for Torino (South-West, North-East)
  const torinoBounds = L.latLngBounds([44.95, 7.50], [45.18, 7.85]);

  // Dummy data for subway stations (using original EPSG:3003 coordinates)
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

  // Function to manage TomTom Traffic Flow layer visibility based on map bounds AND toggle state
  const updateTomTomTrafficVisibility = () => {
    if (!mapRef.current || !tomtomTrafficFlowLayerRef.current) return;

    const currentMapBounds = mapRef.current.getBounds();
    const isTomTomLayerActive = mapRef.current.hasLayer(tomtomTrafficFlowLayerRef.current);
    const isWithinTorino = currentMapBounds.intersects(torinoBounds);

    if (isTomTomLayerEnabled && isWithinTorino) {
      if (!isTomTomLayerActive) {
        tomtomTrafficFlowLayerRef.current.addTo(mapRef.current);
        toast.info("Lapisan lalu lintas TomTom diaktifkan untuk Torino.");
      }
    } else {
      if (isTomTomLayerActive) {
        mapRef.current.removeLayer(tomtomTrafficFlowLayerRef.current);
        toast.info("Lapisan lalu lintas TomTom dinonaktifkan (di luar Torino atau dimatikan).");
      }
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map with preferCanvas: true for better performance with complex vector data
      mapRef.current = L.map('torino-map', { preferCanvas: true }).setView(torinoCenter, defaultZoom);

      // Add OpenStreetMap tile layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      osmLayer.addTo(mapRef.current);

      // Initialize Layer Groups
      geoJsonLayerGroupRef.current = L.layerGroup();
      subwayStationsLayerGroupRef.current = L.layerGroup();

      // Get TomTom API Key from environment variables
      const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;
      
      if (tomtomApiKey) {
        tomtomTrafficFlowLayerRef.current = L.tileLayer(
          `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
          {
            attribution: '&copy; <a href="https://tomtom.com">TomTom</a>',
            maxZoom: 19,
            opacity: 0.7, // Make it slightly transparent to see base map
          }
        );
      } else {
        toast.warning("Kunci API TomTom tidak ditemukan. Lapisan lalu lintas TomTom tidak akan tersedia.");
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
      const overlayLayers: { [key: string]: L.Layer } = {
        "Traffic Data (GeoJSON)": geoJsonLayerGroupRef.current,
        "Subway Stations": subwayStationsLayerGroupRef.current,
      };

      // Only add TomTom layer to control if it was successfully initialized
      if (tomtomTrafficFlowLayerRef.current) {
        overlayLayers["TomTom Traffic Flow"] = tomtomTrafficFlowLayerRef.current;
      }

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

      // Add event listeners for zoom and move changes
      mapRef.current.on('zoomend', updateGeoJSONVisibility);
      mapRef.current.on('zoomend', updateSubwayStationsVisibility);
      mapRef.current.on('moveend', updateTomTomTrafficVisibility);
      mapRef.current.on('zoomend', updateTomTomTrafficVisibility);

      // Initial check for visibility
      updateGeoJSONVisibility();
      updateSubwayStationsVisibility();
    }

    // Fetch and add GeoJSON data
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/export.geojson'); // Path to the GeoJSON file in the public folder
        const data = await response.json();

        // --- Simulate adding vehicle_type to some points for demonstration ---
        const simulatedData = {
          ...data,
          features: data.features.map((feature: any) => {
            if (feature.geometry.type === 'Point') {
              const random = Math.random();
              if (random < 0.2) {
                feature.properties = { ...feature.properties, vehicle_type: 'car' };
              } else if (random < 0.4) {
                feature.properties = { ...feature.properties, vehicle_type: 'bus' };
              } else if (random < 0.6) {
                feature.properties = { ...feature.properties, vehicle_type: 'tram' };
              } else if (random < 0.7) {
                feature.properties = { ...feature.properties, vehicle_type: 'motorcycle' };
              } else if (random < 0.8) {
                feature.properties = { ...feature.properties, vehicle_type: 'truck' };
              } else if (random < 0.9) {
                feature.properties = { ...feature.properties, vehicle_type: 'subway' }; // Subway points might be less common
              }
            }
            return feature;
          }),
        };
        // --- End simulation ---

        if (mapRef.current && geoJsonLayerGroupRef.current) {
          // Clear existing GeoJSON layer from the group
          geoJsonLayerGroupRef.current.clearLayers();

          geoJsonLayerRef.current = L.geoJSON(simulatedData, {
            filter: (feature) => {
              if (selectedVehicleType === 'all') return true;
              return feature.properties && feature.properties.vehicle_type === selectedVehicleType;
            },
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
              const vehicleType = feature.properties?.vehicle_type;
              const amenity = feature.properties?.amenity;
              let IconComponent: React.ElementType = Info; // Default icon
              let iconColor = '#3b82f6'; // Default blue
              let iconSize = 24;

              switch (vehicleType) {
                case 'car':
                  IconComponent = Car;
                  iconColor = '#3b82f6'; // Blue
                  break;
                case 'bus':
                  IconComponent = Bus;
                  iconColor = '#22c55e'; // Green
                  break;
                case 'motorcycle':
                  IconComponent = Bike;
                  iconColor = '#f97316'; // Orange
                  break;
                case 'truck':
                  IconComponent = Truck;
                  iconColor = '#6b7280'; // Gray
                  break;
                case 'tram':
                  IconComponent = TramFront;
                  iconColor = '#a855f7'; // Purple
                  break;
                case 'subway':
                  IconComponent = TrainFront; // Using TrainFront for subway
                  iconColor = '#ef4444'; // Red
                  break;
                default:
                  // Fallback to amenity icons if no vehicle_type
                  if (amenity) {
                    switch (amenity) {
                      case 'hospital': IconComponent = Info; iconColor = '#ef4444'; break; // Red
                      case 'school': IconComponent = Info; iconColor = '#22c55e'; break; // Green
                      case 'park': IconComponent = Info; iconColor = '#10b981'; break; // Teal
                      case 'building': IconComponent = Info; iconColor = '#6b7280'; break; // Gray
                      case 'restaurant': IconComponent = Info; iconColor = '#f97316'; break; // Orange
                      case 'cafe': IconComponent = Info; iconColor = '#a855f7'; break; // Purple
                      case 'shop': IconComponent = Info; iconColor = '#ec4899'; break; // Pink
                      default: IconComponent = Info; iconColor = '#3b82f6'; // Default blue
                    }
                  }
              }

              // Create a div icon with the Lucide React component rendered inside
              const iconHtml = L.Util.create('div');
              const root = ReactDOM.createRoot(iconHtml);
              root.render(<IconComponent className="h-full w-full" style={{ color: iconColor }} />);

              return L.marker(latlng, {
                icon: L.divIcon({
                  className: 'custom-vehicle-marker',
                  html: `<div style="background-color:white; border: 2px solid ${iconColor}; width:${iconSize}px; height:${iconSize}px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">${iconHtml.innerHTML}</div>`,
                  iconSize: [iconSize, iconSize],
                  iconAnchor: [iconSize / 2, iconSize / 2]
                })
              });
            },
            style: (feature) => {
              // Custom style for lines/polygons based on properties
              const trafficLevel = feature?.properties?.traffic_level;
              let color = '#6b7280'; // Changed default to a darker gray
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
                opacity: 0.4 // Mengurangi opasitas menjadi 0.4 untuk membuatnya lebih transparan
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
        mapRef.current.off('zoomend', updateSubwayStationsVisibility);
        mapRef.current.off('moveend', updateTomTomTrafficVisibility);
        mapRef.current.off('zoomend', updateTomTomTrafficVisibility);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedVehicleType]); // Empty dependency array means this effect runs once on mount

  // This useEffect specifically handles the TomTom layer based on `isTomTomLayerEnabled`
  useEffect(() => {
    updateTomTomTrafficVisibility();
  }, [isTomTomLayerEnabled]); // Re-run when the toggle state changes

  return <div id="torino-map" className="h-full w-full rounded-md relative z-10"></div>;
};

export default TorinoMapComponent;