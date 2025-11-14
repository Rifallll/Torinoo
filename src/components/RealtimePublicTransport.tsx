"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, TramFront, Clock, MapPin, AlertTriangle, CheckCircle2, Info, Car, ListChecks, TrafficCone, Gauge, ArrowRight, Route } from 'lucide-react'; // Added Route icon
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { parseGtfsRealtimeData, ParsedTripUpdate, ParsedAlert, ParsedVehiclePosition, formatRelativeTime, formatTime } from '@/utils/gtfsRealtimeParser';
import { Link } from 'react-router-dom';
import { useGtfsData } from '@/hooks/useGtfsData'; // Import the new hook for local GTFS data

const RealtimePublicTransport: React.FC = () => {
  const [tripUpdates, setTripUpdates] = useState<ParsedTripUpdate[]>([]);
  const [vehiclePositions, setVehiclePositionData] = useState<ParsedVehiclePosition[]>([]);
  const [alerts, setAlerts] = useState<ParsedAlert[]>([]);
  const [isLoadingRealtime, setIsLoadingRealtime] = useState(true);
  const [errorRealtime, setErrorRealtime] = useState<string | null>(null);

  // Use the new hook for local GTFS routes
  const { data: gtfsData, isLoading: isLoadingGtfs, error: gtfsError } = useGtfsData();
  const transitlandRoutes = gtfsData?.routes || []; // Use local GTFS routes

  const fetchAndParseRealtimeData = async () => {
    setIsLoadingRealtime(true);
    setErrorRealtime(null);
    try {
      const data = await parseGtfsRealtimeData('/trip_update.bin', '/alerts.bin', '/vehicle_position.bin');
      setTripUpdates(data.tripUpdates);
      setVehiclePositionData(data.vehiclePositions);
      setAlerts(data.alerts);
      console.log("[RealtimePublicTransport] Fetched Vehicle Positions:", data.vehiclePositions);
      console.log("[RealtimePublicTransport] Fetched Trip Updates:", data.tripUpdates);
      console.log("[RealtimePublicTransport] Fetched Alerts:", data.alerts);
    } catch (err) {
      console.error("Failed to fetch or parse GTFS-realtime data:", err);
      setErrorRealtime("Gagal memuat atau mengurai data transportasi publik real-time.");
    } finally {
      setIsLoadingRealtime(false);
    }
  };

  useEffect(() => {
    fetchAndParseRealtimeData();

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
      setTripUpdates(prevUpdates =>
        prevUpdates.map(update => {
          const currentDelay = update.delay || (update.stop_time_update?.[0]?.arrival?.delay || 0);
          const newDelay = currentDelay + Math.floor(Math.random() * 60) - 30; // +/- 30 seconds
          
          const updatedStopTimeUpdates = update.stop_time_update ? update.stop_time_update.map((stu, idx) => 
            idx === 0 ? { ...stu, arrival: { ...stu.arrival, delay: newDelay }, departure: { ...stu.departure, delay: newDelay } } : stu
          ) : [];

          return { ...update, delay: newDelay, stop_time_update: updatedStopTimeUpdates, timestamp: Math.floor(Date.now() / 1000) };
        })
      );

      setVehiclePositionData(prevPositions =>
        prevPositions.map(vp => {
          const newTimestamp = Math.floor(Date.now() / 1000); // Always use current time for update

          const newLatitude = (vp.position?.latitude || 0) + (Math.random() - 0.5) * 0.0001;
          const newLongitude = (vp.position?.longitude || 0) + (Math.random() - 0.5) * 0.0001;

          const currentOccupancyIndex = occupancyStatuses.indexOf(vp.occupancy_status || 'EMPTY');
          let newOccupancyIndex = currentOccupancyIndex + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0);
          newOccupancyIndex = Math.max(0, Math.min(occupancyStatuses.length - 1, newOccupancyIndex));
          const newOccupancyStatus = occupancyStatuses[newOccupancyIndex];

          // Simulate speed change (e.g., +/- 5 km/h, min 0, max 80)
          const initialSpeed = 30; // Default starting speed in km/h
          const currentSpeed = vp.position?.speed !== undefined ? vp.position.speed : initialSpeed;
          const newSpeed = Math.max(0, Math.min(80, currentSpeed + (Math.random() - 0.5) * 10)); // +/- 10 m/s (approx 36 km/h)

          // Simulate bearing change (e.g., +/- 10 degrees)
          const currentBearing = vp.position?.bearing || 0;
          const newBearing = (currentBearing + (Math.random() - 0.5) * 20 + 360) % 360;

          // Simulate gradual random congestion level change
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

      setAlerts(prevAlerts => prevAlerts.filter(alert => {
        const now = Math.floor(Date.now() / 1000);
        const activePeriod = alert.active_period?.[0];
        return activePeriod && now >= (activePeriod.start || 0) && now <= (activePeriod.end || Infinity);
      }));
    }, 15000);

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
    // Prioritize GTFS route_type if available
    if (routeType === 3) return <Bus className="h-4 w-4 mr-1" />; // Bus
    if (routeType === 0) return <TramFront className="h-4 w-4 mr-1" />; // Tram
    if (routeType === 1) return <Info className="h-4 w-4 mr-1" />; // Subway (using generic info for now)
    
    // Fallback to routeId parsing if routeType is not explicit
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
        case 'IN_TRANSIT_TO': return 'Dalam Perjalanan';
        case 'STOPPED_AT_STATION': return 'Berhenti di Stasiun';
        case 'IN_VEHICLE_BAY': return 'Di Teluk Kendaraan';
        case 'AT_PLATFORM': return 'Di Platform';
        default: return status.replace(/_/g, ' ');
      }
    }
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
      case 'RUNNING_SMOOTHLY': return 'Lancar';
      case 'STOP_AND_GO': return 'Berhenti & Jalan';
      case 'CONGESTION': return 'Macet';
      case 'SEVERE_CONGESTION': return 'Macet Parah';
      case 'UNKNOWN_CONGESTION_LEVEL': return 'N/A';
      default: return 'N/A';
    }
  };

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
  const displayedTripUpdates = tripUpdates.slice(0, 3); // Limit to 3 for dashboard view

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
          <div className="space-y-2"> {/* Removed mb-4 */}
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center mb-2"> {/* Added mb-2 */}
              <AlertTriangle className="h-4 w-4 mr-2" /> Peringatan Aktif
            </h3>
            {alerts.map(alert => (
              <div key={alert.id} className="border-l-4 border-orange-500 pl-3 py-2 bg-orange-50/50 dark:bg-orange-900/20 rounded-r-md"> {/* Changed py-1 to py-2 */}
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

        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center mb-2"> {/* Added mb-2 */}
          <Car className="h-4 w-4 mr-2" /> Posisi Kendaraan
        </h3>
        {isLoadingRealtime ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Memuat posisi kendaraan...</p>
        ) : errorRealtime ? (
          <p className="text-red-500 text-center py-4">{errorRealtime}</p>
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
                    <MapPin className="h-4 w-4 mr-2" /> Lat: {vp.position?.latitude?.toFixed(4) || 'N/A'}, Lon: {vp.position?.longitude?.toFixed(4) || 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Update: {formatRelativeTime(vp.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="flex items-center">
                    <Gauge className="h-3 w-3 mr-1" /> Kecepatan: {vp.position?.speed ? `${vp.position.speed.toFixed(1)} km/h` : 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <TrafficCone className="h-3 w-3 mr-1" /> Kemacetan: <Badge className={getCongestionBadgeClass(vp.congestion_level)}>{formatCongestionLevel(vp.congestion_level)}</Badge>
                  </span>
                </div>
              </div>
            ))}
            {vehiclePositions.length > 5 && (
              <div className="text-center mt-4">
                <Button asChild variant="outline" className="">
                  <Link to="/all-vehicle-positions">
                    <span>Lihat Semua ({vehiclePositions.length - 5} lainnya)</span>
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada posisi kendaraan yang tersedia.</p>
        )}

        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center mb-2"> {/* Added mb-2 */}
          <Clock className="h-4 w-4 mr-2" /> Pembaruan Perjalanan
        </h3>
        {isLoadingRealtime ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Memuat pembaruan perjalanan...</p>
        ) : errorRealtime ? (
          <p className="text-red-500 text-center py-4">{errorRealtime}</p>
        ) : tripUpdates.length > 0 ? (
          <>
            {displayedTripUpdates.map(update => (
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
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <ListChecks className="h-3 w-3 mr-1" /> Seq: {update.stop_time_update?.[0]?.stop_sequence || 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> Stop ID: {update.stop_time_update?.[0]?.stop_id || 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Arr: {formatTime(update.stop_time_update?.[0]?.arrival?.time)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Dep: {formatTime(update.stop_time_update?.[0]?.departure?.time)}
                  </span>
                  <span className="flex items-center col-span-2">
                    <Clock className="h-3 w-3 mr-1" /> Update: {formatRelativeTime(update.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {tripUpdates.length > 3 && (
              <div className="text-center mt-4">
                <Button asChild variant="outline" className="">
                  <Link to="/all-trip-updates">
                    <span>Lihat Semua ({tripUpdates.length - 3} lainnya)</span>
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada pembaruan perjalanan yang tersedia.</p>
        )}

        {/* New section for Local GTFS Public Transport Routes */}
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center mb-2"> {/* Removed mt-6, added mb-2 */}
          <Route className="h-4 w-4 mr-2" /> Rute Transportasi Publik (Lokal GTFS)
        </h3>
        {isLoadingGtfs ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Memuat rute transportasi publik lokal...</p>
        ) : gtfsError ? (
          <p className="text-red-500 text-center py-4">Gagal memuat rute lokal: {gtfsError.message}</p>
        ) : transitlandRoutes && transitlandRoutes.length > 0 ? (
          <div className="space-y-3">
            {transitlandRoutes.slice(0, 5).map(route => ( // Display first 5 routes
              <div key={route.route_id} className="border-b last:border-b-0 pb-2 last:pb-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                    {getRouteTypeIcon(route.route_id, route.route_type)}
                    {route.route_short_name ? `${route.route_short_name} - ` : ''}{route.route_long_name || route.route_short_name || 'N/A'}
                  </h4>
                  <Badge variant="outline" className="text-xs capitalize">
                    {route.route_type === 0 ? 'Tram' : route.route_type === 1 ? 'Subway' : route.route_type === 3 ? 'Bus' : 'Lainnya'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                  {route.route_desc || `Operator: ${gtfsData?.agencies.find(a => a.agency_id === route.agency_id)?.agency_name || 'N/A'}`}
                </p>
              </div>
            ))}
            {transitlandRoutes.length > 5 && (
              <div className="text-center mt-4">
                <Button asChild variant="outline" className="">
                  <Link to="/all-gtfs-routes">
                    <span>Lihat Semua Rute ({transitlandRoutes.length - 5} lainnya)</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada rute transportasi publik yang tersedia dari data GTFS lokal.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimePublicTransport;