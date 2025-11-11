"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { MapPin } from 'lucide-react';

const geographyClimate = [
  { label: "Location", value: "Located in northwestern Italy, at the foot of the Alps and on the banks of the Po River." },
  { label: "Borders", value: "North: Venaria Reale; South: Moncalieri; East: San Mauro Torinese; West: Collegno" },
  { label: "Elevation", value: "±240 meters above sea level." },
  { label: "Main Rivers", value: "Po, Dora Riparia, Stura di Lanzo." },
  { label: "Climate", value: "Humid continental (cold snowy winters, warm summers)." },
  { label: "Average Temperature", value: "12°C per year." },
  { label: "Annual Rainfall", value: "±850 mm." },
];

const GeographyClimateSection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-orange-600" /> Geography & Climate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {geographyClimate.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium w-1/3">{item.label}</TableCell>
                <TableCell className="w-2/3">{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GeographyClimateSection;