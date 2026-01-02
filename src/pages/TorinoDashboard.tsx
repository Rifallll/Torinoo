import React, { useState, useCallback, useEffect } from 'react'; // Import useEffect
import { Link } from 'react-router-dom';
import { Home, Users, MapPin, BarChart2, Bell, Search, User, Plus, TrendingUp, Clock, AlertTriangle, Car, Activity, Newspaper, Upload, Info, Download, Filter, Gauge, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TorinoSidebar from '@/components/TorinoSidebar';
import TorinoHeader from '@/components/TorinoHeader';
import TorinoMapComponent from '@/components/TorinoMapComponent';
import PublicTransportAlertsCard from '@/components/PublicTransportAlertsCard';
import WeatherCard from '@/components/WeatherCard';
import AirQualityCard from '@/components/AirQualityCard';
import VehiclePositionsCard from '@/components/VehiclePositionsCard';
import GtfsRoutesCard from '@/components/GtfsRoutesCard';
import QuickActionsCard from '@/components/QuickActionsCard';
import { TrafficChange } from '@/components/TrafficChangesInsights';
import UploadCSVModal from '@/components/modals/UploadCSVModal';
import TrafficAnalysisModal from '@/components/modals/TrafficAnalysisModal';
import ExportModal from '@/components/modals/ExportModal';
import { useTomTomIncidents } from '@/hooks/useTomTomIncidents';
import { useSupabaseTraffic } from '@/hooks/useSupabaseTraffic';

const TorinoDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadCSVModalOpen, setIsUploadCSVModalOpen] = useState(false);
  const [isTrafficAnalysisModalOpen, setIsTrafficAnalysisModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Real-time Traffic Data from TomTom API
  const { incidents: tomtomIncidents, isLoading: isTomTomLoading } = useTomTomIncidents();

  // Official Torino Data from Supabase
  const { incidents: supabaseIncidents, trafficChanges: supabaseRoadworks, isLoading: isSupabaseLoading } = useSupabaseTraffic();

  const isTrafficLoading = isTomTomLoading || isSupabaseLoading;
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');
  const [roadConditionFilter, setRoadConditionFilter] = useState<string>('all');

  // Combined and Mapped Traffic Data
  const trafficChanges: TrafficChange[] = [
    ...(supabaseRoadworks || []).map(rw => ({
      id: rw.id,
      title: rw.title,
      description: rw.description,
      latitude: rw.latitude,
      longitude: rw.longitude,
      startDate: rw.start_date,
      type: (rw.type || 'roadwork') as any,
      responsibleEntity: rw.responsible_entity || 'Muoversi a Torino'
    })),
    ...(tomtomIncidents || []).map(inc => ({
      id: inc.id,
      title: inc.from ? `${inc.type} at ${inc.from}` : inc.type,
      description: inc.description,
      latitude: inc.latitude,
      longitude: inc.longitude,
      startDate: inc.reportedAt,
      type: (inc.type.toLowerCase().includes('closure') ? 'closure' :
        inc.type.toLowerCase().includes('work') ? 'roadwork' : 'reduction') as any,
      responsibleEntity: 'TomTom Live'
    }))
  ];

  // Combined Incidents for Alerts Card
  const allAlerts = [
    ...(supabaseIncidents || []).map(inc => ({
      id: inc.id,
      type: inc.type,
      description: inc.description,
      severity: inc.severity,
      reportedAt: inc.reported_at,
      location: inc.location
    })),
    ...(tomtomIncidents || []).map(inc => ({
      id: inc.id,
      type: inc.type,
      description: inc.description,
      severity: inc.severity,
      reportedAt: inc.reportedAt,
      location: inc.location
    }))
  ];

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Torino Traffic Map</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] p-0">
                  <TorinoMapComponent
                    selectedVehicleType={vehicleTypeFilter}
                    roadConditionFilter={roadConditionFilter}
                    trafficChanges={trafficChanges}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <WeatherCard />
              <AirQualityCard />
              <PublicTransportAlertsCard trafficChanges={trafficChanges} />
              <VehiclePositionsCard />
              <GtfsRoutesCard />
              <QuickActionsCard
                onUploadCSVClick={handleUploadCSVClick}
                onExportClick={handleExportClick}
              />
            </div>
          </div>

        </main>
      </div>

      <UploadCSVModal isOpen={isUploadCSVModalOpen} onClose={() => setIsUploadCSVModalOpen(false)} />
      <TrafficAnalysisModal isOpen={isTrafficAnalysisModalOpen} onClose={() => setIsTrafficAnalysisModalOpen(false)} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};

export default TorinoDashboard;
