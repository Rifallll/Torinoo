"use client";

import * as protobuf from 'protobufjs';
import { toast } from 'sonner';

// Define interfaces for the parsed data based on the .proto schema
export interface ParsedTripUpdate {
  id: string;
  trip: {
    trip_id?: string;
    route_id?: string;
    start_date?: string;
    start_time?: string;
  };
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
  trip?: { // TripDescriptor is nested inside VehiclePosition
    trip_id?: string;
    route_id?: string;
    start_date?: string;
    start_time?: string;
  };
  vehicle?: { // VehicleDescriptor is nested inside VehiclePosition
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
  current_status?: string; // Enum string
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
    const message = FeedMessage.decode(new Uint8Array(buffer));
    const payload = FeedMessage.toObject(message, {
      longs: Number, // Ensure timestamps are numbers
      enums: String, // Ensure enums are strings
      bytes: String,
    });

    const entities: any[] = [];
    if (payload.entity) {
      for (const entity of payload.entity) {
        if (type === 'trip_update' && entity.tripUpdate) {
          entities.push({ id: entity.id, ...entity.tripUpdate } as ParsedTripUpdate);
        } else if (type === 'vehicle_position' && entity.vehicle) {
          // Corrected: entity.vehicle itself is the VehiclePosition object,
          // which should already contain nested 'trip' and 'vehicle' descriptors.
          entities.push({ id: entity.id, ...entity.vehicle } as ParsedVehiclePosition);
        } else if (type === 'alert' && entity.alert) {
          entities.push({ id: entity.id, ...entity.alert } as ParsedAlert);
        }
      }
    }

    // Add detailed logging for vehicle_position to aid debugging
    if (type === 'vehicle_position') {
      console.log(`[GTFS Parser] Raw payload for ${path}:`, payload);
      console.log(`[GTFS Parser] Extracted vehicle positions for ${path}:`, entities);
    }

    return entities;
  } catch (error) {
    console.error(`Error parsing ${type}.bin from ${path}:`, error);
    toast.error(`Gagal mengurai data ${type}.bin: ${error instanceof Error ? error.message : String(error)}`);
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