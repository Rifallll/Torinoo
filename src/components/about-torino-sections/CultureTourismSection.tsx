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
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Palette className="h-5 w-5 mr-2 text-pink-600" /> Culture & Tourism
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Main Landmarks</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {landmarkData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Festivals & Events</h3>
          <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700 dark:text-gray-300">
            {festivalsEvents.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CultureTourismSection;