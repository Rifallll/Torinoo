"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, TramFront, Clock, MapPin, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { parseGtfsRealtimeData, ParsedTripUpdate, ParsedAlert } from '@/utils/gtfsRealtimeParser'; // Import parser

const RealtimePublicTransport: React.FC = () => {
  const [tripUpdates, setTripUpdates] = useState<ParsedTripUpdate[]>([]);
  const [alerts, setAlerts] = useState<ParsedAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming alerts.bin and trip_update.bin are in the public folder
        const data = await parseGtfsRealtimeData('/alerts.bin', '/trip_update.bin');
        setTripUpdates(data.tripUpdates);
        setAlerts(data.alerts);
      } catch (err) {
        console.error("Failed to fetch or parse GTFS-realtime data:", err);
        setError("Gagal memuat atau mengurai data transportasi publik.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Simulate real-time updates for trip delays (if data is loaded)
    const interval = setInterval(() => {
      setTripUpdates(prevUpdates =>
        prevUpdates.map(update => {
          // Only simulate if there's an existing delay or we want to introduce one
          const currentDelay = update.delay || (update.stop_time_update?.[0]?.arrival?.delay || 0);
          const newDelay = currentDelay + Math.floor(Math.random() * 60) - 30; // +/- 30 seconds
          
          // Update the first stop_time_update's delay, or the top-level delay if available
          const updatedStopTimeUpdates = update.stop_time_update ? update.stop_time_update.map((stu, idx) => 
            idx === 0 ? { ...stu, arrival: { ...stu.arrival, delay: newDelay }, departure: { ...stu.departure, delay: newDelay } } : stu
          ) : [];

          return { ...update, delay: newDelay, stop_time_update: updatedStopTimeUpdates };
        })
      );
      // Filter active alerts based on current time (mocking active period)
      setAlerts(prevAlerts => prevAlerts.filter(alert => {
        const now = Math.floor(Date.now() / 1000);
        const activePeriod = alert.active_period?.[0];
        return activePeriod && now >= (activePeriod.start || 0) && now <= (activePeriod.end || Infinity);
      }));
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const formatDelay = (delaySeconds: number | undefined) => {
    if (delaySeconds === undefined || delaySeconds === 0) return 'On Time';
    const minutes = Math.abs(Math.round(delaySeconds / 60));
    if (delaySeconds > 0) return `${minutes} min Delayed`;
    return `${minutes} min Early`;
  };

  const getDelayBadgeClass = (delaySeconds: number | undefined) => {
    if (delaySeconds === undefined) return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    if (delaySeconds > 120) return "bg-red-100 text-red-600 hover:bg-red-100"; // More than 2 min delay
    if (delaySeconds > 0) return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"; // Delayed
    if (delaySeconds < 0) return "bg-green-100 text-green-600 hover:bg-green-100"; // Early
    return "bg-gray-100 text-gray-600 hover:bg-gray-100"; // On Time
  };

  const getRouteTypeIcon = (routeType?: number) => {
    if (routeType === 3) return <Bus className="h-4 w-4 mr-1" />; // Bus
    if (routeType === 0) return <TramFront className="h-4 w-4 mr-1" />; // Tram
    return <Info className="h-4 w-4 mr-1" />; // Default/Unknown
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Bus className="h-5 w-5 mr-2 text-indigo-600 animate-pulse" />
            <span className="ml-2">Memuat Transportasi Publik Real-Time...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Mengambil dan mengurai data GTFS-realtime.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg border-red-500">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-500 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Kesalahan Data Transportasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>{error}</p>
          <p className="text-sm text-gray-500">Pastikan file `.bin` tersedia dan formatnya benar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Bus className="h-5 w-5 mr-2 text-indigo-600" />
          Transportasi Publik Real-Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length > 0 && (
          <div className="space-y-2 mb-4">
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" /> Peringatan Aktif
            </h3>
            {alerts.map(alert => (
              <div key={alert.id} className="border-l-4 border-orange-500 pl-3 py-1 bg-orange-50/50 dark:bg-orange-900/20 rounded-r-md">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{alert.header_text?.translation?.[0]?.text || 'N/A'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{alert.description_text?.translation?.[0]?.text || 'N/A'}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {alert.informed_entity?.map((entity, idx) => (
                    entity.route_id && (
                      <Badge key={idx} variant="secondary" className="text-xs flex items-center">
                        {getRouteTypeIcon(entity.route_type)} Jalur {entity.route_id}
                      </Badge>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Clock className="h-4 w-4 mr-2" /> Pembaruan Perjalanan
        </h3>
        {tripUpdates.length > 0 ? (
          tripUpdates.map(update => (
            <div key={update.id} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                  {getRouteTypeIcon(update.trip.route_id === '101' || update.trip.route_id === '68' ? 3 : 0)} {/* Simple type inference */}
                  Jalur {update.trip.route_id} ({update.trip.trip_id})
                </h4>
                <Badge className={getDelayBadgeClass(update.delay || update.stop_time_update?.[0]?.arrival?.delay)}>
                  {formatDelay(update.delay || update.stop_time_update?.[0]?.arrival?.delay)}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> Stop Seq: {update.stop_time_update?.[0]?.stop_sequence || 'N/A'}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> Status: {update.vehicle?.label || 'IN_TRANSIT'} {/* Placeholder, actual status from VehiclePosition */}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada pembaruan perjalanan yang tersedia.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimePublicTransport;