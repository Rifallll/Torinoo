"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Users } from 'lucide-react';

const demographicsData = [
  { label: "Population (2024)", value: "±850,000" },
  { label: "Households", value: "±360,000" },
  { label: "Average age", value: "44 years" },
  { label: "Male:Female Ratio", value: "48:52" },
  { label: "Foreign residents", value: "±15% of total population" },
  { label: "Population growth", value: "-0.4% per year" },
];

const DemographicsSection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <Users className="h-5 w-5 mr-2 text-cyan-600" /> Demographics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {demographicsData.map((item, index) => (
              <TableRow key={index} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TableCell className="font-medium w-1/2 py-3 px-4 text-gray-700 dark:text-gray-300">{item.label}</TableCell>
                <TableCell className="w-1/2 py-3 px-4 text-gray-800 dark:text-gray-200">{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DemographicsSection;