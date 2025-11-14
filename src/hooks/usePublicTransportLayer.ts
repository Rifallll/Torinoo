"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { renderToString } from 'react-dom/server';
import { useSettings } from '@/contexts/SettingsContext';
import { useGtfsRealtimeData } from '@/hooks/useGtfsRealtimeData';
import { getRouteTypeIcon, getVehicleStatus, getCongestionBadgeClass, formatCongestionLevel, formatRelativeTime } from '@/utils/gtfsRealtimeParser';

interface PublicTransportLayerProps {
  map: L.Map | null;
  minZoomForPublicTransport: number;
  torinoBounds: L.LatLngBoundsExpression;
}

export const usePublicTransportLayer = ({ map, minZoomForPublicTransport, torinoBounds }: PublicTransportLayerProps) => {
  const publicTransportVehiclesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const { isPublicTransportLayerEnabled } = useSettings();
  const { data: gtfsRealtimeData } = useGtfsRealtimeData();

  const updatePublicTransportVisibility = useCallback(() => {
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
  }, [map, minZoomForPublicTransport, torinoBounds, isPublicTransportLayerEnabled]);

  useEffect(() => {
    if (!map) return;

    if (!publicTransportVehiclesLayerGroupRef.current) {
      publicTransportVehiclesLayerGroupRef.current = L.layerGroup();
    }

    map.on('zoomend', updatePublicTransportVisibility);
    map.on('moveend', updatePublicTransportVisibility);
    updatePublicTransportVisibility(); // Initial check

    return () => {
      map.off('zoomend', updatePublicTransportVisibility);
      map.off('moveend', updatePublicTransportVisibility);
      if (publicTransportVehiclesLayerGroupRef.current) {
        map.removeLayer(publicTransportVehiclesLayerGroupRef.current);
        publicTransportVehiclesLayerGroupRef.current = null;
      }
    };
  }, [map, updatePublicTransportVisibility]);

  useEffect(() => {
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

          // Render JSX to string for the icon
          const vehicleIconHtmlString = renderToString(
            <div className="flex items-center justify-center p-1 rounded-full bg-indigo-600 text-white shadow-md" style={{ width: '30px', height: '30px' }}>
              {vehicleTypeIcon}
            </div>
          );

          const vehicleIcon = L.divIcon({
            className: 'custom-vehicle-marker',
            html: vehicleIconHtmlString,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });

          // Render JSX to string for the popup content
          const popupVehicleTypeIconString = renderToString(getRouteTypeIcon(routeId));
          const popupContent = `
            <div class="font-sans text-sm">
              <h3 class="font-bold text-base mb-1 flex items-center">
                ${popupVehicleTypeIconString} Jalur ${routeId}
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
      for (const id in currentMarkers) {
        publicTransportVehiclesLayerGroupRef.current.removeLayer(currentMarkers[id]);
        delete currentMarkers[id];
      }
      if (map.hasLayer(publicTransportVehiclesLayerGroupRef.current)) {
        map.removeLayer(publicTransportVehiclesLayerGroupRef.current);
      }
    }
  }, [map, gtfsRealtimeData, isPublicTransportLayerEnabled, minZoomForPublicTransport, torinoBounds]); // Added torinoBounds to dependencies

  return publicTransportVehiclesLayerGroupRef.current;
};