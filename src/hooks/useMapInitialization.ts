"use client";

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { toast } from 'sonner';

interface MapInitializationProps {
  mapContainerId: string;
  center: [number, number];
  zoom: number;
  torinoBounds: L.LatLngBoundsExpression;
  overlayLayers: { [key: string]: L.Layer };
}

export const useMapInitialization = ({ mapContainerId, center, zoom, torinoBounds, overlayLayers }: MapInitializationProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map(mapContainerId, { preferCanvas: true }).setView(center, zoom);
      mapRef.current = map;
      setMapInstance(map);

      // Add OpenStreetMap tile layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      osmLayer.addTo(map);

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
      new FullscreenControl({ position: 'topleft' }).addTo(map);

      // Reset view control
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
      
      // Add Layer control
      L.control.layers(baseLayers, overlayLayers).addTo(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapInstance(null);
      }
    };
  }, [mapContainerId, center, zoom, torinoBounds, overlayLayers]);

  return mapInstance;
};