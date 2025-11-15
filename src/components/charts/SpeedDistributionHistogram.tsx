"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Gauge } from 'lucide-react';

interface SpeedDistributionHistogramProps {
  data: any[];
}

const SpeedDistributionHistogram: React.FC<SpeedDistributionHistogramProps> = React.memo(({ data }) => {
  return (
    <>
      <h2 className="text-xl font-semibold flex items-center">
        <Gauge className="h-5 w-5 mr-2 text-blue-600" /> Speed Distribution
      </h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="range" className="text-sm text-gray-600 dark:text-gray-400" />
            <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value} vehicles`, 'Count']}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="count" fill="#4CAF50" name="Speed Range" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
});

export default SpeedDistributionHistogram;