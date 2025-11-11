"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, MapPin, BarChart2, Bell, Newspaper, Info, Palette, Mail, CloudSun, Car, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TorinoSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const TorinoSidebar: React.FC<TorinoSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div
      id="sidebar"
      className={`sidebar bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 shadow-lg overflow-y-auto`}
    >
      <div className="flex items-center justify-between px-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Torino Traffic</h1>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-700 dark:text-gray-200"
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

      <nav className="px-2 space-y-4">
        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-4 mb-2">Overview</h3>
          <Link to="/" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Home className="h-5 w-5 mr-3" />
            Beranda
          </Link>
          <Link to="/torino-dashboard" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <MapPin className="h-5 w-5 mr-3" />
            Dashboard Lalu Lintas
          </Link>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-4 mb-2">Transportation</h3>
          <Link to="/sensors" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Activity className="h-5 w-5 mr-3" />
            Sensor
          </Link>
          <Link to="/incidents" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Bell className="h-5 w-5 mr-3" />
            Insiden
          </Link>
          <Link to="/reports" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <BarChart2 className="h-5 w-5 mr-3" />
            Laporan
          </Link>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-4 mb-2">Traffic</h3>
          <Link to="/data-analysis" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <BarChart2 className="h-5 w-5 mr-3" />
            Analisis Data
          </Link>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-4 mb-2">Weather</h3>
          <Link to="/weather" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <CloudSun className="h-5 w-5 mr-3" />
            Prakiraan Cuaca Torino
          </Link>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-4 mb-2">News</h3>
          <Link to="/news" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Newspaper className="h-5 w-5 mr-3" />
            Portal Berita
          </Link>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-4 mb-2">Others</h3>
          {/* <Link to="/culture-tourism" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Palette className="h-5 w-5 mr-3" />
            Budaya & Pariwisata
          </Link> */}
          <Link to="/about-torino" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Info className="h-5 w-5 mr-3" />
            Tentang Torino
          </Link>
          <Link to="/contact-collaboration" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Mail className="h-5 w-5 mr-3" />
            Kontak & Kolaborasi
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default TorinoSidebar;