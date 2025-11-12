"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Database, RefreshCcw, TrafficCone, Gauge, AlertCircle, Clock, Map, Car, ParkingSquare, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import ProjectPlanningSection from '@/components/ProjectPlanningSection'; // Import the new component

const DataAnalysisPage = () => {
  const [analysisProgress, setAnalysisProgress] = React.useState(70); // Dummy progress

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
                The Python system is currently processing the uploaded traffic data. You can see the progress here.
              </p>
              <div className="space-y-2">
                <Label htmlFor="analysis-progress">Progress:</Label>
                <Progress value={analysisProgress} id="analysis-progress" className="w-full" />
                <p className="text-sm text-gray-500 text-right">{analysisProgress}% Complete</p>
              </div>
              <p className="text-sm text-gray-600">
                Analysis includes congestion patterns, average speeds, and flow predictions.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" className="flex items-center">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
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
              <Button className="flex items-center" disabled={analysisProgress < 100}>
                <Database className="h-4 w-4 mr-2" />
                Sync Data Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* New Card for Key Traffic Analysis Metrics */}
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
                  <span>Congestion Analysis: Identify and quantify traffic bottlenecks.</span>
                </li>
                <li className="flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Average Speed Analysis: Track speeds across different road segments.</span>
                </li>
                <li className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>Incident Impact Analysis: Assess how incidents affect traffic flow.</span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-500" />
                  <span>Travel Time Reliability: Measure consistency of travel times.</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-2">Advanced Analysis:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-purple-500" />
                  <span>Origin-Destination Analysis: Understand traffic sources and destinations.</span>
                </li>
                <li className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-orange-500" />
                  <span>Vehicle Classification: Categorize vehicles (cars, trucks, motorcycles).</span>
                </li>
                <li className="flex items-center">
                  <ParkingSquare className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Parking Pattern Analysis: Optimize parking availability and usage.</span>
                </li>
                <li className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
                  <span>Historical Trend Analysis: Analyze long-term traffic patterns.</span>
                </li>
              </ul>
            </div>
            <p className="lg:col-span-2 text-sm text-gray-500 mt-4">
              *These analyses are performed by the backend Python system and visualized here.
            </p>
          </CardContent>
        </Card>

        {/* New section for Project Planning */}
        <div className="lg:col-span-2 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <Target className="h-6 w-6 mr-2 text-indigo-600" /> Project Planning Overview
          </h2>
          <ProjectPlanningSection id="project-planning-overview" />
        </div>
      </main>
    </div>
  );
};

export default DataAnalysisPage;