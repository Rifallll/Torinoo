"use client";

// This file contains mock data simulating GTFS-realtime TripUpdate and Alert feeds.
// In a real application, this data would be parsed from binary .bin files (Protobuf)
// fetched from a GTFS-realtime source.

export interface MockTripUpdate {
  id: string;
  tripId: string;
  routeId: string;
  startDate: string;
  startTime: string;
  vehicleId: string;
  currentStopSequence: number;
  currentStatus: 'IN_TRANSIT' | 'STOPPED_AT';
  delaySeconds: number; // Delay in seconds
  stopTimeUpdates: Array<{
    stopSequence: number;
    stopId: string;
    arrivalDelay: number; // Delay at this specific stop
    departureDelay: number;
  }>;
}

export interface MockAlert {
  id: string;
  activePeriod: {
    start: number; // Unix timestamp
    end: number;
  };
  cause: 'ACCIDENT' | 'CONSTRUCTION' | 'DEMONSTRATION' | 'MAINTENANCE' | 'WEATHER' | 'OTHER_CAUSE';
  effect: 'DETOUR' | 'NO_SERVICE' | 'REDUCED_SERVICE' | 'SIGNIFICANT_DELAYS' | 'STOP_MOVED' | 'OTHER_EFFECT';
  headerText: string;
  descriptionText: string;
  informedEntities: Array<{
    agencyId?: string;
    routeId?: string;
    routeType?: number; // e.g., 3 for bus, 0 for tram
    stopId?: string;
    tripId?: string;
  }>;
}

export const mockTripUpdates: MockTripUpdate[] = [
  {
    id: 'tu-1',
    tripId: 'trip-101-morning',
    routeId: '101',
    startDate: '20231111',
    startTime: '08:00:00',
    vehicleId: 'v-bus-001',
    currentStopSequence: 5,
    currentStatus: 'IN_TRANSIT',
    delaySeconds: 60, // 1 minute delay
    stopTimeUpdates: [
      { stopSequence: 5, stopId: 'stop-A', arrivalDelay: 60, departureDelay: 60 },
      { stopSequence: 6, stopId: 'stop-B', arrivalDelay: 75, departureDelay: 75 },
    ],
  },
  {
    id: 'tu-2',
    tripId: 'trip-004-day',
    routeId: '4',
    startDate: '20231111',
    startTime: '09:30:00',
    vehicleId: 'v-tram-004',
    currentStopSequence: 12,
    currentStatus: 'STOPPED_AT',
    delaySeconds: 180, // 3 minutes delay
    stopTimeUpdates: [
      { stopSequence: 12, stopId: 'stop-X', arrivalDelay: 180, departureDelay: 180 },
      { stopSequence: 13, stopId: 'stop-Y', arrivalDelay: 200, departureDelay: 200 },
    ],
  },
  {
    id: 'tu-3',
    tripId: 'trip-068-evening',
    routeId: '68',
    startDate: '20231111',
    startTime: '17:00:00',
    vehicleId: 'v-bus-002',
    currentStopSequence: 2,
    currentStatus: 'IN_TRANSIT',
    delaySeconds: -30, // 30 seconds early
    stopTimeUpdates: [
      { stopSequence: 2, stopId: 'stop-P', arrivalDelay: -30, departureDelay: -30 },
      { stopSequence: 3, stopId: 'stop-Q', arrivalDelay: -20, departureDelay: -20 },
    ],
  },
];

export const mockAlerts: MockAlert[] = [
  {
    id: 'alert-1',
    activePeriod: {
      start: Math.floor(Date.now() / 1000) - 3600, // Active from 1 hour ago
      end: Math.floor(Date.now() / 1000) + 7200, // Active for next 2 hours
    },
    cause: 'ACCIDENT',
    effect: 'SIGNIFICANT_DELAYS',
    headerText: 'Kecelakaan di Via Roma - Penundaan Signifikan',
    descriptionText: 'Kecelakaan multi-kendaraan di Via Roma dekat Piazza Castello menyebabkan penundaan parah pada jalur bus 101 dan 68. Harap gunakan rute alternatif.',
    informedEntities: [
      { routeId: '101', routeType: 3 }, // Bus
      { routeId: '68', routeType: 3 }, // Bus
      { stopId: 'stop-A' },
    ],
  },
  {
    id: 'alert-2',
    activePeriod: {
      start: Math.floor(Date.now() / 1000) + 86400, // Active starting tomorrow
      end: Math.floor(Date.now() / 1000) + 86400 * 3, // For 3 days
    },
    cause: 'CONSTRUCTION',
    effect: 'DETOUR',
    headerText: 'Pekerjaan Jalan di Corso Vittorio Emanuele II',
    descriptionText: 'Pekerjaan jalan yang dijadwalkan akan menyebabkan pengalihan rute untuk jalur trem 4 dan 15 mulai besok. Harap periksa jadwal yang diperbarui.',
    informedEntities: [
      { routeId: '4', routeType: 0 }, // Tram
      { routeId: '15', routeType: 0 }, // Tram
    ],
  },
];