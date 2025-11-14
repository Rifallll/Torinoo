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
  tomtomTrafficFlowLayer: L.TileLayer | null; // Now receives the layer instance
  isTomTomLayerEnabled: boolean; // New prop for TomTom layer state
  torinoBounds: L.LatLngBoundsExpression; // New prop for TomTom layer bounds
  torinoCenter: L.LatLngExpression;
  defaultZoom: number;
}

export const useMapControls = ({
  map,
  layerGroups,
  tomtomTrafficFlowLayer,
  isTomTomLayerEnabled,
  torinoBounds,
  torinoCenter,
  defaultZoom
}: MapControlsProps) => {
  // Use refs to store control instances for proper cleanup
  const geocoderRef = useRef<L.Control.Geocoder | null>(null);
  const fullscreenControlRef = useRef<L.Control | null>(null);
  const layerControlRef = useRef<L.Control.Layers | null>(null);
  const resetViewControlRef = useRef<L.Control | null>(null);
  const controlsAddedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!map || !layerGroups) {
      controlsAddedRef.current = false;
      return;
    }

    if (controlsAddedRef.current) {
      return;
    }

    const addControls = () => {
      // @ts-ignore - _controlCorners is an internal Leaflet property
      if (!map._controlCorners) {
        console.warn("Leaflet map._controlCorners is not defined, delaying control addition.");
        return;
      }

      if (geocoderRef.current && map.hasControl(geocoderRef.current)) {
        controlsAddedRef.current = true;
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

      const layerControl = L.control.layers(baseLayers, overlayLayers).addTo(map);
      layerControlRef.current = layerControl;

      // Add TomTom layer to map and control if it exists
      if (tomtomTrafficFlowLayer instanceof L.TileLayer) {
        // Ensure TomTom layer is added to map here, if it's not already
        if (!map.hasLayer(tomtomTrafficFlowLayer)) {
          tomtomTrafficFlowLayer.addTo(map);
        }
        layerControl.addOverlay(tomtomTrafficFlowLayer, "TomTom Traffic Flow");
      }

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

      controlsAddedRef.current = true;
    };

    map.whenReady(addControls);

    // Cleanup function for the useEffect
    return () => {
      if (map) {
        if (geocoderRef.current) map.removeControl(geocoderRef.current);
        if (fullscreenControlRef.current) map.removeControl(fullscreenControlRef.current);
        if (layerControlRef.current) map.removeControl(layerControlRef.current);
        if (resetViewControlRef.current) map.removeControl(resetViewControlRef.current);
        // Ensure TomTom layer is removed from map on cleanup if it was added
        if (tomtomTrafficFlowLayer && map.hasLayer(tomtomTrafficFlowLayer)) {
          map.removeLayer(tomtomTrafficFlowLayer);
        }
      }
      geocoderRef.current = null;
      fullscreenControlRef.current = null;
      layerControlRef.current = null;
      resetViewControlRef.current = null;
      controlsAddedRef.current = false;
    };
  }, [map, layerGroups, tomtomTrafficFlowLayer, torinoCenter, defaultZoom]);

  // Effect to manage TomTom Traffic Flow layer visibility (opacity)
  useEffect(() => {
    if (!map || !tomtomTrafficFlowLayer) {
      return;
    }

    const updateTomTomTrafficVisibility = () => {
      // @ts-ignore - _loaded is an internal Leaflet property, but useful here
      if (!map || !tomtomTrafficFlowLayer || !map._loaded) {
        return;
      }

      const currentMapBounds = map.getBounds();
      const isWithinTorino = L.latLngBounds(torinoBounds).intersects(currentMapBounds);

      if (isTomTomLayerEnabled && isWithinTorino) {
        tomtomTrafficFlowLayer.setOpacity(0.7); // Make visible
        toast.info("Lapisan lalu lintas TomTom diaktifkan untuk Torino.");
      } else {
        tomtomTrafficFlowLayer.setOpacity(0); // Hide
        toast.info("Lapisan lalu lintas TomTom dinonaktifkan (di luar Torino atau dimatikan).");
      }
    };

    // Attach listeners
    map.on('moveend', updateTomTomTrafficVisibility);
    map.on('zoomend', updateTomTomTrafficVisibility);
    map.on('load', updateTomTomTrafficVisibility); // Initial check after map loads

    // Initial visibility update when the component mounts or dependencies change
    updateTomTomTrafficVisibility();

    return () => {
      // Detach listeners
      map.off('moveend', updateTomTomTrafficVisibility);
      map.off('zoomend', updateTomTomTrafficVisibility);
      map.off('load', updateTomTomTrafficVisibility);
    };
  }, [map, tomtomTrafficFlowLayer, isTomTomLayerEnabled, torinoBounds]);
};