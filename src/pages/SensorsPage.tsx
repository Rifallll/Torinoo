"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wifi, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const sensorData = [
  {
    id: 's001',
    name: 'Main Street Intersection Sensor',
    location: '123 Main St, Anytown',
    status: 'Active',
    type: 'Traffic Flow',
    lastReading: '2 minutes ago',
  },
  {
    id: 's002',
    name: 'Oak Avenue Highway Sensor',
    location: '456 Oak Ave, Somewhere',
    status: 'Warning',
    type: 'Speed Detection',
    lastReading: '5 minutes ago',
  },
  {
    id: 's003',
    name: 'Pine Road Residential Sensor',
    location: '789 Pine Rd, Nowhere',
    status: 'Offline',
    type: 'Congestion',
    lastReading: '1 hour ago',
  },
  {
    id: 's004',
    name: 'Bridge A Structural Sensor',
    location: 'Bridge A, River City',
    status: 'Active',
    type: 'Structural Integrity',
    lastReading: '10 minutes ago',
  },
];

const SensorsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Wifi className="h-8 w-8 mr-3 text-indigo-600" />
          Sensor Management
        </h1>
        <Button asChild variant="outline">
          <Link to="/dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {sensorData.map(sensor => (
          <Card key={sensor.id} className="overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{sensor.name}</CardTitle>
              <p className="text-sm text-gray-500">{sensor.location}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <Badge
                    className={
                      sensor.status === "Active"
                        ? "bg-green-100 text-green-600 hover:bg-green-100"
                        : sensor.status === "Warning"
                        ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"
                        : "bg-red-100 text-red-600 hover:bg-red-100"
                    }
                  >
                    {sensor.status === "Active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {sensor.status === "Warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {sensor.status === "Offline" && <Wifi className="h-3 w-3 mr-1" />}
                    {sensor.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Type:</span>
                  <span>{sensor.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Last Reading:</span>
                  <span>{sensor.lastReading}</span>
                </div>
              </div>
              <Button variant="link" className="p-0 h-auto justify-start">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default SensorsPage;