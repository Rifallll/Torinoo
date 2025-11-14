"use client";

import L from 'leaflet';

/**
 * Helper function to get custom icon for GeoJSON features based on properties.
 */
export const getCustomIcon = (feature: L.GeoJSON.Feature) => {
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
          iconText = 'L'; // 'L' for Location/Landmark
          iconSize = 20;
          iconShape = 'circle';
      }
    } else if (buildingType && buildingType.toLowerCase() === 'residential') {
      iconColor = '#800080'; // Purple
      iconText = 'R';
      iconShape = 'square';
    } else {
      iconColor = '#6b7280'; // Darker gray for generic points
      iconText = 'P'; // 'P' for Point of Interest
      iconSize = 20;
      iconShape = 'circle';
    }
  }

  const borderRadius = iconShape === 'circle' ? '50%' : '5px';

  return L.divIcon({
    className: 'custom-poi-marker',
    html: `<div style="background-color:${iconColor}; width:${iconSize}px; height:${iconSize}px; border-radius:${borderRadius}; display:flex; align-items:center; justify-content:center; color:white; font-size:${iconSize / 2}px; font-weight:bold;">${iconText}</div>`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2]
  });
};

/**
 * Helper function to get color for GTFS route polylines based on route type.
 */
export const getGtfsRouteColor = (routeType: number) => {
  switch (routeType) {
    case 0: return '#a855f7'; // Tram (Purple)
    case 1: return '#6b7280'; // Subway (Gray)
    case 2: return '#8b4513'; // Rail (SaddleBrown)
    case 3: return '#22c55e'; // Bus (Green)
    case 4: return '#0ea5e9'; // Ferry (Sky Blue)
    case 5: return '#facc15'; // Cable Car (Yellow)
    case 6: return '#f472b6'; // Gondola (Pink)
    case 7: return '#6366f1'; // Funicular (Indigo)
    default: return '#3388ff'; // Default Blue
  }
};