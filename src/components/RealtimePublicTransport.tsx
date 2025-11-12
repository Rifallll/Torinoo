"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, TramFront, Clock, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TransportItem {
  id: string;
  type: 'Bus' | 'Tram';
  route: string;
  status: 'On Time' | 'Delayed' | 'Approaching';
  eta: string; // Estimated Time of Arrival
  location: string;
}

const initialTransportData: TransportItem[] = [
  { id: 'b001', type: 'Bus', route: 'Line 101', status: 'On Time', eta: '5 min', location: 'Via Roma' },
  { id: 't001', type: 'Tram', route: 'Line 4', status: 'Delayed', eta: '12 min', location: 'Piazza Castello' },
  { id: 'b002', type: 'Bus', route: 'Line 68', status: 'Approaching', eta: '1 min', location: 'Corso Vittorio Emanuele II' },
  { id: 't002', type: 'Tram', route: 'Line 15', status: 'On Time', eta: '8 min', location: 'Porta Nuova' },
];

const RealtimePublicTransport: React.FC = () => {
  const [transportData, setTransportData] = useState<TransportItem[]>(initialTransportData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTransportData(prevData =>
        prevData.map(item => {
          // Simulate status changes and ETA updates
          const newEta = parseInt(item.eta) - 1;
          if (newEta <= 0) {
            return { ...item, eta: 'Arrived', status: 'On Time' }; // Reset or mark as arrived
          }
          const newStatus = Math.random() > 0.8 ? 'Delayed' : (newEta <= 2 ? 'Approaching' : 'On Time');
          return { ...item, eta: `${newEta} min`, status: newStatus };
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusBadgeClass = (status: TransportItem['status']) => {
    switch (status) {
      case 'On Time': return "bg-green-100 text-green-600 hover:bg-green-100";
      case 'Delayed': return "bg-red-100 text-red-600 hover:bg-red-100";
      case 'Approaching': return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100";
      default: return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  const getTypeIcon = (type: TransportItem['type']) => {
    return type === 'Bus' ? <Bus className="h-4 w-4 mr-1" /> : <TramFront className="h-4 w-4 mr-1" />;
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          {getTypeIcon('Bus')} {/* Using Bus icon as primary for title */}
          <span className="ml-2">Transportasi Publik Real-Time</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transportData.length > 0 ? (
          transportData.map(item => (
            <div key={item.id} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                  {getTypeIcon(item.type)} {item.type} {item.route}
                </h4>
                <Badge className={getStatusBadgeClass(item.status)}>
                  {item.status === 'Delayed' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {item.status === 'On Time' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {item.status === 'Approaching' && <Clock className="h-3 w-3 mr-1" />}
                  {item.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> {item.location}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> ETA: {item.eta}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Tidak ada data transportasi publik yang tersedia.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimePublicTransport;