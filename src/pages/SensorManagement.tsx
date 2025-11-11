"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';

const SensorManagement = () => {
  // Dummy sensor data
  const sensors = [
    { id: 'S001', name: 'Main Street Intersection', status: 'Active', type: 'Traffic Flow', location: 'Lat: 51.505, Lng: -0.09' },
    { id: 'S002', name: 'Oak Avenue Bridge', status: 'Warning', type: 'Speed Radar', location: 'Lat: 51.510, Lng: -0.10' },
    { id: 'S003', name: 'Pine Road Residential', status: 'Offline', type: 'Congestion', location: 'Lat: 51.520, Lng: -0.08' },
    { id: 'S004', name: 'City Center Plaza', status: 'Active', type: 'Pedestrian Count', location: 'Lat: 51.500, Lng: -0.12' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <MapPin className="h-8 w-8 mr-3 text-green-600" />
          Sensor Management
        </h1>
        <Button asChild variant="outline">
          <Link to="/dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2" />
              All Sensors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sensors.map(sensor => (
                <div key={sensor.id} className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{sensor.name} ({sensor.id})</p>
                    <p className="text-sm text-gray-600">{sensor.type} - {sensor.location}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    sensor.status === 'Active' ? 'bg-green-100 text-green-800' :
                    sensor.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sensor.status}
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full">Add New Sensor</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Sensor Settings & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              This section will allow you to configure individual sensors, view real-time data streams, and analyze historical performance.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Monitor sensor health and uptime.</li>
              <li>Adjust data collection parameters.</li>
              <li>View traffic density graphs.</li>
              <li>Set up alerts for unusual activity.</li>
            </ul>
            <Button variant="outline" className="mt-6 w-full">Go to Detailed Settings</Button>
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default SensorManagement;