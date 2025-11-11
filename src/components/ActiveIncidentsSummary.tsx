"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight, Clock, CheckCircle2, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const activeIncidents = [
  {
    id: 'i001',
    type: 'Accident',
    location: 'Main St & 1st Ave',
    status: 'Ongoing',
    severity: 'High',
    reportedAt: '10:30 AM',
  },
  {
    id: 'i004',
    type: 'Vehicle Breakdown',
    location: 'Highway 101, Exit 5',
    status: 'Ongoing',
    severity: 'Medium',
    reportedAt: '11:45 AM',
  },
  {
    id: 'i005',
    type: 'Roadwork',
    location: 'Via Roma (Scheduled)',
    status: 'Scheduled',
    severity: 'Low',
    reportedAt: 'Tomorrow',
  },
];

const ActiveIncidentsSummary: React.FC = () => {
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
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" /> Active Incidents
        </CardTitle>
        <Button asChild variant="link" className="p-0 h-auto">
          <Link to="/incidents" className="flex items-center text-indigo-600 hover:text-indigo-700">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeIncidents.length > 0 ? (
          activeIncidents.map(incident => (
            <div key={incident.id} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 line-clamp-1">{incident.type}: {incident.location}</h4>
                <Badge className={getSeverityBadgeClass(incident.severity)}>{incident.severity}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Reported: {incident.reportedAt}</span>
                <Badge className={getStatusBadgeClass(incident.status)}>
                  {incident.status === "Ongoing" && <Clock className="h-3 w-3 mr-1" />}
                  {incident.status === "Resolved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {incident.status === "Scheduled" && <Car className="h-3 w-3 mr-1" />}
                  {incident.status}
                </Badge>
              </div>
              <Button asChild variant="link" className="p-0 h-auto justify-start text-sm mt-1">
                <Link to={`/incidents/${incident.id}`}>Details</Link>
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">No active incidents reported.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveIncidentsSummary;