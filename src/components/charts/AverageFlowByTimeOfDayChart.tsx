"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chartType: string;
}

const CustomBarChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, chartType }) => {
  if (active && payload && payload.length) {
    let valueLabel = '';
    let unit = '';

    if (chartType.includes('Speed')) {
      valueLabel = 'Average Speed';
      unit = ' km/h';
    } else if (chartType.includes('Flow')) {
      valueLabel = 'Average Flow';
      unit = '';
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg text-sm text-gray-800 dark:text-gray-100">
        <p className="font-semibold mb-1">{label}</p>
        <p>{`${valueLabel}: ${payload[0].value}${unit}`}</p>
      </div>
    );
  }
  return null;
};

interface AverageFlowByTimeOfDayChartProps {
  data: any[];
}

const AverageFlowByTimeOfDayChart: React.FC<AverageFlowByTimeOfDayChartProps> = React.memo(({ data }) => {
  return (
    <>
      <h2 className="text-xl font-semibold flex items-center">
        <Clock className="h-5 w-5 mr-2 text-purple-600" /> Average Flow by Time of Day
      </h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="time_of_day" className="text-sm text-gray-600 dark:text-gray-400" />
            <YAxis label={{ value: 'Avg Flow', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
            <Tooltip
              content={<CustomBarChartTooltip chartType="timeOfDayFlow" />}
              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value}`, 'Average Flow']}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="averageFlow" fill="#00BCD4" name="Average Flow" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
});

export default AverageFlowByTimeOfDayChart;