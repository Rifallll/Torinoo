"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { toast } from 'sonner';
import { convertCoordinates } from '@/utils/coordinateConverter';

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
  bounds: L.LatLngBoundsExpression;
  tomtomApiKey: string;
  subwayStationsData: { name: string; x: number; y: number }[];
}

export const useMapInitialization = ({
  mapContainerId,
  center,
  zoom,
  bounds,
  tomtomApiKey,
  subwayStationsData,
}: MapInitializationProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const subwayStationsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tomtomTrafficFlowLayerRef = useRef<L.TileLayer | null>(null);
  const publicTransportVehiclesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapRef.current) return; // Map already initialized

    const map = L.map(mapContainerId, { preferCanvas: true }).setView(center, zoom);
    mapRef.current = map;

    // Log map panes to check for markerPane
    console.log("Leaflet Map Panes:", map.getPanes());

    // Add OpenStreetMap tile layer
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });
    osmLayer.addTo(map);

    // Initialize Layer Groups
    geoJsonLayerGroupRef.current = L.layerGroup().addTo(map);
    subwayStationsLayerGroupRef.current = L.layerGroup().addTo(map); // Initialize empty layer group
    publicTransportVehiclesLayerGroupRef.current = L.layerGroup().addTo(map);

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
          map.setView(center, zoom);
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
    
    // Overlay layers (initially empty, filled by other hooks)
    const overlayLayers: { [key: string]: L.Layer } = {
      "Subway Stations": subwayStationsLayerGroupRef.current!, // Add Subway Stations layer
      "Public Transport Vehicles": publicTransportVehiclesLayerGroupRef.current!, // Add Public Transport Vehicles layer
    };

    // Add TomTom layer to control if it was successfully initialized
    if (tomtomTrafficFlowLayerRef.current) {
      overlayLayers["TomTom Traffic Flow"] = tomtomTrafficFlowLayerRef.current;
    }

    L.control.layers(baseLayers, overlayLayers).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapContainerId, center, zoom, bounds, tomtomApiKey, subwayStationsData]);

  return {
    map: mapRef.current,
    geoJsonLayerGroup: geoJsonLayerGroupRef.current,
    subwayStationsLayerGroup: subwayStationsLayerGroupRef.current,
    tomtomTrafficFlowLayer: tomtomTrafficFlowLayerRef.current,
    publicTransportVehiclesLayerGroup: publicTransportVehiclesLayerGroupRef.current,
  };
};