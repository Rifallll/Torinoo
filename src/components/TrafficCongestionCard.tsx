"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TrafficCongestionCard: React.FC = () => {
  // Dummy data for congestion level
  const congestionLevel = 45; // Percentage
  const congestionStatus = congestionLevel < 30 ? "Low" : congestionLevel < 60 ? "Moderate" : "High";
  // Explicitly define the type for 'trend' to allow all possible string literal values
  const trend: "increasing" | "decreasing" | "stable" = "increasing"; // dummy: can be 'increasing', 'decreasing', 'stable'

  const getStatusColor = (level: number) => {
    if (level < 30) return "text-green-600";
    if (level < 60) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressColorClass = (level: number) => {
    if (level < 30) return "[&>*]:bg-green-500";
    if (level < 60) return "[&>*]:bg-orange-500";
    return "[&>*]:bg-red-500";
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Gauge className={`h-5 w-5 mr-2 ${getStatusColor(congestionLevel)}`} /> Traffic Congestion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Level:</span>
          <span className={`text-3xl font-bold ${getStatusColor(congestionLevel)}`}>{congestionLevel}%</span>
        </div>
        <div className="space-y-2">
          <Progress value={congestionLevel} className={`h-3 ${getProgressColorClass(congestionLevel)}`} />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Status:</span>
          <span className={`font-semibold ${getStatusColor(congestionLevel)}`}>{congestionStatus}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Trend:</span>
          <div className="flex items-center">
            {trend === "increasing" && <TrendingUp className="h-4 w-4 mr-1 text-red-500" />}
            {trend === "decreasing" && <TrendingDown className="h-4 w-4 mr-1 text-green-500" />}
            {trend === "stable" && <span className="mr-1 text-gray-500">-</span>}
            <span className={trend === "increasing" ? "text-red-500" : trend === "decreasing" ? "text-green-500" : "text-gray-500"}>
              {trend.charAt(0).toUpperCase() + trend.slice(1)}
            </span>
          </div>
        </div> {/* Fixed: Added closing tag for div */}
      </CardContent>
    </Card>
  );
};

export default TrafficCongestionCard;