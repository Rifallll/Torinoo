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

const CuisineSection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Utensils className="h-5 w-5 mr-2 text-brown-600" /> Torino's Signature Cuisine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Food / Drink</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cuisineData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.item}</TableCell>
                <TableCell>{item.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CuisineSection;