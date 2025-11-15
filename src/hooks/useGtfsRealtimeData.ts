"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from 'react';
import { parseGtfsRealtimeData, ParsedTripUpdate, ParsedAlert, ParsedVehiclePosition } from '@/utils/gtfsRealtimeParser';

interface GtfsRealtimeData {
  tripUpdates: ParsedTripUpdate[];
  vehiclePositions: ParsedVehiclePosition[];
  alerts: ParsedAlert[];
}

export const useGtfsRealtimeData = () => {
  const [data, setData] = useState<GtfsRealtimeData>({ tripUpdates: [], vehiclePositions: [], alerts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await parseGtfsRealtimeData('/trip_update.bin', '/alerts.bin', '/vehicle_position.bin');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const occupancyStatuses = [
      'EMPTY',
      'MANY_SEATS_AVAILABLE',
      'FEW_SEATS_AVAILABLE',
      'STANDING_ROOM_ONLY',
      'CRUSHED_STANDING_ROOM_ONLY',
      'FULL',
    ];

    const congestionLevels = [
      'RUNNING_SMOOTHLY',
      'STOP_AND_GO',
      'CONGESTION',
      'SEVERE_CONGESTION',
    ];

    const interval = setInterval(() => {
      setData(prevData => {
        const newTripUpdates = prevData.tripUpdates.map(update => {
          const currentDelay = update.delay || (update.stop_time_update?.[0]?.arrival?.delay || 0);
          const newDelay = currentDelay + Math.floor(Math.random() * 60) - 30; // +/- 30 seconds
          
          const updatedStopTimeUpdates = update.stop_time_update ? update.stop_time_update.map((stu, idx) => 
            idx === 0 ? { ...stu, arrival: { ...stu.arrival, delay: newDelay }, departure: { ...stu.departure, delay: newDelay } } : stu
          ) : [];

          return { ...update, delay: newDelay, stop_time_update: updatedStopTimeUpdates, timestamp: Math.floor(Date.now() / 1000) };
        });

        const newVehiclePositions = prevData.vehiclePositions.map(vp => {
          const newTimestamp = Math.floor(Date.now() / 1000);

          const newLatitude = (vp.position?.latitude || 0) + (Math.random() - 0.5) * 0.0001;
          const newLongitude = (vp.position?.longitude || 0) + (Math.random() - 0.5) * 0.0001;

          const currentOccupancyIndex = occupancyStatuses.indexOf(vp.occupancy_status || 'EMPTY');
          let newOccupancyIndex = currentOccupancyIndex + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0);
          newOccupancyIndex = Math.max(0, Math.min(occupancyStatuses.length - 1, newOccupancyIndex));
          const newOccupancyStatus = occupancyStatuses[newOccupancyIndex];

          const initialSpeed = 30;
          const currentSpeed = vp.position?.speed !== undefined ? vp.position.speed : initialSpeed;
          const newSpeed = Math.max(0, Math.min(80, currentSpeed + (Math.random() - 0.5) * 10));

          const currentBearing = vp.position?.bearing || 0;
          const newBearing = (currentBearing + (Math.random() - 0.5) * 20 + 360) % 360;

          const currentCongestionLevel = vp.congestion_level && congestionLevels.includes(vp.congestion_level) ? vp.congestion_level : 'RUNNING_SMOOTHLY';
          const currentCongestionIndex = congestionLevels.indexOf(currentCongestionLevel);
          
          let newCongestionIndex = currentCongestionIndex + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0);
          newCongestionIndex = Math.max(0, Math.min(congestionLevels.length - 1, newCongestionIndex));
          const newCongestionLevel = congestionLevels[newCongestionIndex];

          return {
            ...vp,
            timestamp: newTimestamp,
            position: {
              ...vp.position,
              latitude: newLatitude,
              longitude: newLongitude,
              speed: newSpeed,
              bearing: newBearing,
            },
            occupancy_status: newOccupancyStatus,
            congestion_level: newCongestionLevel,
          };
        });

        const newAlerts = prevData.alerts.filter(alert => {
          const now = Math.floor(Date.now() / 1000);
          const activePeriod = alert.active_period?.[0];
          return activePeriod && now >= (activePeriod.start || 0) && now <= (activePeriod.end || Infinity);
        });

        return {
          tripUpdates: newTripUpdates,
          vehiclePositions: newVehiclePositions,
          alerts: newAlerts,
        };
      });
    }, 30000); // Changed from 15000ms (15 seconds) to 30000ms (30 seconds)

    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, error };
};