"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, BarChart2, Gauge, TrafficCone, Cloud } from 'lucide-react';
import { useTrafficData, TrafficDataRow } from '@/contexts/TrafficDataContext';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

type ChartType = 'dailyFlow' | 'dailySpeed' | 'hourlyFlow' | 'hourlySpeed';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chartType: ChartType;
}

const CustomLineChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, chartType }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
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

const TrafficOverviewCharts: React.FC = React.memo(() => {
  const { uploadedData, analysisResults, analysisStatus } = useTrafficData();
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('dailyFlow');

  const chartData = useMemo(() => {
    if (!analysisResults) return [];
    switch (selectedChartType) {
      case 'dailyFlow': return analysisResults.dailyFlowAverages.map(d => ({ ...d, name: d.day }));
      case 'dailySpeed': return analysisResults.dailySpeedAverages.map(d => ({ ...d, name: d.day }));
      case 'hourlyFlow': return analysisResults.hourlyFlowAverages.map(d => ({ ...d, name: d.hour }));
      case 'hourlySpeed': return analysisResults.hourlySpeedAverages.map(d => ({ ...d, name: d.hour }));
      default: return [];
    }
  }, [analysisResults, selectedChartType]);

  const lineDataKey = useMemo(() => {
    if (selectedChartType.includes('Flow')) return 'averageFlow';
    if (selectedChartType.includes('Speed')) return 'averageSpeed';
    return '';
  }, [selectedChartType]);

  const lineChartLabel = useMemo(() => {
    if (selectedChartType.includes('Flow')) return 'Traffic Flow';
    if (selectedChartType.includes('Speed')) return 'Average Speed (km/h)';
    return '';
  }, [selectedChartType]);

  const congestionData = useMemo(() => {
    if (!uploadedData || uploadedData.length === 0) return [];

    let low = 0;
    let moderate = 0;
    let high = 0;

    uploadedData.forEach((row: TrafficDataRow) => {
      const speed = row.speed;
      if (speed < 20) {
        high++;
      } else if (speed >= 20 && speed < 40) {
        moderate++;
      } else {
        low++;
      }
    });

    const total = low + moderate + high;
    if (total === 0) return [];

    return [
      { name: 'Low Congestion', value: low, percentage: (low / total) * 100, color: '#82ca9d' }, // Green
      { name: 'Moderate Congestion', value: moderate, percentage: (moderate / total) * 100, color: '#ffc658' }, // Yellow
      { name: 'High Congestion', value: high, percentage: (high / total) * 100, color: '#ff7300' }, // Orange
    ];
  }, [uploadedData]);

  const totalCongestionPercentage = useMemo(() => {
    if (congestionData.length === 0) return 0;
    const totalHighModerate = congestionData.filter(d => d.name !== 'Low Congestion').reduce((sum, d) => sum + d.value, 0);
    const totalAll = congestionData.reduce((sum, d) => sum + d.value, 0);
    return totalAll > 0 ? ((totalHighModerate / totalAll) * 100).toFixed(0) : 0;
  }, [congestionData]);

  const PIE_COLORS = ['#82ca9d', '#ffc658', '#ff7300']; // Green, Yellow, Orange

  if (analysisStatus === 'processing' || analysisStatus === 'idle') {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg col-span-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-indigo-600 animate-pulse" />
            Loading Traffic Overview...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Analyzing traffic data to generate insights.</p>
          <div className="h-[300px] flex items-center justify-center">
            <span className="text-gray-500">Please wait...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analysisStatus === 'error' || !analysisResults || !uploadedData) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg col-span-full border-red-500">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-500 flex items-center">
            <TrafficCone className="h-5 w-5 mr-2" />
            Traffic Overview Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Failed to load traffic overview data. Please check the data source or try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Traffic Summary Line Chart */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" /> Traffic Summary
          </CardTitle>
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
        </CardHeader>
        <CardContent className="h-[300px]">
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
        </CardContent>
      </Card>

      {/* Traffic Congestion Breakdown Donut Chart */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <TrafficCone className="h-5 w-5 mr-2 text-orange-600" /> Traffic Congestion Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          {congestionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={congestionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {congestionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number, name: string, props: any) => [`${value} (${props.payload.percentage.toFixed(1)}%)`, name]}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ right: -20, top: '50%', transform: 'translateY(-50%)' }}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  <tspan x="50%" dy="-0.5em">Total</tspan>
                  <tspan x="50%" dy="1.5em">{totalCongestionPercentage}%</tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No congestion data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

export default TrafficOverviewCharts;