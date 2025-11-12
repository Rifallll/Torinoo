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

const parseSingleBinFile = async (path: string, type: string, FeedMessage: protobuf.Type): Promise<any[]> => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`Failed to fetch ${type}.bin from ${path}: ${response.statusText}.`);
      toast.warning(`Gagal mengambil file ${type}.bin. Pastikan file ada di folder public.`);
      return [];
    }
    const buffer = await response.arrayBuffer();
    
    // Add check for empty buffer
    if (buffer.byteLength === 0) {
      console.warn(`Fetched ${type}.bin from ${path} but it was empty.`);
      toast.warning(`File ${type}.bin kosong. Tidak ada data untuk diurai.`);
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
              start_date: new Date().toISOString().slice(0, 10).replace(/-/g, ''), // Set to current date in YYYYMMDD format
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
    // For 'trip_update' and 'alert', we will now completely suppress console.warn/toast.warning for parsing errors.
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