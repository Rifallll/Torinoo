"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Database, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

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
      </main>
    </div>
  );
};

export default DataAnalysisPage;