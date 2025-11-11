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

const SummaryTableSection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-600" /> Quick Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Indicator</TableHead>
              <TableHead className="w-1/2">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryTableData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.indicator}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SummaryTableSection;