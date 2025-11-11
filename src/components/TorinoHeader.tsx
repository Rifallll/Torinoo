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
      // Create a new Date object for Torino's timezone (CET/CEST)
      // This is a client-side approximation. For precise timezone handling,
      // a library like `date-fns-tz` or `moment-timezone` would be ideal,
      // but for this scope, we'll rely on the browser's locale settings for 'it-IT'.
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Menggunakan 'it-IT' untuk format tanggal dan waktu Italia
  const formattedDate = currentDateTime.toLocaleDateString('it-IT', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
  const formattedTime = currentDateTime.toLocaleTimeString('it-IT', {
    hour: '2-digit', minute: '2-digit', hour12: false // Menggunakan format 24 jam untuk Italia
  });

  return (
    <header className="bg-blue-800 shadow-sm z-20">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white hover:bg-blue-700"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h2 className="ml-4 text-2xl font-bold text-white">Torino</h2>
          </div>

          <div className="flex items-center flex-1 justify-center space-x-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search"
                className="w-full bg-white text-gray-900 rounded-full pl-10 pr-4 py-2 border-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 text-white">
            <div className="text-right">
              <p className="text-sm">{formattedDate}</p>
              <p className="text-2xl font-bold">{formattedTime}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TorinoHeader;