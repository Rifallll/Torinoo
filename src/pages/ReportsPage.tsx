"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const reportData = [
  {
    id: 'r001',
    title: 'Monthly Traffic Flow Summary - October 2023',
    date: 'November 1, 2023',
    description: 'Comprehensive analysis of traffic volume and speed across key city arteries.',
    type: 'PDF',
  },
  {
    id: 'r002',
    title: 'Incident Response Times - Q3 2023',
    date: 'October 15, 2023',
    description: 'Performance metrics for incident detection and resolution.',
    type: 'CSV',
  },
  {
    id: 'r003',
    title: 'Sensor Network Health Report - Weekly',
    date: 'November 6, 2023',
    description: 'Overview of sensor uptime, data accuracy, and maintenance needs.',
    type: 'PDF',
  },
  {
    id: 'r004',
    title: 'Congestion Hotspot Analysis - Annual',
    date: 'January 10, 2023',
    description: 'Identification of recurring congestion points and proposed solutions.',
    type: 'XLSX',
  },
];

const ReportsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <BarChart2 className="h-8 w-8 mr-3 text-indigo-600" />
          Traffic Reports
        </h1>
        <Button asChild variant="outline">
          <Link to="/dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {reportData.map(report => (
          <Card key={report.id} className="overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{report.title}</CardTitle>
              <p className="text-sm text-gray-500">Generated: {report.date}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-gray-700 mb-4">{report.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <FileText className="h-4 w-4 mr-1" /> {report.type}
                </span>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default ReportsPage;