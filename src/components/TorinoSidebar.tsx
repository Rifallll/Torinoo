"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, MapPin, BarChart2, Bell, Newspaper, Upload, Info, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TorinoSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const TorinoSidebar: React.FC<TorinoSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div
      id="sidebar"
      className={`sidebar bg-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 shadow-lg`}
    >
      <div className="flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-gray-800">Torino Traffic</h1>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>

      <nav className="px-2 space-y-1">
        <Link to="/torino-dashboard" className="flex items-center px-4 py-2 text-gray-700 rounded-md bg-gray-100">
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        <Link to="/sensors" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <Users className="h-5 w-5 mr-3" />
          Sensors
        </Link>
        <Link to="/incidents" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <Bell className="h-5 w-5 mr-3" />
          Incidents
        </Link>
        <Link to="/reports" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <BarChart2 className="h-5 w-5 mr-3" />
          Reports
        </Link>
        <Link to="/news" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <Newspaper className="h-5 w-5 mr-3" />
          News Portal
        </Link>
      </nav>
    </div>
  );
};

export default TorinoSidebar;