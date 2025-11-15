"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Database, RefreshCcw, TrafficCone, Gauge, AlertCircle, Clock, Map, Car, ParkingSquare, Target, FileText, CheckCircle2, Cloud, AlertTriangle } from 'lucide-react'; // AlertTriangle ditambahkan
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import ProjectPlanningSection from '@/components/ProjectPlanningSection';
import TrafficChangesInsights from '@/components/TrafficChangesInsights';
import { useTrafficData } from '@/contexts/TrafficDataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const DataAnalysisPage = () => {
  const { uploadedData, analysisStatus, analysisProgress, analysisResults, startAnalysis, resetAnalysis } = useTrafficData();

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
                  Data uploaded: {uploadedData.length} rows.
                </p>
              )}
              <p className="text-sm text-gray-600">
                Analysis includes congestion patterns, average speeds, and flow predictions.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
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
                  <p><strong>Total Records:</strong> {analysisResults.totalRecords}</p>
                  {/* <p><strong>Unique Detectors:</strong> {analysisResults.uniqueDetectors}</p> */} {/* Removed */}
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