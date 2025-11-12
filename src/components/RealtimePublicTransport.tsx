"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, TramFront, Clock, MapPin, AlertTriangle, CheckCircle2, Info, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { parseGtfsRealtimeData, ParsedTripUpdate, ParsedAlert, ParsedVehiclePosition } from '@/utils/gtfsRealtimeParser'; // Import ParsedVehiclePosition

const RealtimePublicTransport: React.FC = () => {
  const [tripUpdates, setTripUpdates] = useState<ParsedTripUpdate[]>([]);
  const [vehiclePositions, setVehiclePositionData] = useState<ParsedVehiclePosition[]>([]); // Renamed state variable to avoid conflict
  const [alerts, setAlerts] = useState<ParsedAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndParseData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass all three bin paths
      const data = await parseGtfsRealtimeData('/trip_update.bin', '/alerts.bin', '/vehicle_position.bin');
      setTripUpdates(data.tripUpdates);
      setVehiclePositionData(data.vehiclePositions); // Set vehicle positions
      setAlerts(data.alerts);
      console.log("[RealtimePublicTransport] Fetched Vehicle Positions:", data.vehiclePositions); // Added console log here
    } catch (err) {
      console.error("Failed to fetch or parse GTFS-realtime data:", err);
      setError("Gagal memuat atau mengurai data transportasi publik.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndParseData();

    // Simulate real-time updates for trip delays and vehicle positions
    const interval = setInterval(() => {
      // Simulate delay changes for trip updates
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

      // Simulate vehicle movement/status changes (example: just updating timestamp)
      setVehiclePositionData(prevPositions =>
        prevPositions.map(vp => ({
          ...vp,
          timestamp: vp.timestamp ? vp.timestamp + 15 : Math.floor(Date.now() / 1000), // Increment timestamp
          // Could also simulate position changes here if desired
        }))
      );

      // Filter active alerts based on current time (mocking active period)
      // This assumes alerts are static and only their active_period changes relative to current time
      // If alerts themselves change, they would need to be refetched or updated from a source
      setAlerts(prevAlerts => prevAlerts.filter(alert => {
        const now = Math.floor(Date.now() / 1000);
        const activePeriod = alert.active_period?.[0];
        return activePeriod && now >= (activePeriod.start || 0) && now <= (activePeriod.end || Infinity);
      }));
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup

  const formatDelay = (delaySeconds: number | undefined) => {
    if (delaySeconds === undefined || delaySeconds === 0) return 'Tepat Waktu';
    const minutes = Math.abs(Math.round(delaySeconds / 60));
    if (delaySeconds > 0) return `${minutes} mnt Terlambat`;
    return `${minutes} mnt Lebih Awal`;
  };

  const getDelayBadgeClass = (delaySeconds: number | undefined) => {
    if (delaySeconds === undefined) return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    if (delaySeconds > 120) return "bg-red-100 text-red-600 hover:bg-red-100"; // More than 2 min delay
    if (delaySeconds > 0) return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"; // Delayed
    if (delaySeconds < 0) return "bg-green-100 text-green-600 hover:bg-green-100"; // Early
    return "bg-gray-100 text-gray-600 hover:bg-gray-100"; // On Time
  };

  const getRouteTypeIcon = (routeId?: string, routeType?: number) => {
    // Prioritize routeType if available (e.g., from alerts)
    if (routeType === 3) return <Bus className="h-4 w-4 mr-1" />; // Bus
    if (routeType === 0) return <TramFront className="h-4 w-4 mr-1" />; // Tram (often 0 for tram/light rail)

    // Fallback to routeId inference for TripUpdate/VehiclePosition if routeType is not provided
    if (routeId) {
      // Example: if routeId contains 'B' for Bus, 'T' for Tram, etc.
      if (routeId.includes('B') || routeId === '101' || routeId === '68') return <Bus className="h-4 w-4 mr-1" />;
      if (routeId.includes('T') || routeId === '4' || routeId === '15') return <TramFront className="h-4 w-4 mr-1" />;
    }

    return <Info className="h-4 w-4 mr-1" />; // Default/Unknown
  };

  const formatTimestamp = (timestamp?: number | string) => {
    if (timestamp === undefined || timestamp === null) return 'N/A';
    const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    if (isNaN(numTimestamp)) return 'Tanggal Tidak Valid'; // Handle NaN explicitly
    const date = new Date(numTimestamp * 1000);
    if (isNaN(date.getTime())) return 'Tanggal Tidak Valid'; // Check if Date object is valid
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getVehicleStatus = (status: string | undefined) => {
    if (!status) return 'Status Tidak Tersedia';

    // Common GTFS-realtime VehicleStopStatus enum values
    // Mapping to Indonesian for better readability
    switch (status) {
      case 'IN_TRANSIT_TO':
      case '0': // If it's coming as a number 0 (common default for IN_TRANSIT_TO)
        return 'Dalam Perjalanan';
      case 'STOPPED_AT_STATION':
      case '1': // If it's coming as a number 1
        return 'Berhenti di Stasiun';
      case 'IN_VEHICLE_BAY':
      case '2': // If it's coming as a number 2
        return 'Di Teluk Kendaraan';
      case 'AT_PLATFORM':
      case '3': // If it's coming as a number 3
        return 'Di Platform';
      case 'UNKNOWN_STOP_STATUS': // Explicit unknown from proto
        return 'Status Tidak Diketahui';
      default:
        // Fallback for other string statuses, replacing underscores
        return status.replace(/_/g, ' ');
    }
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
                        {getRouteTypeIcon(entity.route_id, entity.route_type)} Jalur {entity.route_id}
                      </Badge>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Car className="h-4 w-4 mr-2" /> Posisi Kendaraan
        </h3>
        {vehiclePositions.length > 0 ? (
          vehiclePositions.map(vp => (
            <div key={vp.id} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                  {getRouteTypeIcon(vp.trip?.route_id)}
                  Jalur {vp.trip?.route_id || vp.vehicle?.label || vp.id}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {getVehicleStatus(vp.current_status)}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> Lat: {vp.position?.latitude?.toFixed(4) || 'N/A'}, Lon: {vp.position?.longitude?.toFixed(4) || 'N/A'}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> Update: {formatTimestamp(vp.timestamp)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada posisi kendaraan yang tersedia.</p>
        )}

        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Clock className="h-4 w-4 mr-2" /> Pembaruan Perjalanan
        </h3>
        {tripUpdates.length > 0 ? (
          tripUpdates.map(update => (
            <div key={update.id} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                  {getRouteTypeIcon(update.trip.route_id)}
                  Jalur {update.trip.route_id || update.vehicle?.label || update.id} ({update.trip.trip_id || 'N/A'})
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

        {/* Temporary Raw Data Display for Debugging */}
        {vehiclePositions.length > 0 && (
          <Card className="mt-6 bg-gray-50 dark:bg-gray-900 border-dashed border-2 border-gray-300 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Info className="h-5 w-5 mr-2 text-gray-500" /> Raw Vehicle Positions Data (Debug)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all max-h-60 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                {JSON.stringify(vehiclePositions.slice(0, 5), null, 2)} {/* Display first 5 items */}
              </pre>
              <p className="text-xs text-gray-500 mt-2">
                Ini adalah 5 entri pertama dari data posisi kendaraan mentah untuk tujuan debugging.
                Harap salin dan tempelkan ini ke dalam chat.
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimePublicTransport;