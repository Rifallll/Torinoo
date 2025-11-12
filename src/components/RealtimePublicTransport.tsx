"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, TramFront, Clock, MapPin, AlertTriangle, CheckCircle2, Info, Car, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button component
import { parseGtfsRealtimeData, ParsedTripUpdate, ParsedAlert, ParsedVehiclePosition } from '@/utils/gtfsRealtimeParser'; // Import ParsedVehiclePosition

const RealtimePublicTransport: React.FC = () => {
  const [tripUpdates, setTripUpdates] = useState<ParsedTripUpdate[]>([]);
  const [vehiclePositions, setVehiclePositionData] = useState<ParsedVehiclePosition[]>([]); // Renamed state variable to avoid conflict
  const [alerts, setAlerts] = useState<ParsedAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllVehiclePositions, setShowAllVehiclePositions] = useState(false); // New state for "View All"

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
      console.log("[RealtimePublicTransport] Fetched Trip Updates:", data.tripUpdates);
      console.log("[RealtimePublicTransport] Fetched Alerts:", data.alerts);
    } catch (err) {
      console.error("Failed to fetch or parse GTFS-realtime data:", err);
      setError("Gagal memuat atau mengurai data transportasi publik.");
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
        prevPositions.map(vp => {
          const newTimestamp = vp.timestamp ? vp.timestamp + 15 : Math.floor(Date.now() / 1000); // Increment timestamp

          // Simulate small random position change
          const newLatitude = (vp.position?.latitude || 0) + (Math.random() - 0.5) * 0.0001; // Small random change
          const newLongitude = (vp.position?.longitude || 0) + (Math.random() - 0.5) * 0.0001; // Small random change

          // Simulate gradual random occupancy status change
          const currentOccupancyIndex = occupancyStatuses.indexOf(vp.occupancy_status || 'EMPTY');
          let newOccupancyIndex = currentOccupancyIndex + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0); // 30% chance to change by +/- 1
          newOccupancyIndex = Math.max(0, Math.min(occupancyStatuses.length - 1, newOccupancyIndex)); // Clamp between min/max index
          const newOccupancyStatus = occupancyStatuses[newOccupancyIndex];

          return {
            ...vp,
            timestamp: newTimestamp,
            position: {
              ...vp.position,
              latitude: newLatitude,
              longitude: newLongitude,
            },
            occupancy_status: newOccupancyStatus,
          };
        })
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
      // Based on the provided data, "10U" looks like a route ID, which could be a bus.
      if (routeId.endsWith('U')) return <Bus className="h-4 w-4 mr-1" />;
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

  const formatStartDate = (dateString?: string) => {
    if (!dateString || dateString.length !== 8) return 'N/A';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
  };

  const getVehicleStatus = (status: string | undefined, occupancyStatus: string | undefined) => {
    if (status && status !== 'UNKNOWN_STOP_STATUS') {
      switch (status) {
        case 'IN_TRANSIT_TO': return 'Dalam Perjalanan';
        case 'STOPPED_AT_STATION': return 'Berhenti di Stasiun';
        case 'IN_VEHICLE_BAY': return 'Di Teluk Kendaraan';
        case 'AT_PLATFORM': return 'Di Platform';
        default: return status.replace(/_/g, ' ');
      }
    }
    // Fallback to occupancy status if current_status is not meaningful
    if (occupancyStatus) {
      switch (occupancyStatus) {
        case 'EMPTY': return 'Kosong';
        case 'MANY_SEATS_AVAILABLE': return 'Banyak Kursi Tersedia';
        case 'FEW_SEATS_AVAILABLE': return 'Beberapa Kursi Tersedia';
        case 'STANDING_ROOM_ONLY': return 'Hanya Berdiri';
        case 'CRUSHED_STANDING_ROOM_ONLY': return 'Sangat Penuh';
        case 'FULL': return 'Penuh';
        case 'NOT_APPLICABLE': return 'Tidak Berlaku';
        default: return occupancyStatus.replace(/_/g, ' ');
      }
    }
    return 'Status Tidak Tersedia';
  };

  const displayedVehiclePositions = showAllVehiclePositions ? vehiclePositions : vehiclePositions.slice(0, 5);

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
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Memuat posisi kendaraan...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-4">{error}</p>
        ) : vehiclePositions.length > 0 ? (
          <>
            {displayedVehiclePositions.map(vp => (
              <div key={vp.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                    {getRouteTypeIcon(vp.trip?.route_id)}
                    Jalur {vp.trip?.route_id || vp.vehicle?.label || vp.id}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {getVehicleStatus(vp.current_status, vp.occupancy_status)}
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
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Trip ID: {vp.trip?.trip_id || 'N/A'}</span>
                  <span>Start Time: {vp.trip?.start_time || 'N/A'}</span>
                  <span>Start Date: {formatStartDate(vp.trip?.start_date)}</span>
                </div>
              </div>
            ))}
            {vehiclePositions.length > 5 && (
              <div className="text-center mt-4">
                <Button variant="outline" onClick={() => setShowAllVehiclePositions(!showAllVehiclePositions)} className="w-full">
                  {showAllVehiclePositions ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" /> Tampilkan Lebih Sedikit
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" /> Lihat Semua ({vehiclePositions.length - 5} lainnya)
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
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
                  <MapPin className="h-3 w-3 mr-1" /> Stop ID: {update.stop_time_update?.[0]?.stop_id || 'N/A'}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> Update: {formatTimestamp(update.timestamp)}
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