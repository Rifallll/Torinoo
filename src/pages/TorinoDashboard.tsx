"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, MapPin, BarChart2, Bell, Search, User, Plus, TrendingUp, Clock, AlertTriangle, Car, Activity, Newspaper, Upload, Info, Download, Filter } from 'lucide-react';
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

  const trafficFlowPrediction = [
    { area: "Main Street", time: "07:00-09:00", congestion: "Low Congestion", badgeClass: "bg-green-100 text-green-600" },
    { area: "Oak Avenue", time: "07:00-09:00", congestion: "Moderate Congestion", badgeClass: "bg-yellow-100 text-yellow-600" },
    { area: "Pine Road", time: "07:00-09:00", congestion: "High Congestion", badgeClass: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <TorinoSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TorinoHeader setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyStats.totalIncidents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
                <Car className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyStats.resolvedIncidents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">+8%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyStats.pendingIncidents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-600 font-medium">-3%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Sensors</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyStats.activeSensors}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">+2</span> new sensors
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">Peta Lalu Lintas Torino</CardTitle>
                  <div className="flex space-x-2">
                    <FilterDropdowns />
                  </div>
                </CardHeader>
                <CardContent className="h-[500px] p-0">
                  <TorinoMapComponent />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Prediksi Arus Lalu Lintas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Berdasarkan data historis dan input sensor real-time, berikut prediksi arus lalu lintas untuk jam berikutnya:
                  </p>
                  <div className="space-y-2">
                    {trafficFlowPrediction.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{item.area} ({item.time})</span>
                        <Badge variant="outline" className={item.badgeClass}>{item.congestion}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
                      <div className="flex flex-col items-center justify-center" onClick={() => setIsUploadCSVModalOpen(true)}>
                        <Upload className="h-6 w-6 text-indigo-600 mb-2" />
                        <span className="text-sm font-medium text-indigo-600">Upload CSV Data</span>
                      </div>
                    </Button>
                    <Button asChild variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
                      <Link to="/data-analysis" className="flex flex-col items-center justify-center">
                        <BarChart2 className="h-6 w-6 text-green-600 mb-2" />
                        <span className="text-sm font-medium text-green-600">Lihat & Sinkronisasi Data</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
                      <Link to="/about-torino" className="flex flex-col items-center justify-center">
                        <Info className="h-6 w-6 text-yellow-600 mb-2" />
                        <span className="text-sm font-medium text-yellow-600">Tentang Kota Torino</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
                      <div className="flex flex-col items-center justify-center" onClick={() => setIsExportModalOpen(true)}>
                        <Download className="h-6 w-6 text-purple-600 mb-2" />
                        <span className="text-sm font-medium text-purple-600">Ekspor</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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