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
  trip?: { // Make trip optional as it might not always be present or fully populated
    trip_id?: string;
    route_id?: string;
    start_date?: string;
    start_time?: string;
  };
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

export const parseGtfsRealtimeData = async (
  tripUpdateBinPath: string,
  alertBinPath: string,
  vehiclePositionBinPath: string // Added vehiclePositionBinPath
): Promise<ParsedGtfsRealtimeData> => {
  await loadProto();

  if (!FeedMessage) {
    throw new Error("FeedMessage type not loaded from .proto.");
  }

  const tripUpdates: ParsedTripUpdate[] = [];
  const vehiclePositions: ParsedVehiclePosition[] = [];
  const alerts: ParsedAlert[] = [];

  try {
    // Fetch and parse TripUpdate data
    const tripUpdateResponse = await fetch(tripUpdateBinPath);
    if (!tripUpdateResponse.ok) {
      console.warn(`Failed to fetch trip_update.bin: ${tripUpdateResponse.statusText}. Continuing without trip updates.`);
    } else {
      const tripUpdateBuffer = await tripUpdateResponse.arrayBuffer();
      const tripUpdateMessage = FeedMessage.decode(new Uint8Array(tripUpdateBuffer));
      const tripUpdatePayload = FeedMessage.toObject(tripUpdateMessage, {
        longs: String,
        enums: String,
        bytes: String,
      });

      if (tripUpdatePayload.entity) {
        for (const entity of tripUpdatePayload.entity) {
          if (entity.tripUpdate) {
            tripUpdates.push({ id: entity.id, ...entity.tripUpdate } as ParsedTripUpdate);
          }
        }
      }
    }

    // Fetch and parse VehiclePosition data
    const vehiclePositionResponse = await fetch(vehiclePositionBinPath);
    if (!vehiclePositionResponse.ok) {
      console.warn(`Failed to fetch vehicle_position.bin: ${vehiclePositionResponse.statusText}. Continuing without vehicle positions.`);
    } else {
      const vehiclePositionBuffer = await vehiclePositionResponse.arrayBuffer();
      const vehiclePositionMessage = FeedMessage.decode(new Uint8Array(vehiclePositionBuffer));
      const vehiclePositionPayload = FeedMessage.toObject(vehiclePositionMessage, {
        longs: String,
        enums: String,
        bytes: String,
      });

      if (vehiclePositionPayload.entity) {
        for (const entity of vehiclePositionPayload.entity) {
          if (entity.vehicle) {
            vehiclePositions.push({ id: entity.id, ...entity.vehicle } as ParsedVehiclePosition);
          }
        }
      }
    }

    // Fetch and parse Alert data
    const alertResponse = await fetch(alertBinPath);
    if (!alertResponse.ok) {
      console.warn(`Failed to fetch alerts.bin: ${alertResponse.statusText}. Continuing without alerts.`);
    } else {
      const alertBuffer = await alertResponse.arrayBuffer();
      const alertMessage = FeedMessage.decode(new Uint8Array(alertBuffer));
      const alertPayload = FeedMessage.toObject(alertMessage, {
        longs: String,
        enums: String,
        bytes: String,
      });

      if (alertPayload.entity) {
        for (const entity of alertPayload.entity) {
          if (entity.alert) {
            alerts.push({ id: entity.id, ...entity.alert } as ParsedAlert);
          }
        }
      }
    }

    if (tripUpdates.length > 0 || vehiclePositions.length > 0 || alerts.length > 0) {
      toast.success("Data GTFS-realtime berhasil diurai!");
    } else {
      toast.info("Tidak ada data GTFS-realtime yang ditemukan di file yang diunggah.");
    }
    
    return { tripUpdates, vehiclePositions, alerts };

  } catch (error) {
    console.error("Error parsing GTFS-realtime data:", error);
    toast.error(`Gagal mengurai data GTFS-realtime: ${error instanceof Error ? error.message : String(error)}`);
    return { tripUpdates: [], vehiclePositions: [], alerts: [] }; // Return empty on error
  }
};