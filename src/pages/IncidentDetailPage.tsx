"use client";

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Car, Clock, CheckCircle2, MapPin, CalendarDays, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data for incidents (should ideally come from an API)
const incidentData = [
  {
    id: 'i001',
    type: 'Accident',
    location: 'Main St & 1st Ave',
    status: 'Ongoing',
    severity: 'High',
    reportedAt: '2023-11-10 10:30 AM',
    description: 'Multi-vehicle collision involving three cars. Emergency services are on site. Expect significant delays and consider alternative routes. Road expected to clear by 1:00 PM.',
    affectedLanes: '2 lanes blocked (Eastbound)',
    responseTeam: 'Traffic Management Unit 1',
    lastUpdate: '2023-11-10 11:15 AM',
  },
  {
    id: 'i002',
    type: 'Roadwork',
    location: 'Oak Ave near Park St',
    status: 'Scheduled',
    severity: 'Medium',
    reportedAt: '2023-11-09 04:00 PM',
    description: 'Scheduled utility maintenance. Lane closures will be in effect from 09:00 AM to 03:00 PM daily, starting November 13th for one week.',
    affectedLanes: '1 lane closed (Northbound)',
    contractor: 'City Utilities',
    schedule: 'Nov 13 - Nov 17',
  },
  {
    id: 'i003',
    type: 'Heavy Congestion',
    location: 'Pine Rd Bridge',
    status: 'Resolved',
    severity: 'Low',
    reportedAt: '2023-11-10 08:00 AM',
    description: 'Morning rush hour congestion due to high volume. Traffic flow has returned to normal by 09:30 AM.',
    peakTime: '07:45 AM - 09:15 AM',
    duration: '1 hour 30 minutes',
    cause: 'High commuter volume',
  },
  {
    id: 'i004',
    type: 'Vehicle Breakdown',
    location: 'Highway 101, Exit 5',
    status: 'Ongoing',
    severity: 'Medium',
    reportedAt: '2023-11-10 11:45 AM',
    description: 'Stalled vehicle (blue sedan) blocking the right lane. Tow truck dispatched, ETA 30 minutes. Drive with caution.',
    affectedLanes: 'Right lane blocked (Southbound)',
    vehicleType: 'Sedan',
    towTruckETA: '12:15 PM',
  },
];

const IncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const incident = incidentData.find(inc => inc.id === id);

  if (!incident) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Incident Not Found</h1>
        <p className="text-gray-600 mb-6">The incident you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/incidents" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Incidents
          </Link>
        </Button>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Ongoing": return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100";
      case "Resolved": return "bg-green-100 text-green-600 hover:bg-green-100";
      case "Scheduled": return "bg-blue-100 text-blue-600 hover:bg-blue-100";
      default: return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-600 hover:bg-red-100";
      case "Medium": return "bg-orange-100 text-orange-600 hover:bg-orange-100";
      case "Low": return "bg-gray-100 text-gray-600 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <AlertTriangle className="h-8 w-8 mr-3 text-indigo-600" />
          Incident Details
        </h1>
        <Button asChild variant="outline">
          <Link to="/incidents" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Incidents
          </Link>
        </Button>
      </header>

      <main className="flex-1">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Info className="h-6 w-6 mr-2 text-indigo-600" />
              {incident.type}: {incident.location}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getStatusBadgeClass(incident.status)}>
                {incident.status === "Ongoing" && <Clock className="h-3 w-3 mr-1" />}
                {incident.status === "Resolved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {incident.status === "Scheduled" && <Car className="h-3 w-3 mr-1" />}
                {incident.status}
              </Badge>
              <Badge className={getSeverityBadgeClass(incident.severity)}>
                {incident.severity} Severity
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <strong>Location:</strong> {incident.location}
            </div>
            <div className="flex items-center text-gray-700">
              <CalendarDays className="h-5 w-5 mr-2 text-gray-500" />
              <strong>Reported At:</strong> {incident.reportedAt}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description:</h3>
              <p className="text-gray-700">{incident.description}</p>
            </div>

            {/* Additional details based on incident type */}
            {incident.type === 'Accident' && (
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <strong>Affected Lanes:</strong> {incident.affectedLanes}
                </div>
                <div className="flex items-center text-gray-700">
                  <strong>Response Team:</strong> {incident.responseTeam}
                </div>
                <div className="flex items-center text-gray-700">
                  <strong>Last Update:</strong> {incident.lastUpdate}
                </div>
              </div>
            )}

            {incident.type === 'Roadwork' && (
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <strong>Affected Lanes:</strong> {incident.affectedLanes}
                </div>
                <div className="flex items-center text-gray-700">
                  <strong>Contractor:</strong> {incident.contractor}
                </div>
                <div className="flex items-center text-gray-700">
                  <strong>Schedule:</strong> {incident.schedule}
                </div>
              </div>
            )}

            {incident.type === 'Heavy Congestion' && (
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <strong>Peak Time:</strong> {incident.peakTime}
                </div>
                <div className="flex items-center text-gray-700">
                  <strong>Duration:</strong> {incident.duration}
                </div>
                <div className="flex items-center text-gray-700">
                  <strong>Cause:</strong> {incident.cause}
                </div>
              </div>
            )}

            {incident.type === 'Vehicle Breakdown' && (
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <strong>Affected Lanes:</strong> {incident.affectedLanes}
                </div>
                <div className="flex items-center text-gray-700">
                  <strong>Vehicle Type:</strong> {incident.vehicleType}
                </div>
                <div className="flex items-center text-gray-700">
                  <strong>Tow Truck ETA:</strong> {incident.towTruckETA}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default IncidentDetailPage;