"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder'; // Ensure geocoder is imported
import { toast } from 'sonner';

interface MapControlsProps {
  map: L.Map | null;
  layerGroups: {
    geoJsonLayerGroup: L.LayerGroup;
    subwayStationsLayerGroup: L.LayerGroup;
    gtfsRoutesLayerGroup: L.LayerGroup;
  } | null;
  tomtomTrafficFlowLayer: L.TileLayer | null;
  torinoCenter: L.LatLngExpression;
  defaultZoom: number;
}

export const useMapControls = ({ map, layerGroups, tomtomTrafficFlowLayer, torinoCenter, defaultZoom }: MapControlsProps) => {
  // Use refs to store control instances for proper cleanup
  const geocoderRef = useRef<L.Control.Geocoder | null>(null);
  const fullscreenControlRef = useRef<L.Control | null>(null);
  const layerControlRef = useRef<L.Control.Layers | null>(null);
  const resetViewControlRef = useRef<L.Control | null>(null);

  useEffect(() => {
    if (!map || !layerGroups) return;

    // Ensure map is fully loaded before attempting to add controls
    // @ts-ignore - _loaded is an internal Leaflet property
    if (!map._loaded) {
      // If map is not yet loaded, return. This effect will re-run when map._loaded becomes true.
      return;
    }

    // If controls are already added, do nothing.
    if (geocoderRef.current) {
      return;
    }

    // Add Geocoder control
    const geocoder = L.Control.geocoder({
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
    geocoderRef.current = geocoder;

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
    const fullscreenControl = new FullscreenControl({ position: 'topleft' }).addTo(map);
    fullscreenControlRef.current = fullscreenControl;

    // Add Layer control
    const baseLayers = {
      "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
      "Dark Mode": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
      "Terrain": L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }),
    };
    const overlayLayers: { [key: string]: L.Layer } = {
      "Traffic Data (GeoJSON)": layerGroups.geoJsonLayerGroup,
      "Subway Stations": layerGroups.subwayStationsLayerGroup,
      "GTFS Public Routes": layerGroups.gtfsRoutesLayerGroup,
    };

    if (tomtomTrafficFlowLayer) {
      overlayLayers["TomTom Traffic Flow"] = tomtomTrafficFlowLayer;
    }

    const layerControl = L.control.layers(baseLayers, overlayLayers).addTo(map);
    layerControlRef.current = layerControl;

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
    const resetViewControl = new ResetViewControl({ position: 'topleft' }).addTo(map);
    resetViewControlRef.current = resetViewControl;

    // Cleanup function for the useEffect
    return () => {
      if (map) {
        if (geocoderRef.current) map.removeControl(geocoderRef.current);
        if (fullscreenControlRef.current) map.removeControl(fullscreenControlRef.current);
        if (layerControlRef.current) map.removeControl(layerControlRef.current);
        if (resetViewControlRef.current) map.removeControl(resetViewControlRef.current);
      }
      geocoderRef.current = null;
      fullscreenControlRef.current = null;
      layerControlRef.current = null;
      resetViewControlRef.current = null;
    };
  }, [map, layerGroups, tomtomTrafficFlowLayer, torinoCenter, defaultZoom]);
};