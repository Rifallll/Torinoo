"use client";

import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlobalCommandPalette from './GlobalCommandPalette'; // Import the new component

interface TorinoHeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
}

const TorinoHeader: React.FC<TorinoHeaderProps> = ({ setIsSidebarOpen, isSidebarOpen }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false); // State for command palette

  useEffect(() => {
    // Mengubah interval menjadi 1 detik (1000 ms) untuk menampilkan detik
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every 1 second
    return () => clearInterval(timer);
  }, []);

  // Using 'en-US' for English date and time format, with Torino's timezone (Europe/Rome)
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Europe/Rome'
  });
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Europe/Rome' // Menambahkan 'second'
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
            {/* Search button to open command palette */}
            <Button
              variant="ghost" // Keeping ghost variant but adding custom styles
              className="flex items-center text-white bg-blue-700 hover:bg-blue-600 border border-blue-600 shadow-lg px-4 py-2 rounded-full transition-all duration-200"
              onClick={() => setIsCommandPaletteOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="text-sm hidden md:inline">Search...</span>
              <kbd className="ml-4 hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-white/50 bg-blue-900 px-1.5 font-mono text-[10px] font-medium text-white opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          <div className="flex items-center space-x-6 text-white">
            <div className="text-right">
              <p className="text-sm">{formattedDate}</p>
              <p className="text-2xl font-bold">{formattedTime}</p>
            </div>
          </div>
        </div>
      </div>
      <GlobalCommandPalette open={isCommandPaletteOpen} setOpen={setIsCommandPaletteOpen} />
    </header>
  );
};

export default TorinoHeader;