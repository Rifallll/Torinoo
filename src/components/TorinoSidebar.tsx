"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, MapPin, BarChart2, Bell, Newspaper, Info, Mail, CloudSun, Activity,
  LayoutDashboard, Bike, TrafficCone, Settings, LogOut, HelpCircle, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TorinoSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

interface NavItemConfig {
  label: string;
  icon: React.ElementType;
  isCategory?: boolean;
  path?: string;
  subItems?: { label: string; path: string; icon: React.ElementType }[];
  onClick?: () => void;
}

const navItems: NavItemConfig[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    isCategory: true,
    subItems: [
      { label: "Home", path: "/", icon: Home },
      { label: "Traffic Dashboard", path: "/torino-dashboard", icon: MapPin },
    ],
  },
  {
    label: "Transportations",
    icon: Bike,
    isCategory: true,
    subItems: [
      { label: "Sensors", path: "/sensors", icon: Activity },
      { label: "Incidents", path: "/incidents", icon: Bell },
      { label: "Reports", path: "/reports", icon: BarChart2 },
    ],
  },
  {
    label: "Traffic",
    icon: TrafficCone,
    isCategory: true,
    subItems: [
      { label: "Data Analysis", path: "/data-analysis", icon: BarChart2 },
    ],
  },
  {
    label: "Weather",
    icon: CloudSun,
    isCategory: true,
    subItems: [
      { label: "Torino Weather Forecast", path: "/weather", icon: CloudSun },
    ],
  },
  {
    label: "News",
    icon: Newspaper,
    isCategory: true,
    subItems: [
      { label: "News Portal", path: "/news", icon: Newspaper },
    ],
  },
  {
    label: "Others",
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
      { label: "Settings", path: "#settings", icon: Settings, onClick: () => toast.info("Settings page not yet implemented.") },
      { label: "Log out", path: "#logout", icon: LogOut, onClick: () => toast.info("Logout function not yet implemented.") },
    ],
  },
  {
    label: "FAQ",
    icon: HelpCircle,
    isCategory: true,
    onClick: () => toast.info("FAQ page not yet implemented."),
  },
];

const TorinoSidebar: React.FC<TorinoSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const isLinkActive = (path: string) => location.pathname === path || (path === "/" && location.pathname === "/");

  const NavItem = ({ item }: { item: NavItemConfig }) => {
    const Icon = item.icon;
    const baseClasses = "flex items-center px-4 py-2 rounded-md transition-colors duration-200";
    const activeClasses = "bg-blue-50/50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    const inactiveClasses = "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700";
    const categoryTextClasses = "font-semibold";
    const linkIndentClasses = "pl-12"; // Indentation for sub-links

    if (item.isCategory) {
      const categoryPaths = item.subItems?.map(sub => sub.path) || [];
      const isActiveCategory = categoryPaths.some(path => isLinkActive(path));
      return (
        <div className="space-y-1">
          <div
            className={`${baseClasses} ${categoryTextClasses} ${isActiveCategory ? activeClasses : inactiveClasses} ${item.onClick ? 'cursor-pointer' : ''}`}
            onClick={item.onClick}
          >
            <Icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </div>
          {item.subItems && (
            <div className="space-y-1">
              {item.subItems.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  to={subItem.path}
                  className={`${baseClasses} ${linkIndentClasses} ${isLinkActive(subItem.path) ? activeClasses : inactiveClasses}`}
                  onClick={() => {
                    if (subItem.onClick) subItem.onClick();
                    setIsSidebarOpen(false);
                  }}
                >
                  <subItem.icon className="h-5 w-5 mr-3" />
                  <span>{subItem.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    // For standalone items (like FAQ if it were not a category)
    const isActiveLink = item.path && isLinkActive(item.path);
    const content = (
      <>
        <Icon className="h-5 w-5 mr-3" />
        <span>{item.label}</span>
      </>
    );

    if (item.path) {
      return (
        <Link to={item.path} className={`${baseClasses} ${linkIndentClasses} ${isActiveLink ? activeClasses : inactiveClasses}`} onClick={() => setIsSidebarOpen(false)}>
          {content}
        </Link>
      );
    } else if (item.onClick) {
      return (
        <Button variant="ghost" className={`${baseClasses} ${linkIndentClasses} w-full justify-start ${inactiveClasses}`} onClick={item.onClick}>
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
      } transition duration-200 ease-in-out z-30 shadow-lg overflow-y-auto`}
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

      {/* User Profile */}
      <div className="flex items-center px-4 py-2 mb-4">
        <img className="h-10 w-10 rounded-full mr-3" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User Avatar" />
        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">Afrin Leena</span>
      </div>

      <nav className="px-2 space-y-1">
        {navItems.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </nav>
    </div>
  );
};

export default TorinoSidebar;