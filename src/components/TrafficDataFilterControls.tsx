"use client";

import React, { useState, useMemo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XCircle, Filter } from 'lucide-react';
import { TrafficDataRow } from '@/contexts/TrafficDataContext';

interface TrafficDataFilterControlsProps {
  data: TrafficDataRow[];
  children: (filteredData: TrafficDataRow[]) => ReactNode;
}

const TrafficDataFilterControls: React.FC<TrafficDataFilterControlsProps> = ({ data, children }) => {
  const [dayOfWeekFilter, setDayOfWeekFilter] = useState<string>('all');
  const [timeOfDayFilter, setTimeOfDayFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const uniqueDaysOfWeek = useMemo(() => {
    const days = new Set(data.map(row => row.day_of_week));
    return ['all', ...Array.from(days).sort((a, b) => {
      const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return order.indexOf(a) - order.indexOf(b);
    })];
  }, [data]);

  const uniqueTimesOfDay = useMemo(() => {
    const times = new Set(data.map(row => row.time_of_day));
    return ['all', ...Array.from(times).sort((a, b) => {
      const order = ["dini hari", "pagi", "siang", "sore", "malam"];
      return order.indexOf(a) - order.indexOf(b);
    })];
  }, [data]);

  const uniqueMonths = useMemo(() => {
    const months = new Set(data.map(row => row.month_name));
    return ['all', ...Array.from(months).sort((a, b) => {
      const order = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return order.indexOf(a) - order.indexOf(b);
    })];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchesDay = dayOfWeekFilter === 'all' || row.day_of_week === dayOfWeekFilter;
      const matchesTime = timeOfDayFilter === 'all' || row.time_of_day === timeOfDayFilter;
      const matchesMonth = monthFilter === 'all' || row.month_name === monthFilter;
      return matchesDay && matchesTime && matchesMonth;
    });
  }, [data, dayOfWeekFilter, timeOfDayFilter, monthFilter]);

  const handleResetFilters = () => {
    setDayOfWeekFilter('all');
    setTimeOfDayFilter('all');
    setMonthFilter('all');
  };

  const isFilterActive = dayOfWeekFilter !== 'all' || timeOfDayFilter !== 'all' || monthFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <span className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-indigo-600" /> Filters:
        </span>
        <Select onValueChange={setDayOfWeekFilter} value={dayOfWeekFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Day" />
          </SelectTrigger>
          <SelectContent>
            {uniqueDaysOfWeek.map(day => (
              <SelectItem key={day} value={day}>{day === 'all' ? 'All Days' : day}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setTimeOfDayFilter} value={timeOfDayFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Time" />
          </SelectTrigger>
          <SelectContent>
            {uniqueTimesOfDay.map(time => (
              <SelectItem key={time} value={time}>{time === 'all' ? 'All Times' : time}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setMonthFilter} value={monthFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Month" />
          </SelectTrigger>
          <SelectContent>
            {uniqueMonths.map(month => (
              <SelectItem key={month} value={month}>{month === 'all' ? 'All Months' : month}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFilterActive && (
          <Button variant="outline" onClick={handleResetFilters} className="flex items-center">
            <XCircle className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        )}
      </div>
      {children(filteredData)}
    </div>
  );
};

export default TrafficDataFilterControls;