"use client";

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Database, RefreshCcw, TrafficCone, Gauge, AlertCircle, Clock, Map, Car, ParkingSquare, Target, FileText, CheckCircle2, Cloud, AlertTriangle, CalendarDays, Sun, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import ProjectPlanningSection from '@/components/ProjectPlanningSection';
import TrafficChangesInsights from '@/components/TrafficChangesInsights';
import { useTrafficData } from '@/contexts/TrafficDataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ScatterChart, Scatter } from 'recharts';

const DataAnalysisPage = () => {
  const { uploadedData, analysisStatus, analysisProgress, analysisResults, startAnalysis, resetAnalysis, hasMoreData, loadMoreData } = useTrafficData();

  const getStatusMessage = () => {
    switch (analysisStatus) {
      case 'idle':
        return "Awaiting CSV data upload to start analysis.";
      case 'processing':
        return "Application is processing the uploaded traffic data (simulation).";
      case 'completed':
        return "Traffic data analysis complete! Data is ready to be synchronized.";
      case 'error':
        return "An error occurred during data analysis.";
      default:
        return "Unknown status.";
    }
  };

  // --- Data preparation for new charts ---
  const speedDistributionData = useMemo(() => {
    if (!uploadedData) return [];
    const speeds = uploadedData.map(row => row.speed).filter(s => s !== undefined && s !== null) as number[];
    const bins = Array.from({ length: 9 }, (_, i) => i * 10); // 0-10, 10-20, ..., 80-90
    const counts = new Array(bins.length).fill(0);

    speeds.forEach(speed => {
      for (let i = 0; i < bins.length; i++) {
        if (speed >= bins[i] && (i === bins.length - 1 || speed < bins[i + 1])) {
          counts[i]++;
          break;
        }
      }
    });

    return bins.map((bin, i) => ({
      range: `${bin}-${bin + 9} km/h`,
      count: counts[i],
    })).filter(d => d.count > 0);
  }, [uploadedData]);

  const flowDistributionData = useMemo(() => {
    if (!uploadedData) return [];
    const flows = uploadedData.map(row => row.flow).filter(f => f !== undefined && f !== null) as number[];
    const maxFlow = Math.max(...flows);
    const binSize = Math.ceil(maxFlow / 10); // 10 bins
    const bins = Array.from({ length: 10 }, (_, i) => i * binSize);
    const counts = new Array(bins.length).fill(0);

    flows.forEach(flow => {
      for (let i = 0; i < bins.length; i++) {
        if (flow >= bins[i] && (i === bins.length - 1 || flow < bins[i + 1])) {
          counts[i]++;
          break;
        }
      }
    });

    return bins.map((bin, i) => ({
      range: `${bin}-${bin + binSize - 1}`,
      count: counts[i],
    })).filter(d => d.count > 0);
  }, [uploadedData]);

  const occupancyDistributionData = useMemo(() => {
    if (!uploadedData) return [];
    const occs = uploadedData.map(row => row.occ).filter(o => o !== undefined && o !== null) as number[];
    const bins = Array.from({ length: 11 }, (_, i) => i * 10); // 0-10, 10-20, ..., 100
    const counts = new Array(bins.length).fill(0);

    occs.forEach(occ => {
      for (let i = 0; i < bins.length; i++) {
        if (occ >= bins[i] && (i === bins.length - 1 || occ < bins[i + 1])) {
          counts[i]++;
          break;
        }
      }
    });

    return bins.map((bin, i) => ({
      range: `${bin}-${bin + 9}%`,
      count: counts[i],
    })).filter(d => d.count > 0);
  }, [uploadedData]);

  const averageSpeedByDayOfWeek = useMemo(() => {
    if (!uploadedData) return [];
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dataMap: { [key: string]: { totalSpeed: number; count: number } } = {};

    uploadedData.forEach(row => {
      if (!dataMap[row.day_of_week]) {
        dataMap[row.day_of_week] = { totalSpeed: 0, count: 0 };
      }
      dataMap[row.day_of_week].totalSpeed += row.speed;
      dataMap[row.day_of_week].count++;
    });

    return dayOrder.map(day => ({
      day_of_week: day,
      averageSpeed: dataMap[day] ? parseFloat((dataMap[day].totalSpeed / dataMap[day].count).toFixed(2)) : 0,
    }));
  }, [uploadedData]);

  const averageFlowByTimeOfDay = useMemo(() => {
    if (!uploadedData) return [];
    const timeOfDayOrder = ["dini hari", "pagi", "siang", "sore", "malam"];
    const dataMap: { [key: string]: { totalFlow: number; count: number } } = {};

    uploadedData.forEach(row => {
      if (!dataMap[row.time_of_day]) {
        dataMap[row.time_of_day] = { totalFlow: 0, count: 0 };
      }
      dataMap[row.time_of_day].totalFlow += row.flow;
      dataMap[row.time_of_day].count++;
    });

    return timeOfDayOrder.map(time => ({
      time_of_day: time,
      averageFlow: dataMap[time] ? parseFloat((dataMap[time].totalFlow / dataMap[time].count).toFixed(2)) : 0,
    }));
  }, [uploadedData]);

  const flowSpeedScatterData = useMemo(() => {
    if (!uploadedData) return [];
    return uploadedData.map(row => ({ flow: row.flow, speed: row.speed }));
  }, [uploadedData]);

  // --- End Data preparation for new charts ---

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <BarChart2 className="h-8 w-8 mr-3 text-indigo-600" />
          Data Analysis & Synchronization
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Data Analysis Status</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-gray-700">
                {getStatusMessage()}
              </p>
              {analysisStatus !== 'idle' && (
                <div className="space-y-2">
                  <Label htmlFor="analysis-progress">Progress:</Label>
                  <Progress value={analysisProgress} id="analysis-progress" className="w-full" />
                  <p className="text-sm text-gray-500 text-right">{analysisProgress}% Complete</p>
                </div>
              )}
              {uploadedData && (
                <p className="text-sm text-gray-600 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Data loaded: {uploadedData.length} records. {hasMoreData && <span className="ml-1">(More available)</span>}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Analysis includes congestion patterns, average speeds, and flow predictions.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              {hasMoreData && (
                <Button variant="outline" onClick={loadMoreData} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Load More Data
                </Button>
              )}
              {analysisStatus === 'completed' && (
                <Button variant="outline" onClick={resetAnalysis} className="flex items-center">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset Analysis
                </Button>
              )}
              {analysisStatus === 'idle' && uploadedData && (
                <Button variant="secondary" onClick={startAnalysis} className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Start Re-analysis
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Data Synchronization</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-gray-700">
                Once the analysis is complete, you can synchronize the latest data to the dashboard for visualization.
              </p>
              <p className="text-sm text-gray-600">
                Synchronized data will update traffic maps, predictions, and reports.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="flex items-center" disabled={analysisStatus !== 'completed'}>
                <Database className="h-4 w-4 mr-2" />
                Synchronize Data Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysisStatus === 'completed' && analysisResults && (
          <>
            <Card className="lg:col-span-2 flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" /> Traffic Data Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="space-y-2">
                  <p><strong>Total Records Analyzed:</strong> {analysisResults.totalRecords}</p>
                  <p><strong>Average Speed:</strong> {analysisResults.averageSpeed}</p>
                  <p><strong>Average Flow:</strong> {analysisResults.averageFlow}</p>
                  <p><strong>Average Occupancy:</strong> {analysisResults.averageOccupancy}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg mb-2">Additional Insights (Simulated):</h3>
                  <ul className="list-disc list-inside pl-4">
                    <li>Peak congestion detected at 07:00-09:00 and 17:00-19:00.</li>
                    <li>Via Roma and Piazza Castello show the highest congestion levels.</li>
                    <li>Recommendation: Optimize traffic lights at major intersections.</li>
                  </ul>
                </div>
                <p className="lg:col-span-2 text-sm text-gray-500 mt-4">
                  *These are simulated analysis results. The actual Python backend system will provide more in-depth insights.
                </p>
              </CardContent>
            </Card>

            {/* New Card for Daily Speed Averages Chart */}
            {analysisResults.dailySpeedAverages.length > 0 && (
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-blue-600" /> Daily Average Speed Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysisResults.dailySpeedAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="day" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="averageSpeed" stroke="#8884d8" activeDot={{ r: 8 }} name="Average Speed" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* New Card for Daily Flow Averages Chart */}
            {analysisResults.dailyFlowAverages.length > 0 && (
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-green-600" /> Daily Traffic Flow Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysisResults.dailyFlowAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="day" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis label={{ value: 'Flow', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="averageFlow" stroke="#82ca9d" activeDot={{ r: 8 }} name="Average Flow" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* New Card for Hourly Speed Averages Chart */}
            {analysisResults.hourlySpeedAverages.length > 0 && (
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-purple-600" /> Hourly Average Speed Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysisResults.hourlySpeedAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="hour" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="averageSpeed" stroke="#a855f7" activeDot={{ r: 8 }} name="Average Speed" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* New Card for Hourly Flow Averages Chart */}
            {analysisResults.hourlyFlowAverages.length > 0 && (
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-orange-600" /> Hourly Traffic Flow Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysisResults.hourlyFlowAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="hour" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis label={{ value: 'Flow', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="averageFlow" stroke="#f97316" activeDot={{ r: 8 }} name="Average Flow" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Speed Distribution Histogram */}
            {speedDistributionData.length > 0 && (
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-blue-600" /> Speed Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={speedDistributionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            )}

            {/* Flow Distribution Histogram */}
            {flowDistributionData.length > 0 && (
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-green-600" /> Flow Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={flowDistributionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            )}

            {/* Occupancy Distribution Histogram */}
            {occupancyDistributionData.length > 0 && (
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Droplet className="h-5 w-5 mr-2 text-blue-600" /> Occupancy Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={occupancyDistributionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            )}

            {/* Average Speed by Day of Week */}
            {averageSpeedByDayOfWeek.length > 0 && (
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-orange-600" /> Average Speed by Day of Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={averageSpeedByDayOfWeek} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="day_of_week" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis label={{ value: 'Avg Speed (km/h)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
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
            )}

            {/* Average Flow by Time of Day */}
            {averageFlowByTimeOfDay.length > 0 && (
              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" /> Average Flow by Time of Day
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={averageFlowByTimeOfDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="time_of_day" className="text-sm text-gray-600 dark:text-gray-400" />
                      <YAxis label={{ value: 'Avg Flow', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} className="text-sm text-gray-600 dark:text-gray-400" />
                      <Tooltip
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
            )}

            {/* Flow vs Speed Scatter Plot */}
            {flowSpeedScatterData.length > 0 && (
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
                      <Scatter name="Traffic Data" data={flowSpeedScatterData} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" /> Key Traffic Analysis Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-2">Common Analysis Types:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <TrafficCone className="h-5 w-5 mr-2 text-red-500" />
                  <span>Congestion Analysis: Identifying and measuring traffic bottlenecks.</span>
                </li>
                <li className="flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Average Speed Analysis: Tracking speeds across different road segments.</span>
                </li>
                <li className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>Incident Impact Analysis: Assessing how incidents affect traffic flow.</span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-500" />
                  <span>Travel Time Reliability: Measuring the consistency of travel times.</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-2">Advanced Analysis:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-purple-500" />
                  <span>Origin-Destination Analysis: Understanding traffic sources and destinations.</span>
                </li>
                <li className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-orange-500" />
                  <span>Vehicle Classification: Categorizing vehicles (cars, trucks, motorcycles).</span>
                </li>
                <li className="flex items-center">
                  <ParkingSquare className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Parking Pattern Analysis: Optimizing parking availability and usage.</span>
                </li>
                <li className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
                  <span>Historical Trend Analysis: Analyzing long-term traffic patterns.</span>
                </li>
              </ul>
            </div>
            <p className="lg:col-span-2 text-sm text-gray-500 mt-4">
              *These analyses are performed by a backend Python system and visualized here.
            </p>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <Target className="h-6 w-6 mr-2 text-indigo-600" /> Project Planning Overview
          </h2>
          <ProjectPlanningSection id="project-planning-overview" />
        </div>

        {/* New section for Traffic Changes Insights */}
        <div className="lg:col-span-2 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-600" /> Traffic Changes Insights & Predictions
          </h2>
          <TrafficChangesInsights id="traffic-changes-insights" />
        </div>
      </main>
    </div>
  );
};

export default DataAnalysisPage;