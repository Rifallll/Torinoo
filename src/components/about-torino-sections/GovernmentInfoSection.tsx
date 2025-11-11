"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Building2 } from 'lucide-react';

const governmentInfo = [
  { label: "Status", value: "Capital of the Piedmont region, Italy." },
  { label: "Government", value: "Comune di Torino (Municipality of Turin)." },
  { label: "Mayor", value: "dummy: Stefano Lo Russo (2025)" },
  { label: "Administrative Divisions", value: "8 Circoscrizioni (administrative districts)." },
  { label: "City Emblem", value: "Blue shield with a golden bull." },
  { label: "Motto", value: "“Fortitudo mea Taurinensis” (My strength is from Turin)." },
];

const GovernmentInfoSection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-green-600" /> Government & Administration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {governmentInfo.map((item, index) => (
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

export default GovernmentInfoSection;