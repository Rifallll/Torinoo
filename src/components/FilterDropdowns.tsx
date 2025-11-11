"use client";

import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

const FilterDropdowns: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');
  const [roadConditionFilter, setRoadConditionFilter] = useState<string>('all');

  const applyFilter = (filterName: string, value: string) => {
    let message = `Filter '${filterName}' diterapkan: ${value}`;
    toast.info(message);
  };

  return (
    <div className="flex space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" /> Waktu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter Waktu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setTimeFilter('all'); applyFilter('Waktu', 'Semua'); }}>Semua</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTimeFilter('morning'); applyFilter('Waktu', 'Pagi (06:00-10:00)'); }}>Pagi (06:00-10:00)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTimeFilter('day'); applyFilter('Waktu', 'Siang (10:00-17:00)'); }}>Siang (10:00-17:00)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTimeFilter('evening'); applyFilter('Waktu', 'Sore (17:00-20:00)'); }}>Sore (17:00-20:00)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTimeFilter('night'); applyFilter('Waktu', 'Malam (20:00-06:00)'); }}>Malam (20:00-06:00)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" /> Kendaraan
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter Jenis Kendaraan</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('all'); applyFilter('Jenis Kendaraan', 'Semua'); }}>Semua</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('car'); applyFilter('Jenis Kendaraan', 'Mobil'); }}>Mobil</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('motorcycle'); applyFilter('Jenis Kendaraan', 'Motor'); }}>Motor</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('bus'); applyFilter('Jenis Kendaraan', 'Bus'); }}>Bus</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setVehicleTypeFilter('truck'); applyFilter('Jenis Kendaraan', 'Truk'); }}>Truk</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" /> Kondisi Jalan
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter Kondisi Jalan</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setRoadConditionFilter('all'); applyFilter('Kondisi Jalan', 'Semua'); }}>Semua</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setRoadConditionFilter('smooth'); applyFilter('Kondisi Jalan', 'Lancar'); }}>Lancar</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setRoadConditionFilter('moderate'); applyFilter('Kondisi Jalan', 'Padat'); }}>Padat</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setRoadConditionFilter('heavy'); applyFilter('Kondisi Jalan', 'Macet'); }}>Macet</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterDropdowns;