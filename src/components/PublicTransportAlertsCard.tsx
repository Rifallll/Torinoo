"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGtfsRealtimeData } from '@/hooks/useGtfsRealtimeData';
import { getRouteTypeIcon } from '@/utils/gtfsRealtimeParser';

const PublicTransportAlertsCard: React.FC = React.memo(() => {
  const { data, isLoading, error } = useGtfsRealtimeData();
  const alerts = data.alerts;

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Bus className="h-5 w-5 mr-2 text-indigo-600" />
            Real-Time Public Transport
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Loading public transport alerts...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <Bus className="h-5 w-5 mr-2 text-indigo-600" />
            Real-Time Public Transport
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-500 text-center py-4">Failed to load alerts: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Bus className="h-5 w-5 mr-2 text-indigo-600" />
          Real-Time Public Transport
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" /> Active Alerts
            </h3>
            {alerts.map(alert => (
              <div key={alert.id} className="border-l-4 border-orange-500 pl-3 py-2 bg-orange-50/50 dark:bg-orange-900/20 rounded-r-md">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{alert.header_text?.translation?.[0]?.text || 'N/A'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{alert.description_text?.translation?.[0]?.text || 'N/A'}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {alert.informed_entity?.map((entity, idx) => (
                    entity.route_id && (
                      <Badge key={idx} variant="secondary" className="text-xs flex items-center">
                        {getRouteTypeIcon(entity.route_id, entity.route_type)} Route {entity.route_id}
                      </Badge>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">No active public transport alerts.</p>
        )}
      </CardContent>
    </Card>
  );
});

export default PublicTransportAlertsCard;