"use client";

import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TorinoHeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
}

const TorinoHeader: React.FC<TorinoHeaderProps> = ({ setIsSidebarOpen, isSidebarOpen }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date for Torino, Italy (Europe/Rome timezone) including the year
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric', // Include year as per user's text request
    timeZone: 'Europe/Rome',
  }).format(currentDateTime);

  // Format time for Torino, Italy (Europe/Rome timezone) in HH.MM format
  const formattedTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Ensure 24-hour format
    timeZone: 'Europe/Rome',
  }).format(currentDateTime).replace(':', '.'); // Replace colon with dot

  return (
    <header className="bg-blue-800 shadow-sm z-20">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section: Menu, Title, Date/Time */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white hover:bg-blue-700"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex flex-col items-start ml-4">
              <h2 className="text-3xl font-bold text-white">Torino</h2> {/* Adjusted size */}
              <div className="text-white mt-1">
                <p className="text-sm font-medium">{formattedDate}</p> {/* Adjusted size */}
                <p className="text-4xl font-bold leading-none">{formattedTime} <span className="text-base font-normal">Torino, Italy</span></p> {/* Adjusted size and line-height */}
              </div>
            </div>
          </div>

          {/* Right Section: Search Bar */}
          <div className="flex items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search"
                className="w-full bg-white text-gray-900 rounded-full pl-10 pr-4 py-2 border-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TorinoHeader;