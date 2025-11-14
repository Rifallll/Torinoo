"use client";

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';
import { useGtfsRealtimeData } from '@/hooks/useGtfsRealtimeData';
import { getRouteTypeIcon, getVehicleStatus, getCongestionBadgeClass, formatCongestionLevel, formatRelativeTime } from '@/utils/gtfsRealtimeParser';

interface PublicTransportVehiclesLayerProps {
  map: L.Map | null;
  layerGroup: L.LayerGroup | null;
  minZoom: number;
  bounds: L.LatLngBoundsExpression;
}

export const usePublicTransportVehiclesLayer = ({
  map,
  layerGroup,
  minZoom,
  bounds,
}: PublicTransportVehiclesLayerProps) => {
  const vehicleMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const { isPublicTransportLayerEnabled } = useSettings();
  const { data: gtfsRealtimeData } = useGtfsRealtimeData();

  const updateVisibilityAndMarkers = useCallback(() => {
    if (!map || !layerGroup || !gtfsRealtimeData) return;

    // Ensure markerPane exists before attempting to add markers
    if (!map.getPanes().markerPane) {
      console.warn("Leaflet markerPane not yet available. Skipping public transport vehicle marker creation for now.");
      return;
    }

    const currentMarkers = vehicleMarkersRef.current;
    const newVehicleIds = new Set<string>();
    const isLayerCurrentlyOnMap = map.hasLayer(layerGroup);

    if (isPublicTransportLayerEnabled && map.getZoom() >= minZoom && map.getBounds().intersects(bounds)) {
      gtfsRealtimeData.vehiclePositions.forEach(vp => {
        if (vp.position?.latitude && vp.position?.longitude) {
          newVehicleIds.add(vp.id);
          const latlng: L.LatLngExpression = [vp.position.latitude, vp.position.longitude];
          const routeId = vp.trip?.route_id || 'N/A';
          const vehicleLabel = vp.vehicle?.label || vp.id;
          
          const routeIconEmoji = getRouteTypeIcon(routeId, vp.trip?.route_id?.includes('BUS') ? 3 : (vp.trip?.route_id?.includes('TRAM') ? 0 : undefined));
          const vehicleIconHtml = `<div style="background-color:#4f46e5; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:16px; font-weight:bold;">${routeIconEmoji}</div>`;
          console.log("Public Transport Icon HTML:", vehicleIconHtml);

          const vehicleIcon = L.divIcon({
            className: 'custom-vehicle-marker',
            html: vehicleIconHtml,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });

          const popupContent = `
            <div class="font-sans text-sm">
              <h3 class="font-bold text-base mb-1 flex items-center">
                <span class="mr-1">${routeIconEmoji}</span> Jalur ${routeId}
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
            marker.addTo(layerGroup);
            currentMarkers[vp.id] = marker;
          }
        }
      });

      for (const id of Object.keys(currentMarkers)) {
        if (!newVehicleIds.has(id)) {
          layerGroup.removeLayer(currentMarkers[id]);
          delete currentMarkers[id];
        }
      }

      if (!isLayerCurrentlyOnMap) {
        layerGroup.addTo(map);
        toast.info("Lapisan kendaraan transportasi publik diaktifkan.");
      }
    } else {
      for (const id of Object.keys(currentMarkers)) {
        layerGroup.removeLayer(currentMarkers[id]);
        delete currentMarkers[id];
      }
      if (isLayerCurrentlyOnMap) {
        map.removeLayer(layerGroup);
        toast.info("Lapisan kendaraan transportasi publik dinonaktifkan.");
      }
    }
  }, [map, layerGroup, minZoom, bounds, isPublicTransportLayerEnabled, gtfsRealtimeData]);

  useEffect(() => {
    if (!map || !layerGroup) return;

    map.on('zoomend', updateVisibilityAndMarkers);
    map.on('moveend', updateVisibilityAndMarkers);
    updateVisibilityAndMarkers(); // Initial check

    return () => {
      map.off('zoomend', updateVisibilityAndMarkers);
      map.off('moveend', updateVisibilityAndMarkers);
      for (const id of Object.keys(vehicleMarkersRef.current)) {
        layerGroup.removeLayer(vehicleMarkersRef.current[id]);
      }
      vehicleMarkersRef.current = {};
      if (map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup);
      }
    };
  }, [map, layerGroup, updateVisibilityAndMarkers]);

  return layerGroup;
};