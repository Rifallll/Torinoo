"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Gauge } from 'lucide-react';

const speedDistributionData = [
  { speedRange: '0-10 km/h', count: 150, percentage: 15 },
  { speedRange: '11-20 km/h', count: 250, percentage: 25 },
  { speedRange: '21-30 km/h', count: 300, percentage: 30 },
  { speedRange: '31-40 km/h', count: 200, percentage: 20 },
  { speedRange: '41-50 km/h', count: 80, percentage: 8 },
  { speedRange: '50+ km/h', count: 20, percentage: 2 },
];

const TrafficSpeedDistributionChart: React.FC = React.memo(() => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Gauge className="h-5 w-5 mr-2 text-orange-600" /> Traffic Speed Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={speedDistributionData}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="speedRange" className="text-sm text-gray-600 dark:text-gray-400" />
            <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="count" fill="#8884d8" name="Vehicle Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

export default TrafficSpeedDistributionChart;