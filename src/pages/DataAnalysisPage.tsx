"use client";

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, AlertTriangle, Target, Gauge, Cloud, Clock, Car, Droplet, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectPlanningSection from '@/components/ProjectPlanningSection';
import TrafficChangesInsights from '@/components/TrafficChangesInsights';
import { useTrafficData } from '@/contexts/TrafficDataContext';

// Import new modular components
import AnalysisStatusSection from '@/components/data-analysis/AnalysisStatusSection';
import AnalysisResultsSummaryCard from '@/components/data-analysis/AnalysisResultsSummaryCard';
import TrafficLineChartCard from '@/components/data-analysis/TrafficLineChartCard';
import TrafficBarChartCard from '@/components/data-analysis/TrafficBarChartCard';
import TrafficScatterChartCard from '@/components/data-analysis/TrafficScatterChartCard';
import KeyTrafficMetricsCard from '@/components/data-analysis/KeyTrafficMetricsCard';

const DataAnalysisPage = () => {
  const { uploadedData, analysisStatus, analysisResults } = useTrafficData();

  // --- Data preparation for charts (kept here as it depends on uploadedData from context) ---
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
  // --- End Data preparation for charts ---

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
        <AnalysisStatusSection />

        {analysisStatus === 'completed' && analysisResults && (
          <>
            <AnalysisResultsSummaryCard analysisResults={analysisResults} />

            {analysisResults.dailySpeedAverages.length > 0 && (
              <TrafficLineChartCard
                title="Daily Average Speed Trend"
                icon={Gauge}
                data={analysisResults.dailySpeedAverages}
                dataKey="averageSpeed"
                name="Average Speed"
                strokeColor="#8884d8"
                xAxisDataKey="day"
                yAxisLabel="Speed (km/h)"
                tooltipValueFormatter={(value: number) => `${value} km/h`}
              />
            )}

            {analysisResults.dailyFlowAverages.length > 0 && (
              <TrafficLineChartCard
                title="Daily Traffic Flow Trend"
                icon={Cloud}
                data={analysisResults.dailyFlowAverages}
                dataKey="averageFlow"
                name="Average Flow"
                strokeColor="#82ca9d"
                xAxisDataKey="day"
                yAxisLabel="Flow"
                tooltipValueFormatter={(value: number) => `${value}`}
              />
            )}

            {analysisResults.hourlySpeedAverages.length > 0 && (
              <TrafficLineChartCard
                title="Hourly Average Speed Trend"
                icon={Gauge}
                data={analysisResults.hourlySpeedAverages}
                dataKey="averageSpeed"
                name="Average Speed"
                strokeColor="#a855f7"
                xAxisDataKey="hour"
                yAxisLabel="Speed (km/h)"
                tooltipValueFormatter={(value: number) => `${value} km/h`}
              />
            )}

            {analysisResults.hourlyFlowAverages.length > 0 && (
              <TrafficLineChartCard
                title="Hourly Traffic Flow Trend"
                icon={Cloud}
                data={analysisResults.hourlyFlowAverages}
                dataKey="averageFlow"
                name="Average Flow"
                strokeColor="#f97316"
                xAxisDataKey="hour"
                yAxisLabel="Flow"
                tooltipValueFormatter={(value: number) => `${value}`}
              />
            )}

            {speedDistributionData.length > 0 && (
              <TrafficBarChartCard
                title="Speed Distribution"
                icon={Gauge}
                data={speedDistributionData}
                dataKey="count"
                name="Speed Range"
                fillColor="#4CAF50"
                xAxisDataKey="range"
                yAxisLabel="Frequency"
                tooltipValueFormatter={(value: number) => `${value} vehicles`}
              />
            )}

            {flowDistributionData.length > 0 && (
              <TrafficBarChartCard
                title="Flow Distribution"
                icon={Cloud}
                data={flowDistributionData}
                dataKey="count"
                name="Flow Range"
                fillColor="#FFC107"
                xAxisDataKey="range"
                yAxisLabel="Frequency"
                tooltipValueFormatter={(value: number) => `${value} vehicles`}
              />
            )}

            {occupancyDistributionData.length > 0 && (
              <TrafficBarChartCard
                title="Occupancy Distribution"
                icon={Droplet}
                data={occupancyDistributionData}
                dataKey="count"
                name="Occupancy Range"
                fillColor="#9C27B0"
                xAxisDataKey="range"
                yAxisLabel="Frequency"
                tooltipValueFormatter={(value: number) => `${value} instances`}
              />
            )}

            {averageSpeedByDayOfWeek.length > 0 && (
              <TrafficBarChartCard
                title="Average Speed by Day of Week"
                icon={CalendarDays}
                data={averageSpeedByDayOfWeek}
                dataKey="averageSpeed"
                name="Average Speed"
                fillColor="#E91E63"
                xAxisDataKey="day_of_week"
                yAxisLabel="Avg Speed (km/h)"
                tooltipValueFormatter={(value: number) => `${value} km/h`}
              />
            )}

            {averageFlowByTimeOfDay.length > 0 && (
              <TrafficBarChartCard
                title="Average Flow by Time of Day"
                icon={Clock}
                data={averageFlowByTimeOfDay}
                dataKey="averageFlow"
                name="Average Flow"
                fillColor="#00BCD4"
                xAxisDataKey="time_of_day"
                yAxisLabel="Avg Flow"
                tooltipValueFormatter={(value: number) => `${value}`}
              />
            )}

            {flowSpeedScatterData.length > 0 && (
              <TrafficScatterChartCard
                title="Flow vs Speed Scatter Plot"
                icon={Car}
                data={flowSpeedScatterData}
                xDataKey="flow"
                yDataKey="speed"
                xName="Flow"
                yName="Speed"
                yUnit="km/h"
                fillColor="#8884d8"
              />
            )}
          </>
        )}

        <KeyTrafficMetricsCard />

        <div className="lg:col-span-2 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <Target className="h-6 w-6 mr-2 text-indigo-600" /> Project Planning Overview
          </h2>
          <ProjectPlanningSection id="project-planning-overview" />
        </div>

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