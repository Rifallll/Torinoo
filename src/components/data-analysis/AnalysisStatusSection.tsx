"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Database, RefreshCcw, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useTrafficData } from '@/contexts/TrafficDataContext';

const AnalysisStatusSection: React.FC = () => {
  const { uploadedData, analysisStatus, analysisProgress, hasMoreData, startAnalysis, resetAnalysis, loadMoreData } = useTrafficData();

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
    <>
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
    </>
  );
};

export default AnalysisStatusSection;