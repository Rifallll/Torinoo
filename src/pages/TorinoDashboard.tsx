"use client";

import React, { useState, useCallback } from 'react'; // Import useCallback
import { Link } from 'react-router-dom';
import { Home, Users, MapPin, BarChart2, Bell, Search, User, Plus, TrendingUp, Clock, AlertTriangle, Car, Activity, Newspaper, Upload, Info, Download, Filter, Gauge, Leaf } from 'lucide-react'; // Import Leaf icon
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TorinoMapComponent from '@/components/TorinoMapComponent';
import TorinoSidebar from '@/components/TorinoSidebar';
import TorinoHeader from '@/components/TorinoHeader';
import UploadCSVModal from '@/components/modals/UploadCSVModal';
import TrafficAnalysisModal from '@/components/modals/TrafficAnalysisModal';
import ExportModal from '@/components/modals/ExportModal';
// import FilterDropdowns from '@/components/FilterDropdowns'; // Dihapus: FilterDropdowns tidak lagi digunakan
import RecentNewsSection from '@/components/RecentNewsSection';
import WeatherCard from '@/components/WeatherCard';
import AirQualityCard from '@/components/AirQualityCard'; // New: Import AirQualityCard
import PublicTransportAlertsCard from '@/components/PublicTransportAlertsCard'; // Renamed and updated
import VehiclePositionsCard from '@/components/VehiclePositionsCard'; // New component
import GtfsRoutesCard from '@/components/GtfsRoutesCard'; // New component
// import TrafficSpeedDistributionChart from '@/components/TrafficSpeedDistributionChart'; // Removed
import QuickActionsCard from '@/components/QuickActionsCard';
import { mockTrafficChanges } from '@/components/TrafficChangesInsights'; // New: Import mockTrafficChanges

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'; // Removed chart imports

const TorinoDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadCSVModalOpen, setIsUploadCSVModalOpen] = useState(false);
  const [isTrafficAnalysisModalOpen, setIsTrafficAnalysisModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // State untuk filter, dipertahankan dengan nilai default untuk TorinoMapComponent
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');
  const [roadConditionFilter, setRoadConditionFilter] = useState<string>('all');

  // Memoize callback functions for QuickActionsCard
  const handleUploadCSVClick = useCallback(() => {
    setIsUploadCSVModalOpen(true);
  }, []);

  const handleExportClick = useCallback(() => {
    setIsExportModalOpen(true);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <TorinoSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <TorinoHeader setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {/* Removed: Dummy statistic cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{dummyStats.totalIncidents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</CardTitle>
                <Car className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{dummyStats.resolvedIncidents}</div>
                <p className className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">+8%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{dummyStats.pendingIncidents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-600 font-medium">-3%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sensors</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{dummyStats.activeSensors}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">+2</span> new sensors
                </p>
              </CardContent>
            </Card>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Torino Traffic Map</CardTitle>
                  {/* FilterDropdowns dihapus dari sini */}
                </CardHeader>
                <CardContent className="h-[500px] p-0">
                  <TorinoMapComponent 
                    selectedVehicleType={vehicleTypeFilter} 
                    roadConditionFilter={roadConditionFilter} 
                    trafficChanges={mockTrafficChanges} // New: Pass traffic changes data
                  />
                </CardContent>
              </Card>
              {/* <TrafficSpeedDistributionChart /> */} {/* Removed */}
            </div>

            <div className="space-y-6">
              <WeatherCard />
              <AirQualityCard />
              <PublicTransportAlertsCard /> {/* New component for alerts */}
              <VehiclePositionsCard /> {/* New component for vehicle positions */}
              <GtfsRoutesCard /> {/* New component for GTFS routes */}

              {/* Removed: Traffic Flow Prediction Chart */}
              {/* <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Traffic Flow Prediction</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trafficFlowPredictionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="name" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Bar dataKey="Low Congestion" stackId="a" fill="#82ca9d" name="Low" />
                      <Bar dataKey="Moderate Congestion" stackId="a" fill="#ffc658" name="Moderate" />
                      <Bar dataKey="High Congestion" stackId="a" fill="#ff7300" name="High" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card> */}

              {/* Removed: Traffic Volume Trends (Last 24 Hours) Chart */}
              {/* <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Traffic Volume Trends (Last 24 Hours)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trafficVolumeData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="hour" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="volume" stroke="#8884d8" activeDot={{ r: 8 }} name="Traffic Volume" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card> */}

              {/* Menggunakan komponen QuickActionsCard yang baru */}
              <QuickActionsCard
                onUploadCSVClick={handleUploadCSVClick}
                onExportClick={handleExportClick}
              />
            </div>
          </div>

          {/* Removed: RecentNewsSection as it uses dummy data */}
          {/* <div className="mt-6">
            <RecentNewsSection />
          </div> */}
        </main>
      </div>

      {/* Modals */}
      <UploadCSVModal isOpen={isUploadCSVModalOpen} onClose={() => setIsUploadCSVModalOpen(false)} />
      <TrafficAnalysisModal isOpen={isTrafficAnalysisModalOpen} onClose={() => setIsTrafficAnalysisModalOpen(false)} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};

export default TorinoDashboard;