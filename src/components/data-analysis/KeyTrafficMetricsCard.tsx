"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, TrafficCone, Gauge, AlertCircle, Clock, Map, Car, ParkingSquare } from 'lucide-react';

const KeyTrafficMetricsCard: React.FC = () => {
  return (
    <Card className="lg:col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" /> Key Traffic Analysis Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-2">Common Analysis Types:</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <TrafficCone className="h-5 w-5 mr-2 text-red-500" />
              <span>Congestion Analysis: Identifying and measuring traffic bottlenecks.</span>
            </li>
            <li className="flex items-center">
              <Gauge className="h-5 w-5 mr-2 text-blue-500" />
              <span>Average Speed Analysis: Tracking speeds across different road segments.</span>
            </li>
            <li className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Incident Impact Analysis: Assessing how incidents affect traffic flow.</span>
            </li>
            <li className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-500" />
              <span>Travel Time Reliability: Measuring the consistency of travel times.</span>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-2">Advanced Analysis:</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Map className="h-5 w-5 mr-2 text-purple-500" />
              <span>Origin-Destination Analysis: Understanding traffic sources and destinations.</span>
            </li>
            <li className="flex items-center">
              <Car className="h-5 w-5 mr-2 text-orange-500" />
              <span>Vehicle Classification: Categorizing vehicles (cars, trucks, motorcycles).</span>
            </li>
            <li className="flex items-center">
              <ParkingSquare className="h-5 w-5 mr-2 text-teal-500" />
              <span>Parking Pattern Analysis: Optimizing parking availability and usage.</span>
            </li>
            <li className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
              <span>Historical Trend Analysis: Analyzing long-term traffic patterns.</span>
            </li>
          </ul>
        </div>
        <p className="lg:col-span-2 text-sm text-gray-500 mt-4">
          *These analyses are performed by a backend Python system and visualized here.
        </p>
      </CardContent>
    </Card>
  );
};

export default KeyTrafficMetricsCard;