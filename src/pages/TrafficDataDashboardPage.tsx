"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrafficData, TrafficDataRow } from '@/contexts/TrafficDataContext';
import TrafficDataFilterControls from '@/components/TrafficDataFilterControls';
import TrafficOverviewCharts from '@/components/TrafficOverviewCharts'; // Import the centralized charts component

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
            <TrafficOverviewCharts data={filteredData} />
          )}
        </TrafficDataFilterControls>
      </main>
    </div>
  );
};

export default TrafficDataDashboardPage;