"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { AnalysisResults } from '@/contexts/TrafficDataContext'; // Import AnalysisResults interface

interface AnalysisResultsSummaryCardProps {
  analysisResults: AnalysisResults;
}

const AnalysisResultsSummaryCard: React.FC<AnalysisResultsSummaryCardProps> = ({ analysisResults }) => {
  return (
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
  );
};

export default AnalysisResultsSummaryCard;