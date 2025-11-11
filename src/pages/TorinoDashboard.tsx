"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, MapPin, BarChart2, Bell, Search, User, Plus, TrendingUp, Clock, AlertTriangle, Car, Activity, Newspaper, Upload, Info, Download, Filter, Gauge } from 'lucide-react';
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
import FilterDropdowns from '@/components/FilterDropdowns';
import RecentNewsSection from '@/components/RecentNewsSection';
import WeatherCard from '@/components/WeatherCard';
import ActiveIncidentsSummary from '@/components/ActiveIncidentsSummary';
import TrafficSpeedDistributionChart from '@/components/TrafficSpeedDistributionChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const TorinoDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadCSVModalOpen, setIsUploadCSVModalOpen] = useState(false);
  const [isTrafficAnalysisModalOpen, setIsTrafficAnalysisModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dummy data for quick actions and statistics
  const dummyStats = {
    totalIncidents: 124,
    resolvedIncidents: 89,
    pendingIncidents: 22,
    activeSensors: 12,
  };

  // Adjusted dummy data for traffic flow prediction to be suitable for a chart
  const trafficFlowPredictionData = [
    { name: "Via Roma", "Low Congestion": 80, "Moderate Congestion": 15, "High Congestion": 5 },
    { name: "Piazza Castello", "Low Congestion": 60, "Moderate Congestion": 30, "High Congestion": 10 },
    { name: "Corso Vittorio Emanuele II", "Low Congestion": 40, "Moderate Congestion": 40, "High Congestion": 20 },
    { name: "Main Street", "Low Congestion": 70, "Moderate Congestion": 20, "High Congestion": 10 },
    { name: "Oak Avenue", "Low Congestion": 50, "Moderate Congestion": 35, "High Congestion": 15 },
    { name: "Pine Road", "Low Congestion": 30, "Moderate Congestion": 45, "High Congestion": 25 },
  ];

  // Dummy data for Traffic Volume Trends (Last 24 Hours)
  const trafficVolumeData = [
    { hour: '00:00', volume: 120 },
    { hour: '01:00', volume: 90 },
    { hour: '02:00', volume: 70 },
    { hour: '03:00', volume: 60 },
    { hour: '04:00', volume: 80 },
    { hour: '05:00', volume: 150 },
    { hour: '06:00', volume: 280 },
    { hour: '07:00', volume: 450 },
    { hour: '08:00', volume: 520 },
    { hour: '09:00', volume: 480 },
    { hour: '10:00', volume: 350 },
    { hour: '11:00', volume: 300 },
    { hour: '12:00', volume: 380 },
    { hour: '13:00', volume: 400 },
    { hour: '14:00', volume: 370 },
    { hour: '15:00', volume: 420 },
    { hour: '16:00', volume: 500 },
    { hour: '17:00', volume: 600 },
    { hour: '18:00', volume: 550 },
    { hour: '19:00', volume: 400 },
    { hour: '20:00', volume: 300 },
    { hour: '21:00', volume: 250 },
    { hour: '22:00', volume: 200 },
    { hour: '23:00', volume: 160 },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <TorinoSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <TorinoHeader setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                <p className="text-xs text-muted-foreground mt-1">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Torino Traffic Map</CardTitle>
                  <div className="flex space-x-2">
                    <FilterDropdowns />
                  </div>
                </CardHeader>
                <CardContent className="h-[500px] p-0">
                  <TorinoMapComponent />
                </CardContent>
              </Card>
              <TrafficSpeedDistributionChart />
            </div>

            <div className="space-y-6">
              <WeatherCard />
              <ActiveIncidentsSummary />
              {/* Removed SensorStatusOverviewCard */}
              {/* Removed TrafficCongestionCard */}

              <Card className="bg-white dark:bg-gray-800 shadow-lg">
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
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg">
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
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="ghost"
                      className="flex flex-col items-center justify-center p-3 h-auto w-full
                                 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                                 hover:bg-gray-100 dark:hover:bg-gray-700
                                 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                      onClick={() => setIsUploadCSVModalOpen(true)}
                    >
                      <Upload className="h-6 w-6 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Upload CSV Data</span>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="flex flex-col items-center justify-center p-3 h-auto w-full
                                 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                                 hover:bg-gray-100 dark:hover:bg-gray-700
                                 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                    >
                      <Link to="/data-analysis" className="flex flex-col items-center justify-center">
                        <BarChart2 className="h-6 w-6 text-green-600 mb-2" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">View & Sync Data</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="flex flex-col items-center justify-center p-3 h-auto w-full
                                 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                                 hover:bg-gray-100 dark:hover:bg-gray-700
                                 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                    >
                      <Link to="/about-torino" className="flex flex-col items-center justify-center">
                        <Info className="h-6 w-6 text-yellow-600 mb-2" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">About Torino City</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex flex-col items-center justify-center p-3 h-auto w-full
                                 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                                 hover:bg-gray-100 dark:hover:bg-gray-700
                                 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                      onClick={() => setIsExportModalOpen(true)}
                    >
                      <Download className="h-6 w-6 text-purple-600 mb-2" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Export</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* New section for Recent News */}
          <div className="mt-6">
            <RecentNewsSection />
          </div>
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