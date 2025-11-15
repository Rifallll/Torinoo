"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

type ChartType = 'dailyFlow' | 'dailySpeed' | 'hourlyFlow' | 'hourlySpeed';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chartType: string;
}

const CustomLineChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, chartType }) => {
  if (active && payload && payload.length) {
    let formattedLabel = label;
    let valueLabel = '';
    let unit = '';

    if (chartType.includes('daily')) {
      formattedLabel = format(new Date(label || ''), 'MMM dd, yyyy', { locale: enUS });
    } else if (chartType.includes('hourly')) {
      formattedLabel = `${label}`;
    }

    if (chartType.includes('Flow')) {
      valueLabel = 'Flow';
      unit = '';
    } else if (chartType.includes('Speed')) {
      valueLabel = 'Speed';
      unit = ' km/h';
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg text-sm text-gray-800 dark:text-gray-100">
        <p className="font-semibold mb-1">{formattedLabel}</p>
        <p>{`${valueLabel}: ${payload[0].value}${unit}`}</p>
      </div>
    );
  }
  return null;
};

interface TrafficSummaryLineChartProps {
  chartData: any[];
  selectedChartType: ChartType;
  setSelectedChartType: (type: ChartType) => void;
  lineDataKey: string;
  lineChartLabel: string;
}

const TrafficSummaryLineChart: React.FC<TrafficSummaryLineChartProps> = React.memo(({
  chartData,
  selectedChartType,
  setSelectedChartType,
  lineDataKey,
  lineChartLabel,
}) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" /> Traffic Summary
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              {selectedChartType === 'dailyFlow' && 'Daily Flow'}
              {selectedChartType === 'dailySpeed' && 'Daily Speed'}
              {selectedChartType === 'hourlyFlow' && 'Hourly Flow'}
              {selectedChartType === 'hourlySpeed' && 'Hourly Speed'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50">
            <DropdownMenuItem onClick={() => setSelectedChartType('dailyFlow')}>Daily Flow</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedChartType('dailySpeed')}>Daily Speed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedChartType('hourlyFlow')}>Hourly Flow</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedChartType('hourlySpeed')}>Hourly Speed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="name" className="text-sm text-gray-600 dark:text-gray-400" />
            <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
            <Tooltip content={<CustomLineChartTooltip chartType={selectedChartType} />} />
            <Line type="monotone" dataKey={lineDataKey} stroke="#8884d8" activeDot={{ r: 8 }} name={lineChartLabel} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
});

export default TrafficSummaryLineChart;