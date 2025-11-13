"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, PlayCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const cameraFeeds = [
  {
    id: 'cam001',
    name: 'Via Roma - North',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1532936790947-d06f70530588?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Live view of traffic flow on Via Roma, northbound.',
  },
  {
    id: 'cam002',
    name: 'Piazza Castello - East',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Overview of Piazza Castello, showing pedestrian and vehicle activity.',
  },
  {
    id: 'cam003',
    name: 'Corso Vittorio Emanuele II - West',
    status: 'Offline',
    imageUrl: 'https://images.unsplash.com/photo-1541888946526-c29d02993b9f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Camera currently offline for maintenance.',
  },
  {
    id: 'cam004',
    name: 'River Po Bridge',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Monitoring bridge traffic and river conditions.',
  },
];

const TrafficCameraFeed: React.FC = () => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-600 hover:bg-green-100";
      case "Offline": return "bg-red-100 text-red-600 hover:bg-red-100";
      case "Warning": return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100";
      default: return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  const handleViewLive = (cameraName: string) => {
    alert(`Simulating live feed for ${cameraName}.`);
    // In a real application, this would open a video stream or a dedicated camera view.
  };

  return (
    <Card className="lg:col-span-3 bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Camera className="h-5 w-5 mr-2 text-blue-600" /> Traffic Camera Feeds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cameraFeeds.map(camera => (
            <Card key={camera.id} className="overflow-hidden flex flex-col">
              <div className="relative w-full h-36 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <img src={camera.imageUrl} alt={camera.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  {camera.status === 'Active' ? (
                    <Button variant="secondary" size="icon" className="rounded-full opacity-90 hover:opacity-100" onClick={() => handleViewLive(camera.name)}>
                      <PlayCircle className="h-8 w-8 text-white" />
                    </Button>
                  ) : (
                    <span className="text-white text-sm font-medium">Offline</span>
                  )}
                </div>
              </div>
              <CardHeader className="p-3 pb-0">
                <CardTitle className="text-base font-semibold line-clamp-1">{camera.name}</CardTitle>
                <Badge className={getStatusBadgeClass(camera.status)}>{camera.status === 'Active' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />} {camera.status}</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-2 flex-1 flex flex-col justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">{camera.description}</p>
                {camera.status === 'Active' && (
                  <Button variant="link" className="p-0 h-auto justify-start text-sm" onClick={() => handleViewLive(camera.name)}>
                    View Live
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficCameraFeed;