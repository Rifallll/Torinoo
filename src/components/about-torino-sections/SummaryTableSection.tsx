"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Info } from 'lucide-react';

const summaryTableData = [
  { indicator: "Population", value: "±850,000" },
  { indicator: "City Area", value: "130 km²" },
  { indicator: "GDP per Capita", value: "€33,000" },
  { indicator: "Metro Line Length", value: "15 km" },
  { indicator: "Average Congestion", value: "28%" },
  { indicator: "Bicycle Paths", value: "220 km" },
  { indicator: "Low Emission Zones", value: "12 districts" },
  { indicator: "Elevation", value: "240 m" },
  { indicator: "Founded", value: "1st Century BC" },
];

interface SummaryTableSectionProps {
  id?: string;
}

const SummaryTableSection: React.FC<SummaryTableSectionProps> = ({ id }) => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg" id={id}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <Info className="h-5 w-5 mr-2 text-blue-600" /> Quick Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="w-1/2 py-3 px-4 text-gray-600 dark:text-gray-400">Indicator</TableHead>
              <TableHead className="w-1/2 py-3 px-4 text-gray-600 dark:text-gray-400">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryTableData.map((item, index) => (
              <TableRow key={index} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TableCell className="font-medium py-3 px-4 text-gray-700 dark:text-gray-300">{item.indicator}</TableCell>
                <TableCell className="py-3 px-4 text-gray-800 dark:text-gray-200">{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SummaryTableSection;