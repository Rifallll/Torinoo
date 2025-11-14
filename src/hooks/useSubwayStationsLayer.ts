"use client";

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { convertCoordinates } from '../utils/coordinateConverter';

interface SubwayStationsLayerProps {
  map: L.Map | null;
  minZoomForSubwayStations: number;
}

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

export const useSubwayStationsLayer = ({ map, minZoomForSubwayStations }: SubwayStationsLayerProps) => {
  const subwayStationsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const updateSubwayStationsVisibility = useCallback(() => {
    if (!map || !subwayStationsLayerGroupRef.current) return;

    if (map.getZoom() >= minZoomForSubwayStations) {
      if (!map.hasLayer(subwayStationsLayerGroupRef.current)) {
        subwayStationsLayerGroupRef.current.addTo(map);
        toast.info("Lapisan halte kereta bawah tanah ditampilkan.");
      }
    } else {
      if (map.hasLayer(subwayStationsLayerGroupRef.current)) {
        map.removeLayer(subwayStationsLayerGroupRef.current);
        toast.info("Lapisan halte kereta bawah tanah disembunyikan (perkecil untuk performa).");
      }
    }
  }, [map, minZoomForSubwayStations]);

  useEffect(() => {
    if (!map) return;

    if (!subwayStationsLayerGroupRef.current) {
      subwayStationsLayerGroupRef.current = L.layerGroup();
      subwayStationsData.forEach(station => {
        const { latitude, longitude } = convertCoordinates(station.x, station.y);
        if (latitude !== 0 || longitude !== 0) {
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'subway-station-marker',
              html: `<div style="background-color:#007bff; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold;">M</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          })
          .bindPopup(`<b>${station.name}</b><br/>Subway Station`)
          .addTo(subwayStationsLayerGroupRef.current);
        }
      });
    }

    map.on('zoomend', updateSubwayStationsVisibility);
    updateSubwayStationsVisibility(); // Initial check

    return () => {
      map.off('zoomend', updateSubwayStationsVisibility);
      if (subwayStationsLayerGroupRef.current) {
        map.removeLayer(subwayStationsLayerGroupRef.current);
        subwayStationsLayerGroupRef.current = null;
      }
    };
  }, [map, minZoomForSubwayStations, updateSubwayStationsVisibility]);

  return subwayStationsLayerGroupRef.current;
};