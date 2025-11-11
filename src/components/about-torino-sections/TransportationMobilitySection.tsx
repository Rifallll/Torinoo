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
    <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <Car className="h-5 w-5 mr-2 text-red-600" /> Transportation & Mobility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        <div>
          <h3 className="text-lg font-semibold mb-2 px-4 pt-4 text-gray-800 dark:text-gray-100">Transportation Network</h3>
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-1/3 py-3 px-4 text-gray-600 dark:text-gray-400">Type</TableHead>
                <TableHead className="py-3 px-4 text-gray-600 dark:text-gray-400">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transportationNetwork.map((item, index) => (
                <TableRow key={index} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <TableCell className="font-medium py-3 px-4 text-gray-700 dark:text-gray-300">{item.type}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-800 dark:text-gray-200">{item.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 px-4 pt-4 text-gray-800 dark:text-gray-100">Mobility Statistics</h3>
          <Table>
            <TableBody>
              {mobilityStatistics.map((item, index) => (
                <TableRow key={index} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <TableCell className="font-medium w-1/2 py-3 px-4 text-gray-700 dark:text-gray-300">{item.label}</TableCell>
                  <TableCell className="w-1/2 py-3 px-4 text-gray-800 dark:text-gray-200">{item.value}</TableCell>
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