"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { GraduationCap } from 'lucide-react';

const educationResearch = [
  { label: "Universities", value: "*Università degli Studi di Torino* (founded 1404, ±70,000 students); *Politecnico di Torino* (leading technical university in Italy)." },
  { label: "Key fields", value: "Automotive, AI, renewable energy, architecture, economics." },
  { label: "Research institutions", value: "INRIM (National Institute of Metrological Research), CNR Torino." },
];

const EducationResearchSection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" /> Education & Research
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {educationResearch.map((item, index) => (
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

export default EducationResearchSection;