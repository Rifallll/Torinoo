"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const sensorSummaryData = {
  totalSensors: 25,
  active: 18,
  warning: 4,
  offline: 3,
};

const SensorStatusOverviewCard: React.FC = () => {
  const activePercentage = (sensorSummaryData.active / sensorSummaryData.totalSensors) * 100;
  const warningPercentage = (sensorSummaryData.warning / sensorSummaryData.totalSensors) * 100;
  const offlinePercentage = (sensorSummaryData.offline / sensorSummaryData.totalSensors) * 100;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Wifi className="h-5 w-5 mr-2 text-purple-600" /> Sensor Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Sensors:</span>
          <span className="text-lg font-bold">{sensorSummaryData.totalSensors}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Active
            </div>
            <span>{sensorSummaryData.active} ({activePercentage.toFixed(0)}%)</span>
          </div>
          <Progress value={activePercentage} className="h-2 [&>*]:bg-green-500" />

          <div className="flex items-center justify-between text-sm mt-3">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" /> Warning
            </div>
            <span>{sensorSummaryData.warning} ({warningPercentage.toFixed(0)}%)</span>
          </div>
          <Progress value={warningPercentage} className="h-2 [&>*]:bg-yellow-500" />

          <div className="flex items-center justify-between text-sm mt-3">
            <div className="flex items-center">
              <XCircle className="h-4 w-4 mr-2 text-red-500" /> Offline
            </div>
            <span>{sensorSummaryData.offline} ({offlinePercentage.toFixed(0)}%)</span>
          </div>
          <Progress value={offlinePercentage} className="h-2 [&>*]:bg-red-500" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorStatusOverviewCard;