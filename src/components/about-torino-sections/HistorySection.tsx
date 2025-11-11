"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';

const historyData = [
  { period: "1st Century BC", event: "Founded by the Taurini tribe as *Augusta Taurinorum* (Roman colony)." },
  { period: "16th Century", event: "Became the capital of the **Duchy of Savoy**." },
  { period: "1706", event: "Attacked by France, but successfully defended (Battle of Turin)." },
  { period: "1861–1865", event: "**First capital of Italy** after unification." },
  { period: "20th Century", event: "Grew as an automotive industry hub for FIAT, Lancia, Iveco." },
  { period: "2006", event: "Hosted the **Torino 2006 Winter Olympics**." },
  { period: "Present", event: "A city of universities, culture, and green technology innovation." },
];

const HistorySection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <History className="h-5 w-5 mr-2 text-purple-600" /> Brief History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="w-[150px] py-3 px-4 text-gray-600 dark:text-gray-400">Period</TableHead>
              <TableHead className="py-3 px-4 text-gray-600 dark:text-gray-400">Event</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((item, index) => (
              <TableRow key={index} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TableCell className="font-medium py-3 px-4 text-gray-700 dark:text-gray-300">{item.period}</TableCell>
                <TableCell className="py-3 px-4 text-gray-800 dark:text-gray-200">{item.event}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HistorySection;