"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react'; // Import Menu and X icons
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle'; // Import ThemeToggle

interface TorinoHeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSidebarOpen: boolean; // Add isSidebarOpen prop
}

const TorinoHeader: React.FC<TorinoHeaderProps> = ({ setIsSidebarOpen, isSidebarOpen }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = currentDateTime.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm z-20">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2" // Remove md:hidden, make it always visible
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar state
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />} {/* Change icon based on state */}
            </Button>
            <h2 className="ml-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Torino Traffic Dashboard</h2>
            <div className="ml-6 text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              {formattedDate}, {formattedTime}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="text" placeholder="Search..." className="pl-10 pr-4 py-2" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TorinoHeader;