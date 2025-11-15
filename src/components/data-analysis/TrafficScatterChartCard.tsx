"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LucideIcon } from 'lucide-react';

interface TrafficScatterChartCardProps {
  title: string;
  icon: LucideIcon;
  data: any[];
  xDataKey: string;
  yDataKey: string;
  xName: string;
  yName: string;
  xUnit?: string;
  yUnit?: string;
  fillColor: string;
}

const TrafficScatterChartCard: React.FC<TrafficScatterChartCardProps> = ({
  title,
  icon: Icon,
  data,
  xDataKey,
  yDataKey,
  xName,
  yName,
  xUnit = '',
  yUnit = '',
  fillColor,
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
          <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis type="number" dataKey={xDataKey} name={xName} unit={xUnit} className="text-sm text-gray-600 dark:text-gray-400" />
            <YAxis type="number" dataKey={yDataKey} name={yName} unit={yUnit} className="text-sm text-gray-600 dark:text-gray-400" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Scatter name="Traffic Data" data={data} fill={fillColor} />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrafficScatterChartCard;