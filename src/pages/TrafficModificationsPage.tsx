"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrafficCone, MapPin, Info, CalendarDays, RefreshCw } from 'lucide-react'; // Added RefreshCw icon
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrafficModifications, TrafficModification } from '@/utils/trafficModificationsApi'; // Import the new hook

const TrafficModificationsPage: React.FC = () => {
  const { data: modifications, isLoading, isError, error, refetch, isRefetching } = useTrafficModifications();

  const getStatusBadgeClass = (status: TrafficModification['status']) => {
    switch (status) {
      case 'red': return 'bg-red-100 text-red-600 hover:bg-red-100';
      case 'yellow': return 'bg-yellow-100 text-yellow-600 hover:bg-yellow-100';
      case 'green': return 'bg-green-100 text-green-600 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <TrafficCone className="h-8 w-8 mr-3 text-indigo-600" />
          Modifikasi Lalu Lintas Real-Time
        </h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center"
          >
            {isRefetching ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">Memuat modifikasi lalu lintas...</p>
        ) : isError ? (
          <p className="text-red-500 text-center py-4 col-span-full">Error: {error?.message || "Gagal memuat data modifikasi lalu lintas."}</p>
        ) : modifications && modifications.length > 0 ? (
          modifications.map(mod => (
            <Card key={mod.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  {mod.title}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {mod.id}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-2">
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{mod.shortDescription}</p>
                {mod.fullDescription && mod.fullDescription !== mod.shortDescription && (
                  <details className="text-sm text-gray-600 dark:text-gray-400">
                    <summary className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-700">Baca Selengkapnya</summary>
                    <p className="mt-2">{mod.fullDescription}</p>
                  </details>
                )}
                <div className="grid grid-cols-1 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" /> Lat: {mod.latitude.toFixed(4)}, Lon: {mod.longitude.toFixed(4)}
                  </span>
                  <span className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" /> Status: <Badge className={getStatusBadgeClass(mod.status)}>{mod.status.toUpperCase()}</Badge>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">Tidak ada modifikasi lalu lintas yang tersedia.</p>
        )}
      </main>
    </div>
  );
};

export default TrafficModificationsPage;