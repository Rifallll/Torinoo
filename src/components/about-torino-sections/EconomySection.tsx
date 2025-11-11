"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DollarSign } from 'lucide-react';

const economyData = [
  { label: "Main sectors", value: "Automotive, energy, design, tourism, higher education, and information technology." },
  { label: "Major companies", value: "FIAT, Lancia, Iveco, Stellantis Group." },
  { label: "GDP per capita", value: "±€33,000." },
  { label: "Industrial sector employment", value: "±35%." },
  { label: "Startups & innovation", value: "Turin Tech Hub, Smart City Lab." },
  { label: "Main exports", value: "Vehicles, industrial machinery, design products, and chocolate (Ferrero)." },
];

const EconomySection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-yellow-600" /> Economy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {economyData.map((item, index) => (
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

export default EconomySection;