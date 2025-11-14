"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrafficCone, AlertTriangle, Info } from 'lucide-react'; // Import TrafficCone
import { Badge } from '@/components/ui/badge';
// import { useGtfsRealtimeData } from '@/hooks/useGtfsRealtimeData'; // Removed: No longer using GTFS-realtime alerts here
// import { getRouteTypeIcon } from '@/utils/gtfsRealtimeParser'; // Removed: No longer needed for route-specific icons
import { mockTrafficChanges } from '@/components/TrafficChangesInsights'; // Import mockTrafficChanges

const PublicTransportAlertsCard: React.FC = React.memo(() => {
  // const { data, isLoading, error } = useGtfsRealtimeData(); // Removed
  // const alerts = data.alerts; // Removed

  // We will use mockTrafficChanges directly
  const trafficChanges = mockTrafficChanges;

  // No loading/error state from GTFS-realtime hook, as we're using local mock data
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <TrafficCone className="h-5 w-5 mr-2 text-indigo-600" />
            Perubahan Lalu Lintas & Pekerjaan Jalan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Memuat perubahan lalu lintas...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <TrafficCone className="h-5 w-5 mr-2 text-indigo-600" />
            Perubahan Lalu Lintas & Pekerjaan Jalan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-500 text-center py-4">Gagal memuat perubahan: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <TrafficCone className="h-5 w-5 mr-2 text-indigo-600" />
          Perubahan Lalu Lintas & Pekerjaan Jalan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trafficChanges.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" /> Perubahan Aktif
            </h3>
            {trafficChanges.map(change => (
              <div key={change.id} className="border-l-4 border-orange-500 pl-3 py-2 bg-orange-50/50 dark:bg-orange-900/20 rounded-r-md">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{change.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{change.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs flex items-center">
                    <TrafficCone className="h-4 w-4 mr-1" /> {change.type ? change.type.charAt(0).toUpperCase() + change.type.slice(1) : 'Perubahan'}
                  </Badge>
                  {change.responsibleEntity && (
                    <Badge variant="secondary" className="text-xs flex items-center">
                      <Info className="h-4 w-4 mr-1" /> {change.responsibleEntity}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada perubahan lalu lintas aktif yang dilaporkan.</p>
        )}
      </CardContent>
    </Card>
  );
});

export default PublicTransportAlertsCard;