"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrafficDataRow } from '@/contexts/TrafficDataContext';

// Import modular chart components
import TrafficSummaryLineChart from '@/components/charts/TrafficSummaryLineChart';
import TrafficCongestionDonutChart from '@/components/charts/TrafficCongestionDonutChart';
import AverageSpeedByDayOfWeekChart from '@/components/charts/AverageSpeedByDayOfWeekChart';
import AverageFlowByTimeOfDayChart from '@/components/charts/AverageFlowByTimeOfDayChart';
import FlowSpeedScatterPlot from '@/components/charts/FlowSpeedScatterPlot';
import SpeedDistributionHistogram from '@/components/charts/SpeedDistributionHistogram';
import FlowDistributionHistogram from '@/components/charts/FlowDistributionHistogram';
import OccupancyDistributionHistogram from '@/components/charts/OccupancyDistributionHistogram';

type ChartType = 'dailyFlow' | 'dailySpeed' | 'hourlyFlow' | 'hourlySpeed';

interface TrafficOverviewChartsProps {
  data: TrafficDataRow[];
}

const TrafficOverviewCharts: React.FC<TrafficOverviewChartsProps> = React.memo(({ data }) => {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('dailyFlow');

  const analysisResults = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalRecords = data.length;
    const totalSpeed = data.reduce((sum, row) => sum + (Number(row.speed) || 0), 0);
    const totalFlow = data.reduce((sum, row) => sum + (Number(row.flow) || 0), 0);
    const totalOccupancy = data.reduce((sum, row) => sum + (Number(row.occ) || 0), 0);

    const averageSpeed = totalRecords > 0 ? (totalSpeed / totalRecords).toFixed(2) + ' km/h' : 'N/A';
    const averageFlow = totalRecords > 0 ? (totalFlow / totalRecords).toFixed(2) : 'N/A';
    const averageOccupancy = totalRecords > 0 ? (totalOccupancy / totalRecords).toFixed(2) + ' %' : 'N/A';

    const dailyData: { [day: string]: { totalSpeed: number; totalFlow: number; count: number } } = {};
    data.forEach(row => {
      if (!dailyData[row.day]) {
        dailyData[row.day] = { totalSpeed: 0, totalFlow: 0, count: 0 };
      }
      dailyData[row.day].totalSpeed += Number(row.speed) || 0;
      dailyData[row.day].totalFlow += Number(row.flow) || 0;
      dailyData[row.day].count++;
    });

    const dailySpeedAverages = Object.keys(dailyData).map(day => ({
      day,
      averageSpeed: dailyData[day].count > 0 ? parseFloat((dailyData[day].totalSpeed / dailyData[day].count).toFixed(2)) : 0,
    })).sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

    const dailyFlowAverages = Object.keys(dailyData).map(day => ({
      day,
      averageFlow: dailyData[day].count > 0 ? parseFloat((dailyData[day].totalFlow / dailyData[day].count).toFixed(2)) : 0,
    })).sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

    const hourlyData: { [hour: string]: { totalSpeed: number; totalFlow: number; count: number } } = {};
    data.forEach(row => {
      const hour = row.time.split(':')[0] + ':00';
      if (!hourlyData[hour]) {
        hourlyData[hour] = { totalSpeed: 0, totalFlow: 0, count: 0 };
      }
      hourlyData[hour].totalSpeed += Number(row.speed) || 0;
      hourlyData[hour].totalFlow += Number(row.flow) || 0;
      hourlyData[hour].count++;
    });

    const hourlySpeedAverages = Object.keys(hourlyData).map(hour => ({
      hour,
      averageSpeed: hourlyData[hour].count > 0 ? parseFloat((hourlyData[hour].totalSpeed / hourlyData[hour].count).toFixed(2)) : 0,
    })).sort((a, b) => a.hour.localeCompare(b.hour));

    const hourlyFlowAverages = Object.keys(hourlyData).map(hour => ({
      hour,
      averageFlow: hourlyData[hour].count > 0 ? parseFloat((hourlyData[hour].totalFlow / hourlyData[hour].count).toFixed(2)) : 0,
    })).sort((a, b) => a.hour.localeCompare(b.hour));

    return {
      totalRecords,
      averageSpeed,
      averageFlow,
      averageOccupancy,
      dailySpeedAverages,
      dailyFlowAverages,
      hourlySpeedAverages,
      hourlyFlowAverages,
    };
  }, [data]);

  const chartData = useMemo(() => {
    if (!analysisResults) return [];
    switch (selectedChartType) {
      case 'dailyFlow': return analysisResults.dailyFlowAverages.map(d => ({ ...d, name: d.day }));
      case 'dailySpeed': return analysisResults.dailySpeedAverages.map(d => ({ ...d, name: d.day }));
      case 'hourlyFlow': return analysisResults.hourlyFlowAverages.map(d => ({ ...d, name: d.hour }));
      case 'hourlySpeed': return analysisResults.hourlySpeedAverages.map(d => ({ ...d, name: d.hour }));
      default: return [];
    }
  }, [analysisResults, selectedChartType]);

  const lineDataKey = useMemo(() => {
    if (selectedChartType.includes('Flow')) return 'averageFlow';
    if (selectedChartType.includes('Speed')) return 'averageSpeed';
    return '';
  }, [selectedChartType]);

  const lineChartLabel = useMemo(() => {
    if (selectedChartType.includes('Flow')) return 'Traffic Flow';
    if (selectedChartType.includes('Speed')) return 'Average Speed (km/h)';
    return '';
  }, [selectedChartType]);

  const congestionData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let low = 0;
    let moderate = 0;
    let high = 0;

    data.forEach((row: TrafficDataRow) => {
      const speed = row.speed;
      if (speed < 20) {
        high++;
      } else if (speed >= 20 && speed < 40) {
        moderate++;
      } else {
        low++;
      }
    });

    const total = low + moderate + high;
    if (total === 0) return [];

    return [
      { name: 'Low Congestion', value: low, percentage: (low / total) * 100, color: '#82ca9d' }, // Green
      { name: 'Moderate Congestion', value: moderate, percentage: (moderate / total) * 100, color: '#ffc658' }, // Yellow
      { name: 'High Congestion', value: high, percentage: (high / total) * 100, color: '#ff7300' }, // Orange
    ];
  }, [data]);

  const totalCongestionPercentage = useMemo(() => {
    if (congestionData.length === 0) return 0;
    const totalHighModerate = congestionData.filter(d => d.name !== 'Low Congestion').reduce((sum, d) => sum + d.value, 0);
    const totalAll = congestionData.reduce((sum, d) => sum + d.value, 0);
    return totalAll > 0 ? ((totalHighModerate / totalAll) * 100).toFixed(0) : 0;
  }, [congestionData]);

  // --- Data preparation for new charts ---
  const speedDistributionData = useMemo(() => {
    if (!data) return [];
    const speeds = data.map(row => row.speed).filter(s => s !== undefined && s !== null) as number[];
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
  }, [data]);

  const flowDistributionData = useMemo(() => {
    if (!data) return [];
    const flows = data.map(row => row.flow).filter(f => f !== undefined && f !== null) as number[];
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
  }, [data]);

  const occupancyDistributionData = useMemo(() => {
    if (!data) return [];
    const occs = data.map(row => row.occ).filter(o => o !== undefined && o !== null) as number[];
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
  }, [data]);

  const averageSpeedByDayOfWeek = useMemo(() => {
    if (!data) return [];
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dataMap: { [key: string]: { totalSpeed: number; count: number } } = {};

    data.forEach(row => {
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
  }, [data]);

  const averageFlowByTimeOfDay = useMemo(() => {
    if (!data) return [];
    const timeOfDayOrder = ["dini hari", "pagi", "siang", "sore", "malam"];
    const dataMap: { [key: string]: { totalFlow: number; count: number } } = {};

    data.forEach(row => {
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
  }, [data]);

  const flowSpeedScatterData = useMemo(() => {
    if (!data) return [];
    return data.map(row => ({ flow: row.flow, speed: row.speed }));
  }, [data]);
  // --- End Data preparation for new charts ---

  if (!analysisResults || !data || data.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg col-span-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            Loading Traffic Overview...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Analyzing traffic data to generate insights.</p>
          <div className="h-[300px] flex items-center justify-center">
            <span className="text-gray-500">Please wait...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Traffic Summary Line Chart */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <TrafficSummaryLineChart
            chartData={chartData}
            selectedChartType={selectedChartType}
            setSelectedChartType={setSelectedChartType}
            lineDataKey={lineDataKey}
            lineChartLabel={lineChartLabel}
          />
        </CardHeader>
        <CardContent></CardContent> {/* Content is rendered inside the chart component */}
      </Card>

      {/* Traffic Congestion Breakdown Donut Chart */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <TrafficCongestionDonutChart
            congestionData={congestionData}
            totalCongestionPercentage={totalCongestionPercentage}
          />
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      {/* Average Speed by Day of Week */}
      <Card className="flex flex-col">
        <CardHeader>
          <AverageSpeedByDayOfWeekChart data={averageSpeedByDayOfWeek} />
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      {/* Average Flow by Time of Day */}
      <Card className="flex flex-col">
        <CardHeader>
          <AverageFlowByTimeOfDayChart data={averageFlowByTimeOfDay} />
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      {/* Flow vs Speed Scatter Plot */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <FlowSpeedScatterPlot data={flowSpeedScatterData} />
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      {/* Speed Distribution Histogram */}
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <SpeedDistributionHistogram data={speedDistributionData} />
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      {/* Flow Distribution Histogram */}
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <FlowDistributionHistogram data={flowDistributionData} />
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      {/* Occupancy Distribution Histogram */}
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <OccupancyDistributionHistogram data={occupancyDistributionData} />
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
});

export default TrafficOverviewCharts;