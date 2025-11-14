"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, MapPin, BarChart2, Bell, Newspaper, Info, Mail, CloudSun, Activity,
  LayoutDashboard, Bike, TrafficCone, Settings, LogOut, User, Palette, Car, Clock, AlertTriangle, Route, Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MadeWithDyad } from './made-with-dyad'; // Import MadeWithDyad component
// import TomTomLayerToggle from './TomTomLayerToggle'; // Removed: Toggle is now on SettingsPage

interface TorinoSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

interface NavItemConfig {
  label: string;
  icon: React.ElementType;
  path?: string; // Path for direct links
  isCategory?: boolean; // True if it's a category with sub-items
  subItems?: {
    label: string;
    path: string;
    icon: React.ElementType;
    onClick?: () => void;
  }[];
  onClick?: () => void; // For standalone items that trigger an action
}

const navItems: NavItemConfig[] = [
  { label: "Traffic Dashboard", path: "/torino-dashboard", icon: LayoutDashboard },
  {
    label: "Transportations",
    icon: Bike,
    isCategory: true,
    subItems: [
      { label: "Sensors", path: "/sensors", icon: Activity },
      { label: "Incidents", path: "/incidents", icon: AlertTriangle },
      { label: "Reports", path: "/reports", icon: BarChart2 },
      { label: "All Vehicle Positions", path: "/all-vehicle-positions", icon: Car },
      { label: "All Trip Updates", path: "/all-trip-updates", icon: Clock },
      { label: "All GTFS Routes", path: "/all-gtfs-routes", icon: Route },
    ],
  },
  { label: "Data Analysis", path: "/data-analysis", icon: BarChart2 },
  {
    label: "Environment",
    icon: CloudSun,
    isCategory: true,
    subItems: [
      { label: "Torino Weather Forecast", path: "/weather", icon: CloudSun },
      { label: "Detailed Weather Forecast", path: "/detailed-weather", icon: CloudSun }, // New
      { label: "Detailed Air Quality", path: "/detailed-air-quality", icon: Leaf }, // New
    ],
  },
  { label: "News Portal", path: "/news", icon: Newspaper },
  {
    label: "City Info",
    icon: Info,
    isCategory: true,
    subItems: [
      { label: "About Torino", path: "/about-torino", icon: Info },
      { label: "Culture & Tourism", path: "/culture-tourism", icon: Palette },
      { label: "Contact & Collaboration", path: "/contact-collaboration", icon: Mail },
    ],
  },
  {
    label: "Account",
    icon: User,
    isCategory: true,
    subItems: [
      { label: "Settings", path: "/settings", icon: Settings },
      { label: "Log out", path: "#logout", icon: LogOut, onClick: () => toast.info("Logout function not yet implemented.") },
    ],
  },
];

const TorinoSidebar: React.FC<TorinoSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const isLinkActive = (path: string) => {
    // Handle root path correctly
    if (path === "/") return location.pathname === "/";
    // Handle paths with hash for scrolling to sections
    if (path.includes("#")) {
      const [basePath, hash] = path.split('#');
      return location.pathname === basePath && location.hash === `#${hash}`;
    }
    return location.pathname === path;
  };

  const NavItem = ({ item }: { item: NavItemConfig }) => {
    const Icon = item.icon;
    const baseClasses = "flex items-center px-4 py-2 rounded-md transition-colors duration-200 text-sm";
    const activeClasses = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold";
    const inactiveClasses = "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700";
    const categoryHeaderClasses = "font-semibold text-gray-800 dark:text-gray-100 mt-4 mb-1 px-4 text-xs uppercase tracking-wider";
    const subItemIndentClasses = "pl-8"; // Indentation for sub-links

    // Render category header
    if (item.isCategory) {
      return (
        <div className="space-y-1">
          <div className={categoryHeaderClasses}>
            {item.label}
          </div>
          {item.subItems && (
            <div className="space-y-1">
              {item.subItems.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  to={subItem.path}
                  className={`${baseClasses} ${subItemIndentClasses} ${isLinkActive(subItem.path) ? activeClasses : inactiveClasses}`}
                  onClick={() => {
                    if (subItem.onClick) subItem.onClick();
                    setIsSidebarOpen(false);
                  }}
                >
                  <subItem.icon className="h-4 w-4 mr-3" />
                  <span>{subItem.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Render direct link or action item
    const isActiveLink = item.path && isLinkActive(item.path);
    const content = (
      <>
        <Icon className="h-4 w-4 mr-3" />
        <span>{item.label}</span>
      </>
    );

    if (item.path) {
      return (
        <Link to={item.path} className={`${baseClasses} ${isActiveLink ? activeClasses : inactiveClasses}`} onClick={() => setIsSidebarOpen(false)}>
          {content}
        </Link>
      );
    } else if (item.onClick) {
      return (
        <Button variant="ghost" className={`${baseClasses} w-full justify-start ${inactiveClasses}`} onClick={item.onClick}>
          {content}
        </Button>
      );
    }
    return null;
  };

  return (
    <div
      id="sidebar"
      className={`sidebar bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition duration-200 ease-in-out z-30 shadow-lg overflow-y-auto flex flex-col`}
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

      <nav className="px-2 space-y-1 flex-1">
        {navItems.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </nav>

      {/* Removed: TomTomLayerToggle is now on SettingsPage */}
      {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <TomTomLayerToggle />
      </div> */}

      <div className="mt-auto">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default TorinoSidebar;