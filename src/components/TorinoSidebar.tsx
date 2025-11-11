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

const TorinoSidebar: React.FC<TorinoSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const handleLogout = () => {
    toast.info("Fungsi Logout belum diimplementasikan.");
    // Dalam aplikasi nyata, Anda akan menangani logout autentikasi di sini
  };

  // Helper untuk memeriksa apakah kategori atau anak-anaknya aktif
  const isCategoryActive = (paths: string[]) => {
    return paths.some(path => location.pathname === path);
  };

  const NavItem = ({ to, icon: Icon, label, isCategory = false, categoryPaths = [], onClick }: { to?: string; icon: React.ElementType; label: string; isCategory?: boolean; categoryPaths?: string[]; onClick?: () => void }) => {
    const isActiveLink = to && location.pathname === to;
    const isActiveCategory = isCategory && isCategoryActive(categoryPaths);

    const baseClasses = "flex items-center px-4 py-2 rounded-md transition-colors duration-200";
    const activeClasses = "bg-blue-50/50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    const inactiveClasses = "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700";
    const categoryTextClasses = "font-semibold";
    const linkIndentClasses = "pl-12"; // Indentasi untuk sub-tautan

    if (isCategory) {
      return (
        <div className={`${baseClasses} ${categoryTextClasses} ${isActiveCategory ? activeClasses : inactiveClasses}`}>
          <Icon className="h-5 w-5 mr-3" />
          <span>{label}</span>
        </div>
      );
    }

    const content = (
      <>
        <Icon className="h-5 w-5 mr-3" />
        <span>{label}</span>
      </>
    );

    if (to) {
      return (
        <Link to={to} className={`${baseClasses} ${linkIndentClasses} ${isActiveLink ? activeClasses : inactiveClasses}`} onClick={() => setIsSidebarOpen(false)}>
          {content}
        </Link>
      );
    } else if (onClick) {
      return (
        <Button variant="ghost" className={`${baseClasses} ${linkIndentClasses} w-full justify-start ${inactiveClasses}`} onClick={onClick}>
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

      {/* User Profile */}
      <div className="flex items-center px-4 py-2 mb-4">
        <img className="h-10 w-10 rounded-full mr-3" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User Avatar" />
        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">Afrin Leena</span>
      </div>

      <nav className="px-2 space-y-1">
        {/* Overview */}
        <NavItem icon={LayoutDashboard} label="Overview" isCategory categoryPaths={["/", "/torino-dashboard"]} />
        <NavItem to="/" icon={Home} label="Beranda" />
        <NavItem to="/torino-dashboard" icon={MapPin} label="Dashboard Lalu Lintas" />

        {/* Transportations */}
        <NavItem icon={Bike} label="Transportations" isCategory categoryPaths={["/sensors", "/incidents", "/reports"]} />
        <NavItem to="/sensors" icon={Activity} label="Sensor" />
        <NavItem to="/incidents" icon={Bell} label="Insiden" />
        <NavItem to="/reports" icon={BarChart2} label="Laporan" />

        {/* Traffic */}
        <NavItem icon={TrafficCone} label="Traffic" isCategory categoryPaths={["/data-analysis"]} />
        <NavItem to="/data-analysis" icon={BarChart2} label="Analisis Data" />

        {/* Weather */}
        <NavItem icon={CloudSun} label="Weather" isCategory categoryPaths={["/weather"]} />
        <NavItem to="/weather" icon={CloudSun} label="Prakiraan Cuaca Torino" />

        {/* News */}
        <NavItem icon={Newspaper} label="News" isCategory categoryPaths={["/news"]} />
        <NavItem to="/news" icon={Newspaper} label="Portal Berita" />

        {/* Others */}
        <NavItem icon={Info} label="Others" isCategory categoryPaths={["/about-torino", "/culture-tourism", "/contact-collaboration"]} />
        <NavItem to="/about-torino" icon={Info} label="Tentang Torino" />
        <NavItem to="/contact-collaboration" icon={Mail} label="Kontak & Kolaborasi" />

        {/* Account */}
        <div className="pt-4">
          <NavItem icon={User} label="Account" isCategory categoryPaths={["#settings", "#logout"]} />
          <NavItem icon={Settings} label="Settings" onClick={() => toast.info("Halaman Pengaturan belum diimplementasikan.")} />
          <NavItem icon={LogOut} label="Log out" onClick={handleLogout} />
        </div>

        {/* FAQ */}
        <div className="pt-4">
          <NavItem icon={HelpCircle} label="FAQ" isCategory onClick={() => toast.info("Halaman FAQ belum diimplementasikan.")} />
        </div>
      </nav>
    </div>
  );
};

export default TorinoSidebar;