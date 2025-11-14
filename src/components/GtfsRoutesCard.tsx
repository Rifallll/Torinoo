"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route, Bus, TramFront, Info, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useGtfsData } from '@/hooks/useGtfsData';
import { getRouteTypeIcon } from '@/utils/gtfsRealtimeParser'; // Re-use the utility icon function

const GtfsRoutesCard: React.FC = React.memo(() => {
  const { data: gtfsData, isLoading, error } = useGtfsData();
  const transitlandRoutes = gtfsData?.routes || [];
  const agencies = gtfsData?.agencies || [];

  const getRouteTypeLabel = (routeType: number) => {
    switch (routeType) {
      case 0: return 'Tram';
      case 1: return 'Subway';
      case 2: return 'Rail';
      case 3: return 'Bus';
      case 4: return 'Ferry';
      case 5: return 'Cable Car';
      case 6: return 'Gondola';
      case 7: return 'Funicular';
      default: return 'Lainnya';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Route className="h-5 w-5 mr-2 text-indigo-600" /> Rute Transportasi Publik (Lokal GTFS)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Memuat rute transportasi publik lokal...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Route className="h-5 w-5 mr-2 text-indigo-600" /> Rute Transportasi Publik (Lokal GTFS)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-500 text-center py-4">Gagal memuat rute lokal: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const displayedRoutes = transitlandRoutes.slice(0, 5);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Route className="h-5 w-5 mr-2 text-indigo-600" /> Rute Transportasi Publik (Lokal GTFS)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transitlandRoutes.length > 0 ? (
          <div className="space-y-3">
            {displayedRoutes.map(route => (
              <div key={route.route_id} className="border-b last:border-b-0 pb-2 last:pb-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                    {getRouteTypeIcon(route.route_id, route.route_type)}
                    {route.route_short_name ? `${route.route_short_name} - ` : ''}{route.route_long_name || route.route_short_name || 'N/A'}
                  </h4>
                  <Badge variant="outline" className="text-xs capitalize">
                    {getRouteTypeLabel(route.route_type)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                  {route.route_desc || `Operator: ${agencies.find(a => a.agency_id === route.agency_id)?.agency_name || 'N/A'}`}
                </p>
              </div>
            ))}
            {transitlandRoutes.length > 5 && (
              <div className="text-center mt-4">
                <Button asChild variant="outline" className="">
                  <Link to="/all-gtfs-routes">
                    <span>Lihat Semua Rute ({transitlandRoutes.length - 5} lainnya)</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada rute transportasi publik yang tersedia dari data GTFS lokal.</p>
        )}
      </CardContent>
    </Card>
  );
});

export default GtfsRoutesCard;