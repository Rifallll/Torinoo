"use client";

import { useEffect } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { useGtfsData } from '@/hooks/useGtfsData';
import { getGtfsRouteColor } from '@/utils/mapUtils';

interface UseGtfsRoutesLayerProps {
  map: L.Map | null;
  gtfsRoutesLayerGroup: L.LayerGroup | null;
  gtfsRouteTypeFilter: string;
  minZoomForGtfsRoutes: number;
}

export const useGtfsRoutesLayer = ({
  map,
  gtfsRoutesLayerGroup,
  gtfsRouteTypeFilter,
  minZoomForGtfsRoutes,
}: UseGtfsRoutesLayerProps) => {
  const { data: gtfsData, isLoading: isLoadingGtfs, error: gtfsError } = useGtfsData();

  // Effect for fetching and rendering GTFS routes
  useEffect(() => {
    if (!map || !gtfsRoutesLayerGroup || isLoadingGtfs || gtfsError || !gtfsData) {
      return;
    }

    gtfsRoutesLayerGroup.clearLayers(); // Clear existing routes

    const { routes, shapes, trips, agencies } = gtfsData; // Destructure trips as well

    // Create a map for efficient shape lookup
    const shapesByShapeId = new Map<string, L.LatLng[]>();
    shapes.forEach(shapePoint => {
      if (!shapesByShapeId.has(shapePoint.shape_id)) {
        shapesByShapeId.set(shapePoint.shape_id, []);
      }
      shapesByShapeId.get(shapePoint.shape_id)?.push(L.latLng(shapePoint.shape_pt_lat, shapePoint.shape_pt_lon));
    });

    const filteredRoutes = routes.filter(route => {
      const matchesType = gtfsRouteTypeFilter === 'all' || String(route.route_type) === gtfsRouteTypeFilter;
      return matchesType;
    });

    // Now, iterate through filtered routes, find associated trips, and then their shapes
    filteredRoutes.forEach(route => {
      // Find all trips for this route
      const tripsForRoute = trips.filter(trip => trip.route_id === route.route_id);

      // Collect unique shape_ids for these trips
      const uniqueShapeIds = new Set<string>();
      tripsForRoute.forEach(trip => {
        if (trip.shape_id) {
          uniqueShapeIds.add(trip.shape_id);
        }
      });

      uniqueShapeIds.forEach(shapeId => {
        if (shapesByShapeId.has(shapeId)) {
          const routeShape = shapesByShapeId.get(shapeId);
          if (routeShape && routeShape.length > 1) {
            const lineColor = getGtfsRouteColor(route.route_type);
            const lineWeight = route.route_type === 1 ? 5 : route.route_type === 0 ? 4 : 3; // Subway thicker, Tram slightly thicker

            const polyline = L.polyline(routeShape, {
              color: lineColor,
              weight: lineWeight,
              opacity: 0.7,
            });

            const agency = agencies.find(a => a.agency_id === route.agency_id);
            const popupContent = `
              <b>${route.route_short_name || route.route_long_name || 'N/A'}</b><br/>
              Tipe: ${route.route_type === 0 ? 'Tram' : route.route_type === 1 ? 'Subway' : route.route_type === 3 ? 'Bus' : 'Lainnya'}<br/>
              Nama Panjang: ${route.route_long_name || 'N/A'}<br/>
              Operator: ${agency?.agency_name || 'N/A'}<br/>
              Deskripsi: ${route.route_desc || 'N/A'}
            `;
            polyline.bindPopup(popupContent);

            polyline.addTo(gtfsRoutesLayerGroup);
          }
        }
      });
    });

    // Cleanup function
    return () => {
      gtfsRoutesLayerGroup.clearLayers();
    };
  }, [map, gtfsRoutesLayerGroup, gtfsData, gtfsRouteTypeFilter, isLoadingGtfs, gtfsError]);

  // Effect for managing visibility based on zoom
  useEffect(() => {
    if (!map || !gtfsRoutesLayerGroup) return;

    const updateVisibility = () => {
      if (map.getZoom() >= minZoomForGtfsRoutes) {
        if (!map.hasLayer(gtfsRoutesLayerGroup)) {
          gtfsRoutesLayerGroup.addTo(map);
          toast.info("Lapisan rute transportasi publik ditampilkan.");
        }
      } else {
        if (map.hasLayer(gtfsRoutesLayerGroup)) {
          map.removeLayer(gtfsRoutesLayerGroup);
          toast.info("Lapisan rute transportasi publik disembunyikan (perkecil untuk performa).");
        }
      }
    };

    map.on('zoomend', updateVisibility);
    updateVisibility(); // Initial check

    return () => {
      map.off('zoomend', updateVisibility);
    };
  }, [map, gtfsRoutesLayerGroup, minZoomForGtfsRoutes]);
};