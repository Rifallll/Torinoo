"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Globe } from 'lucide-react';

const generalInfo = [
  { label: "Official Name", value: "City of Torino (Turin)" },
  { label: "Name in Italian", value: "Città di Torino" },
  { label: "Country", value: "Italy" },
  { label: "Region", value: "Piedmont (Piemonte)" },
  { label: "Coordinates", value: "45.0703° N, 7.6869° E" },
  { label: "Area", value: "±130 km²" },
  { label: "Population (2024)", value: "±850,000 inhabitants" },
  { label: "Metropolitan Population", value: "±2 million inhabitants" },
  { label: "Population Density", value: "±6,500 inhabitants/km²" },
  { label: "Time Zone", value: "UTC+1 (CET), UTC+2 (CEST in summer)" },
  { label: "Postal Codes", value: "10100–10156" },
  { label: "Vehicle Code", value: "TO" },
  { label: "Official Language", value: "Italian" },
  { label: "City Nicknames", value: "“La Città dell’Automobile” (The Automotive City), “La Capitale Sabauda” (The Savoy Capital)”" },
];

interface GeneralInfoSectionProps {
  id?: string;
}

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ id }) => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg" id={id}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <Globe className="h-5 w-5 mr-2 text-blue-600" /> General Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {generalInfo.map((item, index) => (
              <TableRow key={index} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TableCell className="font-medium w-1/3 py-3 px-4 text-gray-700 dark:text-gray-300">{item.label}</TableCell>
                <TableCell className="w-2/3 py-3 px-4 text-gray-800 dark:text-gray-200">{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GeneralInfoSection;