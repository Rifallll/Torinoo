"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, BarChart2, Gauge, Cloud, Droplet, CalendarDays, Clock, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrafficData, TrafficDataRow } from '@/contexts/TrafficDataContext';
import TrafficDataFilterControls from '@/components/TrafficDataFilterControls';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ScatterChart, Scatter } from 'recharts';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chartType: string; // e.g., 'dailyFlow', 'hourlySpeed'
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
    } else if (chartType.includes('dayOfWeek')) {
      formattedLabel = label;
    } else if (chartType.includes('timeOfDay')) {
      formattedLabel = label;
    }

    if (chartType.includes('Flow')) {
      valueLabel = 'Flow';
      unit = '';
    } else if (chartType.includes('Speed')) {
      valueLabel = 'Speed';
      unit = ' km/h';
    } else if (chartType.includes('Occupancy')) {
      valueLabel = 'Occupancy';
      unit = ' %';
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

const TrafficDataDashboardPage: React.FC = () => {
  const { uploadedData, analysisStatus } = useTrafficData();

  const isLoading = analysisStatus === 'processing' || analysisStatus === 'idle';
  const error = analysisStatus === 'error' ? new Error("Failed to load raw data.") : null;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 items-center justify-center">
        <LayoutDashboard className="h-12 w-12 mr-3 text-indigo-600 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Loading Traffic Data Dashboard...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <LayoutDashboard className="h-8 w-8 mr-3 text-indigo-600" />
            Traffic Data Dashboard
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-red-500 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-500 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Dashboard Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Failed to load dashboard data: {error.message}</p>
              <p className="text-sm text-gray-500">Please ensure traffic data is uploaded and analyzed.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!uploadedData || uploadedData.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <LayoutDashboard className="h-8 w-8 mr-3 text-indigo-600" />
            Traffic Data Dashboard
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" />
                No Data Available
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>No traffic data has been uploaded or analyzed yet.</p>
              <p>Please upload a CSV file via the "Data Analysis" page to view insights here.</p>
              <Button asChild className="w-full">
                <Link to="/data-analysis">Go to Data Analysis</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <LayoutDashboard className="h-8 w-8 mr-3 text-indigo-600" />
          Traffic Data Dashboard
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full space-y-8">
        <TrafficDataFilterControls data={uploadedData}>
          {(filteredData) => (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Average Speed by Day of Week */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-orange-600" /> Average Speed by Day of Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={
                      Object.entries(
                        filteredData.reduce((acc, row) => {
                          acc[row.day_of_week] = (acc[row.day_of_week] || { totalSpeed: 0, count: 0 });
                          acc[row.day_of_week].totalSpeed += row.speed;
                          acc[row.day_of_week].count++;
                          return acc;
                        }, {} as { [key: string]: { totalSpeed: number; count: number } })
                      ).map(([day, { totalSpeed, count }]) => ({
                        day_of_week: day,
                        averageSpeed: count > 0 ? parseFloat((totalSpeed / count).toFixed(2)) : 0,
                      })).sort((a, b) => {
                        const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                        return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week);
                      })
                    } margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="day_of_week" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis label={{ value: 'Avg Speed (km/h)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        content={<CustomLineChartTooltip chartType="dayOfWeekSpeed" />}
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => [`${value} km/h`, 'Average Speed']}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Bar dataKey="averageSpeed" fill="#E91E63" name="Average Speed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Average Flow by Time of Day */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" /> Average Flow by Time of Day
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={
                      Object.entries(
                        filteredData.reduce((acc, row) => {
                          acc[row.time_of_day] = (acc[row.time_of_day] || { totalFlow: 0, count: 0 });
                          acc[row.time_of_day].totalFlow += row.flow;
                          acc[row.time_of_day].count++;
                          return acc;
                        }, {} as { [key: string]: { totalFlow: number; count: number } })
                      ).map(([time, { totalFlow, count }]) => ({
                        time_of_day: time,
                        averageFlow: count > 0 ? parseFloat((totalFlow / count).toFixed(2)) : 0,
                      })).sort((a, b) => {
                        const order = ["dini hari", "pagi", "siang", "sore", "malam"];
                        return order.indexOf(a.time_of_day) - order.indexOf(b.time_of_day);
                      })
                    } margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="time_of_day" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis label={{ value: 'Avg Flow', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        content={<CustomLineChartTooltip chartType="timeOfDayFlow" />}
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => [`${value}`, 'Average Flow']}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Bar dataKey="averageFlow" fill="#00BCD4" name="Average Flow" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Flow vs Speed Scatter Plot */}
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Car className="h-5 w-5 mr-2 text-red-600" /> Flow vs Speed Scatter Plot
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis type="number" dataKey="flow" name="Flow" unit="" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis type="number" dataKey="speed" name="Speed" unit="km/h" className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Scatter name="Traffic Data" data={filteredData.map(row => ({ flow: row.flow, speed: row.speed }))} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Speed Distribution Histogram */}
              <Card className="lg:col-span-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-blue-600" /> Speed Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={
                      Object.entries(
                        filteredData.reduce((acc, row) => {
                          const speedBin = Math.floor(row.speed / 10) * 10;
                          const range = `${speedBin}-${speedBin + 9} km/h`;
                          acc[range] = (acc[range] || 0) + 1;
                          return acc;
                        }, {} as { [key: string]: number })
                      ).map(([range, count]) => ({ range, count }))
                       .sort((a, b) => parseInt(a.range.split('-')[0]) - parseInt(b.range.split('-')[0]))
                    } margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                </CardContent>
              </Card>

              {/* Flow Distribution Histogram */}
              <Card className="lg:col-span-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-green-600" /> Flow Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={
                      Object.entries(
                        filteredData.reduce((acc, row) => {
                          const flowBin = Math.floor(row.flow / 100) * 100; // Group by 100s
                          const range = `${flowBin}-${flowBin + 99}`;
                          acc[range] = (acc[range] || 0) + 1;
                          return acc;
                        }, {} as { [key: string]: number })
                      ).map(([range, count]) => ({ range, count }))
                       .sort((a, b) => parseInt(a.range.split('-')[0]) - parseInt(b.range.split('-')[0]))
                    } margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                      <Bar dataKey="count" fill="#FFC107" name="Flow Range" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Occupancy Distribution Histogram */}
              <Card className="lg:col-span-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Droplet className="h-5 w-5 mr-2 text-blue-600" /> Occupancy Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={
                      Object.entries(
                        filteredData.reduce((acc, row) => {
                          const occBin = Math.floor(row.occ / 10) * 10;
                          const range = `${occBin}-${occBin + 9}%`;
                          acc[range] = (acc[range] || 0) + 1;
                          return acc;
                        }, {} as { [key: string]: number })
                      ).map(([range, count]) => ({ range, count }))
                       .sort((a, b) => parseInt(a.range.split('-')[0]) - parseInt(b.range.split('-')[0]))
                    } margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="range" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => [`${value} instances`, 'Count']}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Bar dataKey="count" fill="#9C27B0" name="Occupancy Range" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TrafficDataFilterControls>
      </main>
    </div>
  );
};

export default TrafficDataDashboardPage;