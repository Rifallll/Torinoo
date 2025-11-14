"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, MapPin, Clock, Gauge, TrafficCone, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useGtfsRealtimeData } from '@/hooks/useGtfsRealtimeData';
import { formatRelativeTime, getRouteTypeIcon, getVehicleStatus, getCongestionBadgeClass, formatCongestionLevel } from '@/utils/gtfsRealtimeParser';

const VehiclePositionsCard: React.FC = React.memo(() => {
  const { data, isLoading, error } = useGtfsRealtimeData();
  const vehiclePositions = data.vehiclePositions;

  const sortedVehiclePositions = [...vehiclePositions].sort((a, b) => {
    if (a.occupancy_status === 'EMPTY' && b.occupancy_status !== 'EMPTY') {
      return -1;
    }
    if (a.occupancy_status !== 'EMPTY' && b.occupancy_status === 'EMPTY') {
      return 1;
    }
    return 0;
  });

  const displayedVehiclePositions = sortedVehiclePositions.slice(0, 5);

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Car className="h-5 w-5 mr-2 text-indigo-600" /> Vehicle Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Loading vehicle positions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Car className="h-5 w-5 mr-2 text-indigo-600" /> Vehicle Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-500 text-center py-4">Failed to load vehicle positions: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Car className="h-5 w-5 mr-2 text-indigo-600" /> Vehicle Positions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehiclePositions.length > 0 ? (
          <>
            {displayedVehiclePositions.map(vp => (
              <div key={vp.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                    {getRouteTypeIcon(vp.trip?.route_id)}
                    Route {vp.trip?.route_id || vp.vehicle?.label || vp.id}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {getVehicleStatus(vp.current_status, vp.occupancy_status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" /> Lat: {vp.position?.latitude?.toFixed(4) || 'N/A'}, Lon: {vp.position?.longitude?.toFixed(4) || 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Update: {formatRelativeTime(vp.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="flex items-center">
                    <Gauge className="h-3 w-3 mr-1" /> Speed: {vp.position?.speed ? `${vp.position.speed.toFixed(1)} km/h` : 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <TrafficCone className="h-3 w-3 mr-1" /> Congestion: <Badge className={getCongestionBadgeClass(vp.congestion_level)}>{formatCongestionLevel(vp.congestion_level)}</Badge>
                  </span>
                </div>
              </div>
            ))}
            {vehiclePositions.length > 5 && (
              <div className="text-center mt-4">
                <Button asChild variant="outline" className="">
                  <Link to="/all-vehicle-positions">
                    <span>View All ({vehiclePositions.length - 5} more)</span>
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">No vehicle positions available.</p>
        )}
      </CardContent>
    </Card>
  );
});

export default VehiclePositionsCard;