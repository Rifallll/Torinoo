"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrafficCone, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockTrafficChanges } from '@/components/TrafficChangesInsights';
import { Link } from 'react-router-dom';

const PublicTransportAlertsCard: React.FC = React.memo(() => {
  const trafficChanges = mockTrafficChanges;

  const isLoading = false;
  const error = null;

  const displayedTrafficChanges = trafficChanges.slice(0, 4); // Display up to 4 items

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <TrafficCone className="h-5 w-5 mr-2 text-indigo-600" />
            Traffic Changes & Roadworks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">Loading traffic changes...</p>
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
            Traffic Changes & Roadworks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-500 text-center py-4">Failed to load changes: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <TrafficCone className="h-5 w-5 mr-2 text-indigo-600" />
          Traffic Changes & Roadworks
        </CardTitle>
        {trafficChanges.length > 4 && (
          <Link to="/traffic-changes" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedTrafficChanges.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" /> Active Changes
            </h3>
            {displayedTrafficChanges.map(change => (
              <div key={change.id} className="border-l-4 border-orange-500 pl-3 py-2 bg-orange-50/50 dark:bg-orange-900/20 rounded-r-md">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{change.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{change.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs flex items-center">
                    <TrafficCone className="h-4 w-4 mr-1" /> {change.type ? change.type.charAt(0).toUpperCase() + change.type.slice(1) : 'Change'}
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
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">No active traffic changes reported.</p>
        )}
      </CardContent>
    </Card>
  );
});

export default PublicTransportAlertsCard;