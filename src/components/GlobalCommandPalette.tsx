"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Newspaper,
  Wifi,
  AlertTriangle,
  BarChart2,
  Info,
  Mail,
  CloudSun,
  Car,
  History,
  Building2,
  MapPin,
  DollarSign,
  GraduationCap,
  Palette,
  Utensils,
  Users,
  Lightbulb,
  Quote,
  Image as ImageIcon,
  Settings, // Import Settings icon
  Route as RouteIcon, // Renamed to avoid conflict with React Router's Route
  Clock, // For All Trip Updates
  Leaf, // For Air Quality
  TrafficCone, // New: Import TrafficCone for Traffic Changes
} from "lucide-react";

// Define searchable items
const searchableItems = [
  {
    group: "Main Navigation",
    items: [
      { label: "Home Page", value: "home", path: "/", icon: LayoutDashboard },
      { label: "Traffic Dashboard", value: "traffic dashboard", path: "/torino-dashboard", icon: LayoutDashboard },
      { label: "News Portal", value: "news portal", path: "/news", icon: Newspaper },
      { label: "Sensor Management", value: "sensor management", path: "/sensors", icon: Wifi },
      { label: "Traffic Incidents", value: "traffic incidents", path: "/incidents", icon: AlertTriangle },
      { label: "Reports", value: "reports", path: "/reports", icon: BarChart2 },
      // Item 'Data Analysis' dihapus sesuai permintaan
      { label: "Data Analysis", value: "data analysis", path: "/data-analysis", icon: BarChart2 },
      { label: "About Torino City", value: "about torino city", path: "/about-torino", icon: Info },
      { label: "Culture, Cuisine & Tourism", value: "culture cuisine tourism", path: "/culture-tourism", icon: Palette },
      { label: "Contact & Collaboration", value: "contact collaboration", path: "/contact-collaboration", icon: Mail },
      { label: "Torino Weather Forecast", value: "torino weather forecast", path: "/weather", icon: CloudSun },
      { label: "Detailed Weather Forecast", value: "detailed weather forecast", path: "/detailed-weather", icon: CloudSun }, // New
      { label: "All Vehicle Positions", value: "all vehicle positions", path: "/all-vehicle-positions", icon: Car },
      // { label: "All Trip Updates", value: "all trip updates", path: "/all-trip-updates", icon: Clock }, // Removed
      { label: "All GTFS Routes", value: "all gtfs routes", path: "/all-gtfs-routes", icon: RouteIcon },
      { label: "Detailed Air Quality", value: "detailed air quality", path: "/detailed-air-quality", icon: Leaf }, // New
      { label: "Traffic Changes & Roadworks", value: "traffic changes roadworks", path: "/traffic-changes", icon: TrafficCone }, // New
      { label: "Settings", value: "settings", path: "/settings", icon: Settings },
    ],
  },
  {
    group: "About Torino Sections",
    items: [
      { label: "General Information", value: "general information", path: "/about-torino#general-info", icon: Info },
      { label: "History & Governance", value: "history governance", path: "/about-torino#history-governance", icon: History },
      { label: "Geography & Climate", value: "geography climate", path: "/about-torino#geography-climate", icon: MapPin },
      { label: "Economy & Innovation", value: "economy innovation", path: "/about-torino#economy-innovation", icon: DollarSign },
      { label: "Culture & Lifestyle", value: "culture lifestyle", path: "/about-torino#culture-lifestyle", icon: Palette },
      { label: "Transportation & Mobility", value: "transportation mobility", path: "/about-torino#transportation", icon: Car },
      { label: "Demographics", value: "demographics", path: "/about-torino#demographics", icon: Users },
      { label: "Smart City Initiatives", value: "smart city initiatives", path: "/about-torino#smart-city-initiatives", icon: Lightbulb },
      { label: "Quotes & Motto", value: "quotes motto", path: "/about-torino#quotes-motto", icon: Quote },
      { label: "Summary Table", value: "summary table", path: "/about-torino#summary-table", icon: Info },
      { label: "Visual Gallery", value: "visual gallery", path: "/about-torino#visual-gallery", icon: ImageIcon },
      { label: "Education & Research", value: "education research", path: "/about-torino#education-research", icon: GraduationCap },
      { label: "Cuisine", value: "cuisine", path: "/about-torino#cuisine", icon: Utensils },
    ],
  },
];

interface GlobalCommandPaletteProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Updated type to accept functional updates
}

const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleSelect = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate, setOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      // className="z-[9999]" // Removed className as CommandDialog does not directly accept it
      aria-labelledby="dialog-title-command-palette"
      aria-describedby="dialog-description-command-palette"
    >
      {/* Add DialogTitle and DialogDescription with explicit IDs for accessibility */}
      <DialogTitle id="dialog-title-command-palette" className="sr-only">Command Palette</DialogTitle>
      <DialogDescription id="dialog-description-command-palette" className="sr-only">Search for commands or navigate the application.</DialogDescription>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {searchableItems.map((group, groupIndex) => (
          <CommandGroup key={groupIndex} heading={group.group}>
            {group.items.map((item, itemIndex) => (
              <CommandItem
                key={itemIndex}
                value={item.value}
                onSelect={() => handleSelect(item.path)}
                className="cursor-pointer"
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalCommandPalette;