"use client";

import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter, Bus, TramFront, Info } from 'lucide-react'; // Import icons for route types
import { toast } from 'sonner';

interface FilterDropdownsProps {
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  vehicleTypeFilter: string;
  setVehicleTypeFilter: (filter: string) => void;
  roadConditionFilter: string;
  setRoadConditionFilter: (filter: string) => void;
  gtfsRouteTypeFilter: string; // New prop for GTFS route type filter
  setGtfsRouteTypeFilter: (filter: string) => void; // New prop for GTFS route type setter
}

const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  timeFilter,
  setTimeFilter,
  vehicleTypeFilter,
  setVehicleTypeFilter,
  roadConditionFilter,
  setRoadConditionFilter,
  gtfsRouteTypeFilter, // Destructure new prop
  setGtfsRouteTypeFilter, // Destructure new prop
}) => {
  const applyFilter = (filterName: string, value: string) => {
    let message = `Filter '${filterName}' applied: ${value}`;
    toast.info(message);
  };

  const getRouteTypeLabel = (routeType: number) => {
    switch (routeType) {
      case 0: return 'Tram';
      case 1: return 'Subway';
      case 2: return 'Rail';
      case 3: return 'Bus';
      case 4: return 'Ferry';
      case 5: return 'Cable Car';
      case 6: return 'Gondola';
      case 7: return 'Funicular';
      default: return 'Lainnya';
    }
  };

  const getRouteTypeIcon = (routeType: number) => {
    switch (routeType) {
      case 0: return <TramFront className="h-4 w-4 mr-1" />;
      case 1: return <Info className="h-4 w-4 mr-1" />; // Using Info for Subway
      case 3: return <Bus className="h-4 w-4 mr-1" />;
      case 7: return <Info className="h-4 w-4 mr-1" />; // Using Info for Funicular
      default: return <Info className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="flex space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" /> Time
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="z-50">
          <DropdownMenuLabel>Time Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setTimeFilter('all'); applyFilter('Time', 'All'); }}>All</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTimeFilter('morning'); applyFilter('Time', 'Morning (06:00-10:00)'); }}>Morning (06:00-10:00)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTimeFilter('day'); applyFilter('Time', 'Day (10:00-17:00)'); }}>Day (10:00-17:00)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTimeFilter('evening'); applyFilter('Time', 'Evening (17:00-20:00)'); }}>Evening (17:00-20:00)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTimeFilter('night'); applyFilter('Time', 'Night (20:00-06:00)'); }}>Night (20:00-06:00)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" /> Vehicle Type
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="z-50">
          <DropdownMenuLabel>Vehicle Type Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('all'); applyFilter('Vehicle Type', 'All'); }}>All</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('car'); applyFilter('Vehicle Type', 'Car'); }}>Car</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('motorcycle'); applyFilter('Vehicle Type', 'Motorcycle'); }}>Motorcycle</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('bus'); applyFilter('Vehicle Type', 'Bus'); }}>Bus</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('truck'); applyFilter('Vehicle Type', 'Truck'); }}>Truck</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('tram'); applyFilter('Vehicle Type', 'Tram'); }}>Tram</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('subway'); applyFilter('Vehicle Type', 'Subway'); }}>Subway</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" /> Road Condition
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="z-50">
          <DropdownMenuLabel>Road Condition Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setRoadConditionFilter('all'); applyFilter('Road Condition', 'All'); }}>All</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setRoadConditionFilter('smooth'); applyFilter('Road Condition', 'Smooth'); }}>Smooth</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setRoadConditionFilter('moderate'); applyFilter('Road Condition', 'Moderate'); }}>Moderate</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setRoadConditionFilter('heavy'); applyFilter('Road Condition', 'Heavy'); }}>Heavy</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* New: GTFS Public Transport Type Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            {getRouteTypeIcon(parseInt(gtfsRouteTypeFilter))} GTFS Type
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="z-50">
          <DropdownMenuLabel>GTFS Route Type Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setGtfsRouteTypeFilter('all'); applyFilter('GTFS Type', 'All'); }}>
            <Info className="h-4 w-4 mr-1" /> All Types
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setGtfsRouteTypeFilter('3'); applyFilter('GTFS Type', 'Bus'); }}>
            <Bus className="h-4 w-4 mr-1" /> Bus
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setGtfsRouteTypeFilter('0'); applyFilter('GTFS Type', 'Tram'); }}>
            <TramFront className="h-4 w-4 mr-1" /> Tram
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setGtfsRouteTypeFilter('1'); applyFilter('GTFS Type', 'Subway'); }}>
            <Info className="h-4 w-4 mr-1" /> Subway
          </DropdownMenuItem>
          {/* Add more GTFS route types as needed based on your data */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterDropdowns;