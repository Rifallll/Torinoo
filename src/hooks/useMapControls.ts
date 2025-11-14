"use client";

import { useEffect } from 'react';
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
  useEffect(() => {
    if (!map || !layerGroups) return;

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
    const fullscreenControl = new FullscreenControl({ position: 'topleft' }).addTo(map);

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

    return () => {
      // Cleanup controls when component unmounts or map changes
      map.removeControl(geocoder);
      map.removeControl(fullscreenControl);
      map.removeControl(layerControl);
      map.removeControl(resetViewControl);
    };
  }, [map, layerGroups, tomtomTrafficFlowLayer, torinoCenter, defaultZoom]);
};