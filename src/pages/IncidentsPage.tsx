"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Car, Clock, CheckCircle2 } from 'lucide-react'; // Ensuring CheckCircle2 is imported
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const incidentData = [
  {
    id: 'i001',
    type: 'Accident',
    location: 'Main St & 1st Ave',
    status: 'Ongoing',
    severity: 'High',
    reportedAt: '10:30 AM',
    description: 'Multi-vehicle collision, expect significant delays.',
  },
  {
    id: 'i002',
    type: 'Roadwork',
    location: 'Oak Ave near Park St',
    status: 'Scheduled',
    severity: 'Medium',
    reportedAt: 'Yesterday',
    description: 'Lane closures for utility maintenance, 09:00 AM - 03:00 PM daily.',
  },
  {
    id: 'i003',
    type: 'Heavy Congestion',
    location: 'Pine Rd Bridge',
    status: 'Resolved',
    severity: 'Low',
    reportedAt: '08:00 AM',
    description: 'Morning rush hour congestion cleared.',
  },
  {
    id: 'i004',
    type: 'Vehicle Breakdown',
    location: 'Highway 101, Exit 5',
    status: 'Ongoing',
    severity: 'Medium',
    reportedAt: '11:45 AM',
    description: 'Stalled vehicle blocking right lane.',
  },
];

const IncidentsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <AlertTriangle className="h-8 w-8 mr-3 text-indigo-600" />
          Traffic Incidents
        </h1>
        <Button asChild variant="outline">
          <Link to="/dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {incidentData.map(incident => (
          <Card key={incident.id} className="overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{incident.type}: {incident.location}</CardTitle>
              <p className="text-sm text-gray-500">Reported: {incident.reportedAt}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-gray-700 mb-4">{incident.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <Badge
                    className={
                      incident.status === "Ongoing"
                        ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"
                        : incident.status === "Resolved"
                        ? "bg-green-100 text-green-600 hover:bg-green-100"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-100"
                    }
                  >
                    {incident.status === "Ongoing" && <Clock className="h-3 w-3 mr-1" />}
                    {incident.status === "Resolved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {incident.status === "Scheduled" && <Car className="h-3 w-3 mr-1" />}
                    {incident.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Severity:</span>
                  <Badge
                    className={
                      incident.severity === "High"
                        ? "bg-red-100 text-red-600 hover:bg-red-100"
                        : incident.severity === "Medium"
                        ? "bg-orange-100 text-orange-600 hover:bg-orange-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                    }
                  >
                    {incident.severity}
                  </Badge>
                </div>
              </div>
              <Button asChild variant="link" className="p-0 h-auto justify-start">
                <Link to={`/incidents/${incident.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default IncidentsPage;