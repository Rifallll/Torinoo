"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Utensils } from 'lucide-react';

const cuisineData = [
  { item: "Gianduja", description: "Torino's signature chocolate with hazelnut paste." },
  { item: "Bicerin", description: "Traditional drink of espresso, liquid chocolate, and milk cream." },
  { item: "Vitello tonnato", description: "Veal with tuna sauce." },
  { item: "Agnolotti", description: "Piedmontese stuffed pasta." },
  { item: "Barolo & Barbaresco", description: "Red wines typical of the Piedmont region." },
];

interface CuisineSectionProps {
  id?: string;
}

const CuisineSection: React.FC<CuisineSectionProps> = ({ id }) => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg" id={id}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <Utensils className="h-5 w-5 mr-2 text-brown-600" /> Torino's Signature Cuisine
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="w-1/3 py-3 px-4 text-gray-600 dark:text-gray-400">Food / Drink</TableHead>
              <TableHead className="py-3 px-4 text-gray-600 dark:text-gray-400">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cuisineData.map((item, index) => (
              <TableRow key={index} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TableCell className="font-medium py-3 px-4 text-gray-700 dark:text-gray-300">{item.item}</TableCell>
                <TableCell className="py-3 px-4 text-gray-800 dark:text-gray-200">{item.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CuisineSection;