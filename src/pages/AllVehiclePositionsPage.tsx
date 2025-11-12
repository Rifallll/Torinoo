"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bus, TramFront, Clock, MapPin, Info, Car, Gauge, ArrowRight, TrafficCone } from 'lucide-react'; // Replaced Speedometer with Gauge, Compass with ArrowRight
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parseGtfsRealtimeData, ParsedVehiclePosition } from '@/utils/gtfsRealtimeParser';

const AllVehiclePositionsPage: React.FC = () => {
  const [vehiclePositions, setVehiclePositionData] = useState<ParsedVehiclePosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndParseData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Only fetch vehicle positions for this page
      const data = await parseGtfsRealtimeData('/trip_update.bin', '/alerts.bin', '/vehicle_position.bin');
      setVehiclePositionData(data.vehiclePositions);
      console.log("[AllVehiclePositionsPage] Fetched Vehicle Positions:", data.vehiclePositions);
    } catch (err) {
      console.error("Failed to fetch or parse GTFS-realtime data:", err);
      setError("Gagal memuat atau mengurai data posisi kendaraan.");
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
      'UNKNOWN_CONGESTION_LEVEL',
      'RUNNING_SMOOTHLY',
      'STOP_AND_GO',
      'CONGESTION',
      'SEVERE_CONGESTION',
    ];

    // Simulate real-time updates for vehicle positions
    const interval = setInterval(() => {
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

          // Simulate speed change (e.g., +/- 5 km/h, min 0, max 80)
          const currentSpeed = vp.position?.speed || 0;
          const newSpeed = Math.max(0, Math.min(80, currentSpeed + (Math.random() - 0.5) * 10)); // +/- 10 m/s (approx 36 km/h)

          // Simulate bearing change (e.g., +/- 10 degrees)
          const currentBearing = vp.position?.bearing || 0;
          const newBearing = (currentBearing + (Math.random() - 0.5) * 20 + 360) % 360;

          // Simulate gradual random congestion level change
          const currentCongestionIndex = congestionLevels.indexOf(vp.congestion_level || 'UNKNOWN_CONGESTION_LEVEL');
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
      case 'UNKNOWN_CONGESTION_LEVEL': return 'Tidak Diketahui';
      default: return congestionLevel.replace(/_/g, ' ');
    }
  };

  // Sort vehicle positions to prioritize 'EMPTY' occupancy status
  const sortedVehiclePositions = [...vehiclePositions].sort((a, b) => {
    if (a.occupancy_status === 'EMPTY' && b.occupancy_status !== 'EMPTY') {
      return -1;
    }
    if (a.occupancy_status !== 'EMPTY' && b.occupancy_status === 'EMPTY') {
      return 1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Car className="h-8 w-8 mr-3 text-indigo-600" />
          Semua Posisi Kendaraan Real-Time
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
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">Memuat semua posisi kendaraan...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-4 col-span-full">{error}</p>
        ) : sortedVehiclePositions.length > 0 ? (
          sortedVehiclePositions.map(vp => (
            <Card key={vp.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  {getRouteTypeIcon(vp.trip?.route_id)}
                  Jalur {vp.trip?.route_id || vp.vehicle?.label || vp.id}
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
                    <Gauge className="h-4 w-4 mr-2" /> Kecepatan: {vp.position?.speed ? `${vp.position.speed.toFixed(1)} km/h` : 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2" /> Arah: {vp.position?.bearing ? `${vp.position.bearing.toFixed(0)}°` : 'N/A'}
                  </span>
                  <span className="flex items-center col-span-2">
                    <TrafficCone className="h-4 w-4 mr-2" /> Kemacetan: <Badge className={getCongestionBadgeClass(vp.congestion_level)}>{formatCongestionLevel(vp.congestion_level)}</Badge>
                  </span>
                  <span className="flex items-center col-span-2">
                    <Car className="h-4 w-4 mr-2" /> Plat: {vp.vehicle?.license_plate || 'N/A'}
                  </span>
                  <span className="flex items-center col-span-2">
                    <Clock className="h-4 w-4 mr-2" /> Update: {formatTimestamp(vp.timestamp)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">Tidak ada posisi kendaraan yang tersedia.</p>
        )}
      </main>
    </div>
  );
};

export default AllVehiclePositionsPage;