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
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Users className="h-5 w-5 mr-2 text-cyan-600" /> Demographics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {demographicsData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium w-1/2">{item.label}</TableCell>
                <TableCell className="w-1/2">{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DemographicsSection;