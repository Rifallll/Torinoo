"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Palette } from 'lucide-react';

const landmarkData = [
  { name: "Mole Antonelliana", description: "Torino's iconic tower, now home to the National Museum of Cinema." },
  { name: "Museo Egizio", description: "The largest Egyptian Museum outside Egypt." },
  { name: "Piazza Castello", description: "The historic main square of the city center." },
  { name: "Palazzo Reale & Palazzo Madama", description: "The Savoy royal palace complex." },
  { name: "Parco del Valentino", description: "A large park on the banks of the Po River." },
  { name: "Basilica di Superga", description: "A church on a hilltop with panoramic city views." },
];

const festivalsEvents = [
  "Torino Film Festival",
  "Torino Jazz Festival",
  "Artissima (contemporary art exhibition)",
  "Cioccolatò (chocolate festival)",
  "Salone dell’Auto",
];

const CultureTourismSection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <Palette className="h-5 w-5 mr-2 text-pink-600" /> Culture & Tourism
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        <div>
          <h3 className="text-lg font-semibold mb-2 px-4 pt-4 text-gray-800 dark:text-gray-100">Main Landmarks</h3>
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-1/3 py-3 px-4 text-gray-600 dark:text-gray-400">Name</TableHead>
                <TableHead className="py-3 px-4 text-gray-600 dark:text-gray-400">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {landmarkData.map((item, index) => (
                <TableRow key={index} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <TableCell className="font-medium py-3 px-4 text-gray-700 dark:text-gray-300">{item.name}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-800 dark:text-gray-200">{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 px-4 pt-4 text-gray-800 dark:text-gray-100">Festivals & Events</h3>
          <ul className="list-disc list-inside pl-8 pb-4 space-y-1 text-gray-700 dark:text-gray-300">
            {festivalsEvents.map((event, index) => (
              <li key={index} className="py-1">{event}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CultureTourismSection;