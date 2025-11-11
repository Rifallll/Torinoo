"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Car } from 'lucide-react';

const transportationNetwork = [
  { type: "Metro", details: "1 line (Linea 1), 21 stations, ±15 km long." },
  { type: "Tram", details: "±10 main routes in the city center." },
  { type: "Bus", details: "More than 80 active routes." },
  { type: "Train", details: "Main stations: Porta Nuova, Porta Susa." },
  { type: "Airport", details: "Torino-Caselle (code: TRN)." },
  { type: "Bicycle Paths", details: "±220 km of official paths." },
  { type: "Low Emission Zones", details: "12 city center districts." },
];

const mobilityStatistics = [
  { label: "Daily vehicle volume", value: "±320,000" },
  { label: "Electric vehicles", value: "±14% of total vehicles." },
  { label: "Public transport usage", value: "±40% of citizens." },
  { label: "Average travel time", value: "±32 minutes." },
  { label: "Average congestion level", value: "28%." },
];

const TransportationMobilitySection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Car className="h-5 w-5 mr-2 text-red-600" /> Transportation & Mobility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Transportation Network</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Type</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transportationNetwork.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell>{item.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Mobility Statistics</h3>
          <Table>
            <TableBody>
              {mobilityStatistics.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium w-1/2">{item.label}</TableCell>
                  <TableCell className="w-1/2">{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportationMobilitySection;