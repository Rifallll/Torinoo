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

interface EducationResearchSectionProps {
  id?: string;
}

const EducationResearchSection: React.FC<EducationResearchSectionProps> = ({ id }) => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg" id={id}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" /> Education & Research
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {educationResearch.map((item, index) => (
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

export default EducationResearchSection;