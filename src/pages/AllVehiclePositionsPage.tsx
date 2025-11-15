"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bus, TramFront, Clock, MapPin, Info, Car, Gauge, ArrowRight, TrafficCone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parseGtfsRealtimeData, ParsedVehiclePosition, formatRelativeTime } from '@/utils/gtfsRealtimeParser';

const ITEMS_PER_LOAD = 20; // Number of items to load at a time

const AllVehiclePositionsPage: React.FC = () => {
  const [allVehiclePositions, setAllVehiclePositions] = useState<ParsedVehiclePosition[]>([]);
  const [displayedVehiclePositions, setDisplayedVehiclePositions] = useState<ParsedVehiclePosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadCount, setLoadCount] = useState(1);

  const fetchAndParseData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await parseGtfsRealtimeData('/trip_update.bin', '/alerts.bin', '/vehicle_position.bin');
      // Sort vehicle positions to prioritize 'EMPTY' occupancy status
      const sortedData = [...data.vehiclePositions].sort((a, b) => {
        if (a.occupancy_status === 'EMPTY' && b.occupancy_status !== 'EMPTY') {
          return -1;
        }
        if (a.occupancy_status !== 'EMPTY' && b.occupancy_status === 'EMPTY') {
          return 1;
        }
        return 0;
      });
      setAllVehiclePositions(sortedData);
      setDisplayedVehiclePositions(sortedData.slice(0, ITEMS_PER_LOAD));
      console.log("[AllVehiclePositionsPage] Fetched Vehicle Positions:", sortedData);
    } catch (err) {
      console.error("Failed to fetch or parse GTFS-realtime data:", err);
      setError("Failed to load or parse vehicle position data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndParseData();

    // Define possible occupancy statuses in a logical order for gradual changes
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

    // Simulate real-time updates for vehicle positions
    const interval = setInterval(() => {
      setAllVehiclePositions(prevPositions =>
        prevPositions.map(vp => {
          const newTimestamp = Math.floor(Date.now() / 1000); // Always use current time for update

          // Simulate small random position change
          const newLatitude = (vp.position?.latitude || 0) + (Math.random() - 0.5) * 0.0001; // Small random change
          const newLongitude = (vp.position?.longitude || 0) + (Math.random() - 0.5) * 0.0001; // Small random change

          // Simulate gradual random occupancy status change
          const currentOccupancyIndex = occupancyStatuses.indexOf(vp.occupancy_status || 'EMPTY');
          let newOccupancyIndex = currentOccupancyIndex + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0); // 30% chance to change by +/- 1
          newOccupancyIndex = Math.max(0, Math.min(occupancyStatuses.length - 1, newOccupancyIndex)); // Clamp between min/max index
          const newOccupancyStatus = occupancyStatuses[newOccupancyIndex];

          // Simulate speed change (e.g., +/- 5 km/h, min 0, max 80)
          const initialSpeed = 30; // Default starting speed in km/h
          const currentSpeed = vp.position?.speed !== undefined ? vp.position.speed : initialSpeed;
          const newSpeed = Math.max(0, Math.min(80, currentSpeed + (Math.random() - 0.5) * 10)); // +/- 10 m/s (approx 36 km/h)

          // Simulate bearing change (e.g., +/- 10 degrees)
          const currentBearing = vp.position?.bearing || 0;
          const newBearing = (currentBearing + (Math.random() - 0.5) * 20 + 360) % 360;

          // Simulate gradual random congestion level change
          // Ensure currentCongestionIndex defaults to a known state if vp.congestion_level is undefined or 'UNKNOWN_CONGESTION_LEVEL'
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
        })
      );
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Update displayed vehicles when allVehiclePositions or loadCount changes
  useEffect(() => {
    setDisplayedVehiclePositions(allVehiclePositions.slice(0, loadCount * ITEMS_PER_LOAD));
  }, [allVehiclePositions, loadCount]);

  const handleLoadMore = useCallback(() => {
    setLoadCount(prevCount => prevCount + 1);
  }, []);

  const getRouteTypeIcon = (routeId?: string, routeType?: number) => {
    if (routeType === 3) return <Bus className="h-4 w-4 mr-1" />;
    if (routeType === 0) return <TramFront className="h-4 w-4 mr-1" />;
    if (routeId) {
      if (routeId.includes('B') || routeId === '101' || routeId === '68') return <Bus className="h-4 w-4 mr-1" />;
      if (routeId.includes('T') || routeId === '4' || routeId === '15') return <TramFront className="h-4 w-4 mr-1" />;
      if (routeId.endsWith('U')) return <Bus className="h-4 w-4 mr-1" />;
    }
    return <Info className="h-4 w-4 mr-1" />;
  };

  const getVehicleStatus = (status: string | undefined, occupancyStatus: string | undefined) => {
    if (status && status !== 'UNKNOWN_STOP_STATUS') {
      switch (status) {
        case 'IN_TRANSIT_TO': return 'In Transit To';
        case 'STOPPED_AT_STATION': return 'Stopped at Station';
        case 'IN_VEHICLE_BAY': return 'In Vehicle Bay';
        case 'AT_PLATFORM': return 'At Platform';
        default: return status.replace(/_/g, ' ');
      }
    }
    if (occupancyStatus) {
      switch (occupancyStatus) {
        case 'EMPTY': return 'Empty';
        case 'MANY_SEATS_AVAILABLE': return 'Many Seats Available';
        case 'FEW_SEATS_AVAILABLE': return 'Few Seats Available';
        case 'STANDING_ROOM_ONLY': return 'Standing Room Only';
        case 'CRUSHED_STANDING_ROOM_ONLY': return 'Crushed Standing Room Only';
        case 'FULL': return 'Full';
        case 'NOT_APPLICABLE': return 'Not Applicable';
        default: return occupancyStatus.replace(/_/g, ' ');
      }
    }
    return 'Status Not Available';
  };

  const getCongestionBadgeClass = (congestionLevel: string | undefined) => {
    switch (congestionLevel) {
      case 'RUNNING_SMOOTHLY': return 'bg-green-100 text-green-600 hover:bg-green-100';
      case 'STOP_AND_GO': return 'bg-yellow-100 text-yellow-600 hover:bg-yellow-100';
      case 'CONGESTION': return 'bg-orange-100 text-orange-600 hover:bg-orange-100';
      case 'SEVERE_CONGESTION': return 'bg-red-100 text-red-600 hover:bg-red-100';
      case 'UNKNOWN_CONGESTION_LEVEL': return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
    }
  };

  const formatCongestionLevel = (congestionLevel: string | undefined) => {
    if (!congestionLevel) return 'N/A';
    switch (congestionLevel) {
      case 'RUNNING_SMOOTHLY': return 'Running Smoothly';
      case 'STOP_AND_GO': return 'Stop & Go';
      case 'CONGESTION': return 'Congestion';
      case 'SEVERE_CONGESTION': return 'Severe Congestion';
      case 'UNKNOWN_CONGESTION_LEVEL': return 'N/A';
      default: return 'N/A';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Car className="h-8 w-8 mr-3 text-indigo-600" />
          All Real-Time Vehicle Positions
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">Loading all vehicle positions...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-4 col-span-full">{error}</p>
        ) : displayedVehiclePositions.length > 0 ? (
          <>
            {displayedVehiclePositions.map(vp => (
              <Card key={vp.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    {getRouteTypeIcon(vp.trip?.route_id)}
                    Route {vp.trip?.route_id || vp.vehicle?.label || vp.id}
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Trip ID: {vp.trip?.trip_id || 'N/A'}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" /> Lat: {vp.position?.latitude?.toFixed(4) || 'N/A'}, Lon: {vp.position?.longitude?.toFixed(4) || 'N/A'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {getVehicleStatus(vp.current_status, vp.occupancy_status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <Gauge className="h-4 w-4 mr-2" /> Speed: {vp.position?.speed ? `${vp.position.speed.toFixed(1)} km/h` : 'N/A'}
                    </span>
                    <span className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2" /> Bearing: {vp.position?.bearing ? `${vp.position.bearing.toFixed(0)}°` : 'N/A'}
                    </span>
                    <span className="flex items-center col-span-2">
                      <TrafficCone className="h-4 w-4 mr-2" /> Congestion: <Badge className={getCongestionBadgeClass(vp.congestion_level)}>{formatCongestionLevel(vp.congestion_level)}</Badge>
                    </span>
                    <span className="flex items-center col-span-2">
                      <Clock className="h-4 w-4 mr-2" /> Update: {formatRelativeTime(vp.timestamp)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {displayedVehiclePositions.length < allVehiclePositions.length && (
              <div className="col-span-full text-center mt-4">
                <Button onClick={handleLoadMore} variant="outline" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" /> Load More ({allVehiclePositions.length - displayedVehiclePositions.length} remaining)
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">No vehicle positions available.</p>
        )}
      </main>
    </div>
  );
};

export default AllVehiclePositionsPage;