"use client";

import * as protobuf from 'protobufjs';
import { toast } from 'sonner';
import { Bus, TramFront, Info, TrafficCone, CheckCircle2, Clock } from 'lucide-react';
import React from 'react'; // Import React for JSX icons

// Define interfaces for the parsed data based on the .proto schema
export interface ParsedTripDescriptor {
  trip_id?: string;
  route_id?: string;
  direction_id?: number;
  start_time?: string;
  start_date?: string;
}

export interface ParsedTripUpdate {
  id: string;
  trip: ParsedTripDescriptor;
  vehicle?: {
    id?: string;
    label?: string;
  };
  stop_time_update: Array<{
    stop_sequence?: number;
    stop_id?: string;
    arrival?: { delay?: number; time?: number };
    departure?: { delay?: number; time?: number };
  }>;
  timestamp?: number;
  delay?: number; // DEPRECATED, but might be present
}

export interface ParsedVehiclePosition {
  id: string;
  trip?: ParsedTripDescriptor;
  vehicle?: {
    id?: string;
    label?: string;
    license_plate?: string;
  };
  position?: {
    latitude?: number;
    longitude?: number;
    bearing?: number;
    speed?: number;
  };
  current_stop_sequence?: number;
  stop_id?: string;
  current_status?: string; // Enum string, made optional as it might be missing
  timestamp?: number;
  congestion_level?: string; // Enum string
  occupancy_status?: string; // Enum string
}

export interface ParsedAlert {
  id: string;
  active_period?: Array<{ start?: number; end?: number }>;
  informed_entity?: Array<{
    agency_id?: string;
    route_id?: string;
    route_type?: number;
    stop_id?: string;
    trip?: { trip_id?: string; route_id?: string };
  }>;
  cause?: string;
  effect?: string;
  header_text?: { translation: Array<{ text: string; language?: string }> };
  description_text?: { translation: Array<{ text: string; language?: string }> };
}

interface ParsedGtfsRealtimeData {
  tripUpdates: ParsedTripUpdate[];
  vehiclePositions: ParsedVehiclePosition[];
  alerts: ParsedAlert[];
}

let root: protobuf.Root | null = null;
let FeedMessage: protobuf.Type | null = null;

const loadProto = async () => {
  if (root && FeedMessage) {
    return; // Already loaded
  }
  try {
    root = await protobuf.load('/src/proto/gtfs-realtime.proto');
    FeedMessage = root.lookupType('transit_realtime.FeedMessage');
    console.log("GTFS-realtime .proto loaded successfully.");
  } catch (error) {
    console.error("Failed to load GTFS-realtime .proto:", error);
    toast.error("Gagal memuat definisi Protobuf GTFS-realtime.");
    throw error;
  }
};

const parseSingleBinFile = async (path: string, type: string, FeedMessage: protobuf.Type): Promise<any[]> => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`Failed to fetch ${type}.bin from ${path}: ${response.statusText}.`);
      // Suppress toast for missing trip_update and alert files, as we'll provide dummy data
      if (type === 'vehicle_position') {
        toast.warning(`Gagal mengambil file ${type}.bin. Pastikan file ada di folder public.`);
      }
      return [];
    }
    const buffer = await response.arrayBuffer();
    
    // Add check for empty buffer
    if (buffer.byteLength === 0) {
      console.warn(`Fetched ${type}.bin from ${path} but it was empty.`);
      // Suppress toast for empty trip_update and alert files
      if (type === 'vehicle_position') {
        toast.warning(`File ${type}.bin kosong. Tidak ada data untuk diurai.`);
      }
      return [];
    }

    const message = FeedMessage.decode(new Uint8Array(buffer));
    const payload = FeedMessage.toObject(message, {
      longs: Number, // Ensure timestamps are numbers
      enums: String, // Ensure enums are strings
      bytes: String,
      oneofs: true, // Include oneof fields
    });

    const entities: any[] = [];
    if (payload.entity) {
      for (const entity of payload.entity) {
        if (type === 'trip_update' && entity.tripUpdate) {
          entities.push({ id: entity.id, ...entity.tripUpdate } as ParsedTripUpdate);
        } else if (type === 'vehicle_position' && entity.vehicle) {
          const rawVehiclePosition = entity.vehicle;
          const rawTrip = rawVehiclePosition.trip;

          // Remap the non-standard fields from the provided JSON snippet
          const remappedTrip: ParsedTripDescriptor = {
              trip_id: rawTrip?.tripId,
              route_id: rawTrip?.startDate, // Assuming raw `startDate` is the actual route ID (e.g., "10U")
              start_time: rawTrip?.routeId, // Assuming raw `routeId` is the actual start time (e.g., "08:31:00")
              start_date: rawTrip?.directionId, // Reverted to use raw `directionId` for start_date
              // direction_id is not clearly available as a number, leave undefined for now
          };

          entities.push({
              id: entity.id,
              trip: remappedTrip,
              vehicle: rawVehiclePosition.vehicle,
              position: rawVehiclePosition.position,
              timestamp: rawVehiclePosition.timestamp,
              occupancy_status: rawVehiclePosition.occupancyStatus,
              current_stop_sequence: rawVehiclePosition.currentStopSequence,
              stop_id: rawVehiclePosition.stopId,
              current_status: rawVehiclePosition.currentStatus || 'UNKNOWN_STOP_STATUS', // Default if missing
              congestion_level: rawVehiclePosition.congestionLevel,
          } as ParsedVehiclePosition);
        } else if (type === 'alert' && entity.alert) {
          entities.push({ id: entity.id, ...entity.alert } as ParsedAlert);
        }
      }
    }
    return entities;
  } catch (error) {
    // Only log/toast critical errors for vehicle_position.
    // For trip_update and alert, suppress console output for parsing errors.
    if (type === 'vehicle_position') {
      console.error(`Error parsing ${type}.bin from ${path}:`, error);
      toast.error(`Gagal mengurai data ${type}.bin: ${error instanceof Error ? error.message : String(error)}. File mungkin rusak atau tidak dalam format Protobuf yang benar.`);
    }
    return [];
  }
};

