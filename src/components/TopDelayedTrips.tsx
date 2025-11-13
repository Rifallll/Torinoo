"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Bus, TramFront, Info, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { parseGtfsRealtimeData, ParsedTripUpdate } from '@/utils/gtfsRealtimeParser';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const TopDelayedTrips: React.FC = () => {
  const [delayedTrips, setDelayedTrips] = useState<ParsedTripUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await parseGtfsRealtimeData('/trip_update.bin', '/alerts.bin', '/vehicle_position.bin');
        const sortedDelayedTrips = data.tripUpdates
          .filter(update => (update.delay || update.stop_time_update?.[0]?.arrival?.delay || 0) > 0) // Only show delayed trips
          .sort((a, b) => {
            const delayA = a.delay || a.stop_time_update?.[0]?.arrival?.delay || 0;
            const delayB = b.delay || b.stop_time_update?.[0]?.arrival?.delay || 0;
            return delayB - delayA; // Sort in descending order of delay
          })
          .slice(0, 3); // Get top 3
        setDelayedTrips(sortedDelayedTrips);
      } catch (err) {
        console.error("Failed to fetch or process GTFS-realtime data for delayed trips:", err);
        setError("Gagal memuat data perjalanan yang tertunda.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
    const interval = setInterval(fetchAndProcessData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDelay = (delaySeconds: number | undefined) => {
    if (delaySeconds === undefined || delaySeconds === 0) return 'Tepat Waktu';
    const minutes = Math.abs(Math.round(delaySeconds / 60));
    if (delaySeconds > 0) return `${minutes} mnt Terlambat`;
    return `${minutes} mnt Lebih Awal`;
  };

  const getDelayBadgeClass = (delaySeconds: number | undefined) => {
    if (delaySeconds === undefined || delaySeconds === 0) return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    if (delaySeconds > 120) return "bg-red-100 text-red-600 hover:bg-red-100";
    if (delaySeconds > 0) return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100";
    return "bg-gray-100 text-gray-600 hover:bg-gray-100";
  };

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

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-red-600" /> Perjalanan Paling Terlambat
        </CardTitle>
        <Button 
          variant="link" 
          className="p-0 h-auto flex items-center text-indigo-600 hover:text-indigo-700"
          onClick={() => navigate("/all-trip-updates")} // Use navigate here
        >
          Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Memuat perjalanan yang tertunda...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-4">{error}</p>
        ) : delayedTrips.length > 0 ? (
          delayedTrips.map(update => (
            <div key={update.id} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                  {getRouteTypeIcon(update.trip.route_id)}
                  Jalur {update.trip.route_id || update.vehicle?.label || update.id}
                </h4>
                <Badge className={getDelayBadgeClass(update.delay || update.stop_time_update?.[0]?.arrival?.delay)}>
                  {formatDelay(update.delay || update.stop_time_update?.[0]?.arrival?.delay)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                Stop ID: {update.stop_time_update?.[0]?.stop_id || 'N/A'}
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto justify-start text-sm mt-1"
                onClick={() => navigate(`/all-trip-updates`)} // Use navigate here
              >
                Detail
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada perjalanan yang tertunda saat ini.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TopDelayedTrips;