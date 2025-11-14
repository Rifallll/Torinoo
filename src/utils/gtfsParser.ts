"use client";

import Papa from 'papaparse';
import { toast } from 'sonner';

// Define interfaces for GTFS data
export interface GtfsAgency {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang?: string;
  agency_phone?: string;
  agency_fare_url?: string;
  agency_email?: string;
}

export interface GtfsRoute {
  route_id: string;
  agency_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc?: string;
  route_type: number; // 0: Tram, 1: Subway, 2: Rail, 3: Bus, 4: Ferry, 5: Cable car, 6: Gondola, 7: Funicular
  route_url?: string;
  route_color?: string;
  route_text_color?: string;
  route_sort_order?: number;
  continuous_pickup?: number;
  continuous_dropoff?: number;
}

export interface GtfsStop {
  stop_id: string;
  stop_code?: string;
  stop_name: string;
  stop_desc?: string;
  stop_lat: number;
  stop_lon: number;
  zone_id?: string;
  stop_url?: string;
  location_type?: number; // 0: Stop, 1: Station, 2: Entrance/Exit, 3: Generic Node, 4: Boarding Area
  parent_station?: string;
  stop_timezone?: string;
  wheelchair_boarding?: number;
  level_id?: string;
  platform_code?: string;
}

export interface GtfsTrip {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign?: string;
  trip_short_name?: string;
  direction_id?: number; // 0: travel in one direction, 1: travel in opposite direction
  block_id?: string;
  shape_id?: string;
  wheelchair_accessible?: number;
  bikes_allowed?: number;
}

export interface GtfsStopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: number;
  stop_headsign?: string;
  pickup_type?: number;
  drop_off_type?: number;
  shape_dist_traveled?: number;
  timepoint?: number;
}

export interface GtfsCalendar {
  service_id: string;
  monday: 0 | 1;
  tuesday: 0 | 1;
  wednesday: 0 | 1;
  thursday: 0 | 1;
  friday: 0 | 1;
  saturday: 0 | 1;
  sunday: 0 | 1;
  start_date: string; // YYYYMMDD
  end_date: string; // YYYYMMDD
}

export interface GtfsCalendarDate {
  service_id: string;
  date: string; // YYYYMMDD
  exception_type: 1 | 2; // 1: Service has been added, 2: Service has been removed
}

export interface GtfsShape {
  shape_id: string;
  shape_pt_lat: number;
  shape_pt_lon: number;
  shape_pt_sequence: number;
  shape_dist_traveled?: number;
}

export interface ParsedGtfsData {
  agencies: GtfsAgency[];
  routes: GtfsRoute[];
  stops: GtfsStop[];
  trips: GtfsTrip[];
  stopTimes: GtfsStopTime[];
  calendar: GtfsCalendar[];
  calendarDates: GtfsCalendarDate[];
  shapes: GtfsShape[];
}

const parseCsv = async <T>(filePath: string): Promise<T[]> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      console.warn(`Failed to fetch ${filePath}: ${response.statusText}`);
      return [];
    }
    const csvText = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically convert numbers, booleans, etc.
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error(`Errors parsing ${filePath}:`, results.errors);
            toast.error(`Failed to parse GTFS file ${filePath.split('/').pop()}: ${results.errors[0].message}`);
            reject(new Error(`Parsing error in ${filePath}`));
          }
          resolve(results.data as T[]);
        },
        error: (error: Error) => {
          console.error(`Error reading ${filePath}:`, error);
          toast.error(`An error occurred while reading GTFS file ${filePath.split('/').pop()}: ${error.message}`);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
    // Only show toast for critical files like routes/stops if they fail
    if (filePath.includes('routes.txt') || filePath.includes('stops.txt')) {
      toast.error(`Failed to load GTFS file ${filePath.split('/').pop()}.`);
    }
    return [];
  }
};

export const loadGtfsData = async (): Promise<ParsedGtfsData> => {
  const [agencies, routes, stops, trips, stopTimes, calendar, calendarDates, shapes] = await Promise.all([
    parseCsv<GtfsAgency>('/gtt_gtfs/agency.txt'),
    parseCsv<GtfsRoute>('/gtt_gtfs/routes.txt'),
    parseCsv<GtfsStop>('/gtt_gtfs/stops.txt'),
    parseCsv<GtfsTrip>('/gtt_gtfs/trips.txt'),
    parseCsv<GtfsStopTime>('/gtt_gtfs/stop_times.txt'),
    parseCsv<GtfsCalendar>('/gtt_gtfs/calendar.txt'),
    parseCsv<GtfsCalendarDate>('/gtt_gtfs/calendar_dates.txt'),
    parseCsv<GtfsShape>('/gtt_gtfs/shapes.txt'),
    // Add other GTFS files here as needed
  ]);

  toast.success("Local GTFS data loaded successfully!");
  console.log("GTFS Data Loaded:", { agencies, routes, stops, trips, stopTimes, calendar, calendarDates, shapes });

  return { agencies, routes, stops, trips, stopTimes, calendar, calendarDates, shapes };
};