/**
 * Formats a timestamp into a relative time string (e.g., "just now", "5 minutes ago").
 * @param timestamp The timestamp in seconds since epoch.
 * @returns A relative time string or 'N/A'.
 */
export const formatRelativeTime = (timestamp?: number | string) => {
  if (timestamp === undefined || timestamp === null) return 'N/A';
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(numTimestamp)) return 'Tanggal Tidak Valid';

  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const secondsAgo = now - numTimestamp;

  if (secondsAgo < 0) return 'Di masa depan'; // Should not happen for "last updated"
  if (secondsAgo < 10) return 'Baru saja';
  if (secondsAgo < 60) return `${secondsAgo} detik lalu`;
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo} menit lalu`;

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} jam lalu`;

  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} hari lalu`;
};

/**
 * Formats a timestamp into a local time string (e.g., "03:04 PM").
 * @param timestamp The timestamp in seconds since epoch.
 * @returns A local time string or 'N/A'.
 */
export const formatTime = (timestamp?: number) => {
  if (timestamp === undefined) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const parseGtfsRealtimeData = async (
  tripUpdateBinPath: string,
  alertBinPath: string,
  vehiclePositionBinPath: string
): Promise<ParsedGtfsRealtimeData> => {
  await loadProto();

  if (!FeedMessage) {
    throw new Error("FeedMessage type not loaded from .proto.");
  }

  let tripUpdates = await parseSingleBinFile(tripUpdateBinPath, 'trip_update', FeedMessage);
  let vehiclePositions = await parseSingleBinFile(vehiclePositionBinPath, 'vehicle_position', FeedMessage);
  let alerts = await parseSingleBinFile(alertBinPath, 'alert', FeedMessage);

  // Generate dummy data if actual data is empty
  if (tripUpdates.length === 0) {
    const now = Math.floor(Date.now() / 1000);
    tripUpdates = [
      {
        id: 'dummy-trip-1',
        trip: {
          trip_id: '12345',
          route_id: 'BUS-A',
          direction_id: 0,
          start_time: '08:00:00',
          start_date: '20231115',
        },
        stop_time_update: [
          {
            stop_sequence: 1,
            stop_id: 'STOP-101',
            arrival: { delay: 60, time: now + 60 }, // 1 min delay
            departure: { delay: 60, time: now + 60 },
          },
        ],
        timestamp: now,
        delay: 60,
      },
      {
        id: 'dummy-trip-2',
        trip: {
          trip_id: '67890',
          route_id: 'TRAM-4',
          direction_id: 1,
          start_time: '09:15:00',
          start_date: '20231115',
        },
        stop_time_update: [
          {
            stop_sequence: 5,
            stop_id: 'STOP-205',
            arrival: { delay: -30, time: now - 30 }, // 30 sec early
            departure: { delay: -30, time: now - 30 },
          },
        ],
        timestamp: now,
        delay: -30,
      },
    ];
    toast.info("Menggunakan data dummy untuk Pembaruan Perjalanan.");
  }

  if (alerts.length === 0) {
    const now = Math.floor(Date.now() / 1000);
    alerts = [
      {
        id: 'dummy-alert-1',
        active_period: [{ start: now - 3600, end: now + 3600 }], // Active for 1 hour before and after now
        informed_entity: [{ route_id: 'BUS-A', route_type: 3 }], // Bus route
        cause: 'ACCIDENT',
        effect: 'DETOUR',
        header_text: { translation: [{ text: 'Jalur BUS-A dialihkan karena kecelakaan', language: 'id' }] },
        description_text: { translation: [{ text: 'Kecelakaan di Via Roma menyebabkan pengalihan jalur BUS-A. Harap gunakan rute alternatif.', language: 'id' }] },
      },
      {
        id: 'dummy-alert-2',
        active_period: [{ start: now - 1800, end: now + 7200 }], // Active for 30 min before and 2 hours after now
        informed_entity: [{ route_id: 'TRAM-4', route_type: 0 }], // Tram route
        cause: 'MAINTENANCE',
        effect: 'STOP_MOVED',
        header_text: { translation: [{ text: 'Perbaikan Jalur TRAM-4, halte sementara dipindahkan', language: 'id' }] },
        description_text: { translation: [{ text: 'Perbaikan mendesak di jalur TRAM-4. Halte di Piazza Castello dipindahkan 50m ke utara.', language: 'id' }] },
      },
    ];
    toast.info("Menggunakan data dummy untuk Peringatan.");
  }

  if (tripUpdates.length > 0 || vehiclePositions.length > 0 || alerts.length > 0) {
    toast.success("Data GTFS-realtime berhasil diurai atau data dummy dimuat!");
  } else {
    toast.info("Tidak ada data GTFS-realtime yang ditemukan di file yang diunggah atau diurai.");
  }
  
  return { tripUpdates, vehiclePositions, alerts };
};

// Utility functions moved from RealtimePublicTransport.tsx
export const formatDelay = (delaySeconds: number | undefined) => {
  if (delaySeconds === undefined || delaySeconds === 0) return 'Tepat Waktu';
  const minutes = Math.abs(Math.round(delaySeconds / 60));
  if (delaySeconds > 0) return `${minutes} mnt Terlambat`;
  return `${minutes} mnt Lebih Awal`;
};

export const getDelayBadgeClass = (delaySeconds: number | undefined) => {
  if (delaySeconds === undefined) return "bg-gray-100 text-gray-600 hover:bg-gray-100";
  if (delaySeconds > 120) return "bg-red-100 text-red-600 hover:bg-red-100";
  if (delaySeconds > 0) return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100";
  if (delaySeconds < 0) return "bg-green-100 text-green-600 hover:bg-green-100";
  return "bg-gray-100 text-gray-600 hover:bg-gray-100";
};

export const getRouteTypeIcon = (routeId?: string, routeType?: number) => {
  // Prioritize GTFS route_type if available
  if (routeType === 3) return (<Bus className="h-4 w-4 mr-1" />); // Bus
  if (routeType === 0) return (<TramFront className="h-4 w-4 mr-1" />); // Tram
  if (routeType === 1) return (<Info className="h-4 w-4 mr-1" />); // Subway (using generic info for now)
  
  // Fallback to routeId parsing if routeType is not explicit
  if (routeId) {
    if (routeId.includes('B') || routeId === '101' || routeId === '68') return (<Bus className="h-4 w-4 mr-1" />);
    if (routeId.includes('T') || routeId === '4' || routeId === '15') return (<TramFront className="h-4 w-4 mr-1" />);
    if (routeId.endsWith('U')) return (<Bus className="h-4 w-4 mr-1" />);
  }
  return (<Info className="h-4 w-4 mr-1" />);
};

export const getVehicleStatus = (status: string | undefined, occupancyStatus: string | undefined) => {
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

export const getCongestionBadgeClass = (congestionLevel: string | undefined) => {
  switch (congestionLevel) {
    case 'RUNNING_SMOOTHLY': return 'bg-green-100 text-green-600 hover:bg-green-100';
    case 'STOP_AND_GO': return 'bg-yellow-100 text-yellow-600 hover:bg-yellow-100';
    case 'CONGESTION': return 'bg-orange-100 text-orange-600 hover:bg-orange-100';
    case 'SEVERE_CONGESTION': return 'bg-red-100 text-red-600 hover:bg-red-100';
    case 'UNKNOWN_CONGESTION_LEVEL': return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
    default: return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
  }
};

export const formatCongestionLevel = (congestionLevel: string | undefined) => {
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