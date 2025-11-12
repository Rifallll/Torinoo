"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bus, TramFront, Clock, MapPin, Info, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parseGtfsRealtimeData, ParsedTripUpdate } from '@/utils/gtfsRealtimeParser';

const AllTripUpdatesPage: React.FC = () => {
  const [tripUpdates, setTripUpdates] = useState<ParsedTripUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndParseData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await parseGtfsRealtimeData('/trip_update.bin', '/alerts.bin', '/vehicle_position.bin');
      setTripUpdates(data.tripUpdates);
      console.log("[AllTripUpdatesPage] Fetched Trip Updates:", data.tripUpdates);
    } catch (err) {
      console.error("Failed to fetch or parse GTFS-realtime data:", err);
      setError("Gagal memuat atau mengurai data pembaruan perjalanan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndParseData();

    // Simulate real-time updates for trip delays
    const interval = setInterval(() => {
      setTripUpdates(prevUpdates =>
        prevUpdates.map(update => {
          const currentDelay = update.delay || (update.stop_time_update?.[0]?.arrival?.delay || 0);
          const newDelay = currentDelay + Math.floor(Math.random() * 60) - 30; // +/- 30 seconds
          
          const updatedStopTimeUpdates = update.stop_time_update ? update.stop_time_update.map((stu, idx) => 
            idx === 0 ? { ...stu, arrival: { ...stu.arrival, delay: newDelay }, departure: { ...stu.departure, delay: newDelay } } : stu
          ) : [];

          return { ...update, delay: newDelay, stop_time_update: updatedStopTimeUpdates };
        })
      );
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const formatDelay = (delaySeconds: number | undefined) => {
    if (delaySeconds === undefined || delaySeconds === 0) return 'Tepat Waktu';
    const minutes = Math.abs(Math.round(delaySeconds / 60));
    if (delaySeconds > 0) return `${minutes} mnt Terlambat`;
    return `${minutes} mnt Lebih Awal`;
  };

  const getDelayBadgeClass = (delaySeconds: number | undefined) => {
    if (delaySeconds === undefined) return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    if (delaySeconds > 120) return "bg-red-100 text-red-600 hover:bg-red-100";
    if (delaySeconds > 0) return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100";
    if (delaySeconds < 0) return "bg-green-100 text-green-600 hover:bg-green-100";
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

  const formatTimestamp = (timestamp?: number | string) => {
    if (timestamp === undefined || timestamp === null) return 'N/A';
    const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    if (isNaN(numTimestamp)) return 'Tanggal Tidak Valid';
    const date = new Date(numTimestamp * 1000);
    if (isNaN(date.getTime())) return 'Tanggal Tidak Valid';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatTime = (timestamp?: number) => {
    if (timestamp === undefined) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Clock className="h-8 w-8 mr-3 text-indigo-600" />
          Semua Pembaruan Perjalanan Real-Time
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">Memuat semua pembaruan perjalanan...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-4 col-span-full">{error}</p>
        ) : tripUpdates.length > 0 ? (
          tripUpdates.map(update => (
            <Card key={update.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  {getRouteTypeIcon(update.trip.route_id)}
                  Jalur {update.trip.route_id || update.vehicle?.label || update.id}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Trip ID: {update.trip.trip_id || 'N/A'}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span className="flex items-center">
                    <ListChecks className="h-4 w-4 mr-2" /> Seq: {update.stop_time_update?.[0]?.stop_sequence || 'N/A'}
                  </span>
                  <Badge className={getDelayBadgeClass(update.delay || update.stop_time_update?.[0]?.arrival?.delay)}>
                    {formatDelay(update.delay || update.stop_time_update?.[0]?.arrival?.delay)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" /> Stop ID: {update.stop_time_update?.[0]?.stop_id || 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Arr: {formatTime(update.stop_time_update?.[0]?.arrival?.time)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Dep: {formatTime(update.stop_time_update?.[0]?.departure?.time)}
                  </span>
                  <span className="flex items-center col-span-2">
                    <Clock className="h-4 w-4 mr-2" /> Update: {formatTimestamp(update.timestamp)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">Tidak ada pembaruan perjalanan yang tersedia.</p>
        )}
      </main>
    </div>
  );
};

export default AllTripUpdatesPage;