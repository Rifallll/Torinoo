"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LucideIcon } from 'lucide-react';

interface TrafficBarChartCardProps {
  title: string;
  icon: LucideIcon;
  data: any[];
  dataKey: string;
  name: string;
  fillColor: string;
  xAxisDataKey: string;
  yAxisLabel: string;
  tooltipValueFormatter?: (value: number) => string;
  domain?: [number, number];
}

const TrafficBarChartCard: React.FC<TrafficBarChartCardProps> = ({
  title,
  icon: Icon,
  data,
  dataKey,
  name,
  fillColor,
  xAxisDataKey,
  yAxisLabel,
  tooltipValueFormatter,
  domain,
}) => {
  return (
    <Card className="lg:col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Icon className="h-5 w-5 mr-2 text-blue-600" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey={xAxisDataKey} className="text-sm text-gray-600 dark:text-gray-400" />
            <YAxis
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              className="text-sm text-gray-600 dark:text-gray-400"
              domain={domain}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={tooltipValueFormatter ? (value: any) => tooltipValueFormatter(value) : undefined}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey={dataKey} fill={fillColor} name={name} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrafficBarChartCard;