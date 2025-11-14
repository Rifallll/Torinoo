"use client";

import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

interface FilterDropdownsProps {
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  vehicleTypeFilter: string;
  setVehicleTypeFilter: (filter: string) => void;
  roadConditionFilter: string;
  setRoadConditionFilter: (filter: string) => void;
}

const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  timeFilter,
  setTimeFilter,
  vehicleTypeFilter,
  setVehicleTypeFilter,
  roadConditionFilter,
  setRoadConditionFilter,
}) => {
  const applyFilter = (filterName: string, value: string) => {
    let message = `Filter '${filterName}' applied: ${value}`;
    toast.info(message);
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
    </div>
  );
};

export default FilterDropdowns;