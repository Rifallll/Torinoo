"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, TramFront, Clock, MapPin, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockTripUpdates, mockAlerts, MockTripUpdate, MockAlert } from '@/data/mockGtfsRealtime'; // Import mock data

const RealtimePublicTransport: React.FC = () => {
  const [tripUpdates, setTripUpdates] = useState<MockTripUpdate[]>(mockTripUpdates);
  const [alerts, setAlerts] = useState<MockAlert[]>(mockAlerts);

  // Simulate real-time updates for trip delays
  useEffect(() => {
    const interval = setInterval(() => {
      setTripUpdates(prevUpdates =>
        prevUpdates.map(update => {
          // Simulate delay changes
          const newDelay = update.delaySeconds + Math.floor(Math.random() * 60) - 30; // +/- 30 seconds
          return { ...update, delaySeconds: newDelay };
        })
      );
      // Filter active alerts (mocking active period)
      setAlerts(mockAlerts.filter(alert => {
        const now = Math.floor(Date.now() / 1000);
        return now >= alert.activePeriod.start && now <= alert.activePeriod.end;
      }));
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const formatDelay = (delaySeconds: number) => {
    if (delaySeconds === 0) return 'On Time';
    const minutes = Math.abs(Math.round(delaySeconds / 60));
    if (delaySeconds > 0) return `${minutes} min Delayed`;
    return `${minutes} min Early`;
  };

  const getDelayBadgeClass = (delaySeconds: number) => {
    if (delaySeconds > 120) return "bg-red-100 text-red-600 hover:bg-red-100"; // More than 2 min delay
    if (delaySeconds > 0) return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"; // Delayed
    if (delaySeconds < 0) return "bg-green-100 text-green-600 hover:bg-green-100"; // Early
    return "bg-gray-100 text-gray-600 hover:bg-gray-100"; // On Time
  };

  const getRouteTypeIcon = (routeType?: number) => {
    if (routeType === 3) return <Bus className="h-4 w-4 mr-1" />; // Bus
    if (routeType === 0) return <TramFront className="h-4 w-4 mr-1" />; // Tram
    return <Info className="h-4 w-4 mr-1" />; // Default/Unknown
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Bus className="h-5 w-5 mr-2 text-indigo-600" />
          Transportasi Publik Real-Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length > 0 && (
          <div className="space-y-2 mb-4">
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" /> Peringatan Aktif
            </h3>
            {alerts.map(alert => (
              <div key={alert.id} className="border-l-4 border-orange-500 pl-3 py-1 bg-orange-50/50 dark:bg-orange-900/20 rounded-r-md">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{alert.headerText}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{alert.descriptionText}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {alert.informedEntities.map((entity, idx) => (
                    entity.routeId && (
                      <Badge key={idx} variant="secondary" className="text-xs flex items-center">
                        {getRouteTypeIcon(entity.routeType)} Jalur {entity.routeId}
                      </Badge>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Clock className="h-4 w-4 mr-2" /> Pembaruan Perjalanan
        </h3>
        {tripUpdates.length > 0 ? (
          tripUpdates.map(update => (
            <div key={update.id} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                  {getRouteTypeIcon(update.routeId === '101' || update.routeId === '68' ? 3 : 0)} {/* Simple type inference */}
                  Jalur {update.routeId} ({update.tripId})
                </h4>
                <Badge className={getDelayBadgeClass(update.delaySeconds)}>
                  {formatDelay(update.delaySeconds)}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> Stop Seq: {update.currentStopSequence}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> Status: {update.currentStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada pembaruan perjalanan yang tersedia.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimePublicTransport;