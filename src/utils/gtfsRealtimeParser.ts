"use client";

import * as protobuf from 'protobufjs';
import { toast } from 'sonner';

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

// Mock data for Trip Updates
const mockTripUpdates: ParsedTripUpdate[] = [
  {
    id: 'mock-tu-1',
    trip: { trip_id: 'T101', route_id: '4', start_time: '08:00:00', start_date: '20231115' },
    vehicle: { id: 'V101', label: 'Tram 4' },
    stop_time_update: [
      { stop_sequence: 1, stop_id: 'S001', arrival: { delay: 120, time: Math.floor(Date.now() / 1000) + 120 }, departure: { delay: 120, time: Math.floor(Date.now() / 1000) + 150 } },
    ],
    timestamp: Math.floor(Date.now() / 1000),
    delay: 120,
  },
  {
    id: 'mock-tu-2',
    trip: { trip_id: 'B205', route_id: '68', start_time: '09:15:00', start_date: '20231115' },
    vehicle: { id: 'V205', label: 'Bus 68' },
    stop_time_update: [
      { stop_sequence: 5, stop_id: 'S010', arrival: { delay: -60, time: Math.floor(Date.now() / 1000) - 60 }, departure: { delay: -60, time: Math.floor(Date.now() / 1000) - 30 } },
    ],
    timestamp: Math.floor(Date.now() / 1000),
    delay: -60,
  },
  {
    id: 'mock-tu-3',
    trip: { trip_id: 'M301', route_id: 'M1', start_time: '10:00:00', start_date: '20231115' },
    vehicle: { id: 'V301', label: 'Metro M1' },
    stop_time_update: [
      { stop_sequence: 3, stop_id: 'S020', arrival: { delay: 0, time: Math.floor(Date.now() / 1000) + 30 }, departure: { delay: 0, time: Math.floor(Date.now() / 1000) + 60 } },
    ],
    timestamp: Math.floor(Date.now() / 1000),
    delay: 0,
  },
];

// Mock data for Alerts
const mockAlerts: ParsedAlert[] = [
  {
    id: 'mock-alert-1',
    active_period: [{ start: Math.floor(Date.now() / 1000) - 3600, end: Math.floor(Date.now() / 1000) + 7200 }],
    informed_entity: [{ route_id: '4', route_type: 0 }], // Tram
    cause: 'CONSTRUCTION',
    effect: 'DETOUR',
    header_text: { translation: [{ text: 'Penutupan Jalur Trem 4', language: 'id' }] },
    description_text: { translation: [{ text: 'Jalur trem 4 dialihkan karena pekerjaan konstruksi di Via Po. Harap gunakan rute alternatif.', language: 'id' }] },
  },
  {
    id: 'mock-alert-2',
    active_period: [{ start: Math.floor(Date.now() / 1000) - 1800, end: Math.floor(Date.now() / 1000) + 3600 }],
    informed_entity: [{ route_id: '68', route_type: 3 }], // Bus
    cause: 'ACCIDENT',
    effect: 'STOP_MOVED',
    header_text: { translation: [{ text: 'Perubahan Halte Bus 68', language: 'id' }] },
    description_text: { translation: [{ text: 'Halte bus sementara di Piazza Castello dipindahkan 50 meter ke selatan karena insiden.', language: 'id' }] },
  },
];

const parseSingleBinFile = async (path: string, type: string, FeedMessage: protobuf.Type): Promise<any[]> => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`Failed to fetch ${type}.bin from ${path}: ${response.statusText}.`);
      toast.warning(`Gagal mengambil file ${type}.bin. Pastikan file ada di folder public.`);
      // Return mock data if fetch fails for trip_update or alert
      if (type === 'trip_update') return mockTripUpdates;
      if (type === 'alert') return mockAlerts;
      return [];
    }
    const buffer = await response.arrayBuffer();
    
    // Add check for empty buffer
    if (buffer.byteLength === 0) {
      console.warn(`Fetched ${type}.bin from ${path} but it was empty.`);
      toast.warning(`File ${type}.bin kosong. Tidak ada data untuk diurai.`);
      // Return mock data if file is empty for trip_update or alert
      if (type === 'trip_update') return mockTripUpdates;
      if (type === 'alert') return mockAlerts;
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
    console.error(`Error parsing ${type}.bin from ${path}:`, error);
    toast.error(`Gagal mengurai data ${type}.bin: ${error instanceof Error ? error.message : String(error)}. File mungkin rusak atau tidak dalam format Protobuf yang benar.`);
    // Return mock data if parsing fails for trip_update or alert
    if (type === 'trip_update') return mockTripUpdates;
    if (type === 'alert') return mockAlerts;
    return [];
  }
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

  const tripUpdates = await parseSingleBinFile(tripUpdateBinPath, 'trip_update', FeedMessage);
  const vehiclePositions = await parseSingleBinFile(vehiclePositionBinPath, 'vehicle_position', FeedMessage);
  const alerts = await parseSingleBinFile(alertBinPath, 'alert', FeedMessage);

  if (tripUpdates.length > 0 || vehiclePositions.length > 0 || alerts.length > 0) {
    toast.success("Data GTFS-realtime berhasil diurai!");
  } else {
    toast.info("Tidak ada data GTFS-realtime yang ditemukan di file yang diunggah atau diurai.");
  }
  
  return { tripUpdates, vehiclePositions, alerts };
};