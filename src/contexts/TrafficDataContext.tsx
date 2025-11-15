"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { loadTorinoTrafficData, TorinoTrafficDataRow } from '@/utils/csvLoader'; // Import the new loader

export interface TrafficDataRow {
  day: string;
  interval: string;
  detid: string;
  flow: number;
  occ: number;
  error: number;
  city: string;
  speed: number;
  [key: string]: string | number; // Allow for other potential columns
}

interface AnalysisResults {
  totalRecords: number;
  uniqueDetectors: number;
  averageSpeed: string;
  averageFlow: string;
  averageOccupancy: string;
  dailySpeedAverages: { day: string; averageSpeed: number }[];
  dailyFlowAverages: { day: string; averageFlow: number }[];
  hourlySpeedAverages: { hour: string; averageSpeed: number }[];
  hourlyFlowAverages: { hour: string; averageFlow: number }[];
  // Add more simulated results as needed
}

interface TrafficDataContextType {
  uploadedData: TrafficDataRow[] | null;
  analysisStatus: 'idle' | 'processing' | 'completed' | 'error';
  analysisProgress: number;
  analysisResults: AnalysisResults | null; // Simulated analysis results
  uploadData: (data: TrafficDataRow[]) => void;
  startAnalysis: () => void;
  resetAnalysis: () => void;
}

const TrafficDataContext = createContext<TrafficDataContextType | undefined>(undefined);

export const TrafficDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedData, setUploadedData] = useState<TrafficDataRow[] | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  // Load default data from torino_cleaned_ordered.csv on initial mount
  useEffect(() => {
    const fetchDefaultData = async () => {
      try {
        const data = await loadTorinoTrafficData();
        setUploadedData(data);
        // Automatically start analysis for the default data
        simulateAnalysis(data);
      } catch (err) {
        console.error("Failed to load default traffic data:", err);
        setAnalysisStatus('error');
        toast.error("Failed to load default traffic data.");
      }
    };
    fetchDefaultData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const simulateAnalysis = useCallback((data: TrafficDataRow[]) => {
    setAnalysisStatus('processing');
    setAnalysisProgress(0);
    setAnalysisResults(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setAnalysisProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setAnalysisStatus('completed');
        toast.success("Traffic data analysis complete!");

        // Perform actual analysis based on the new CSV structure
        const totalRecords = data.length;
        const uniqueDetectors = new Set(data.map(row => row.detid)).size;

        const totalSpeed = data.reduce((sum, row) => sum + (Number(row.speed) || 0), 0);
        const totalFlow = data.reduce((sum, row) => sum + (Number(row.flow) || 0), 0);
        const totalOccupancy = data.reduce((sum, row) => sum + (Number(row.occ) || 0), 0);

        const averageSpeed = totalRecords > 0 ? (totalSpeed / totalRecords).toFixed(2) + ' km/h' : 'N/A';
        const averageFlow = totalRecords > 0 ? (totalFlow / totalRecords).toFixed(2) : 'N/A';
        const averageOccupancy = totalRecords > 0 ? (totalOccupancy / totalRecords).toFixed(2) + ' %' : 'N/A';

        // Calculate daily averages
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

        // Calculate hourly averages
        const hourlyData: { [hour: string]: { totalSpeed: number; totalFlow: number; count: number } } = {};
        data.forEach(row => {
          const hour = row.interval.split(':')[0] + ':00'; // Group by hour
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
        })).sort((a, b) => a.hour.localeCompare(b.hour)); // Sort by hour string

        const hourlyFlowAverages = Object.keys(hourlyData).map(hour => ({
          hour,
          averageFlow: hourlyData[hour].count > 0 ? parseFloat((hourlyData[hour].totalFlow / hourlyData[hour].count).toFixed(2)) : 0,
        })).sort((a, b) => a.hour.localeCompare(b.hour)); // Sort by hour string

        setAnalysisResults({
          totalRecords,
          uniqueDetectors,
          averageSpeed,
          averageFlow,
          averageOccupancy,
          dailySpeedAverages,
          dailyFlowAverages,
          hourlySpeedAverages,
          hourlyFlowAverages,
        });
      }
    }, 200); // Simulate progress every 200ms
  }, []);

  const uploadData = useCallback((data: TrafficDataRow[]) => {
    setUploadedData(data);
    simulateAnalysis(data);
  }, [simulateAnalysis]);

  const startAnalysis = useCallback(() => {
    if (uploadedData) {
      simulateAnalysis(uploadedData);
    } else {
      toast.error("No data to analyze. Please upload a CSV file first.");
    }
  }, [uploadedData, simulateAnalysis]);

  const resetAnalysis = useCallback(() => {
    setUploadedData(null);
    setAnalysisStatus('idle');
    setAnalysisProgress(0);
    setAnalysisResults(null);
    toast.info("Analysis status has been reset.");
  }, []);

  return (
    <TrafficDataContext.Provider
      value={{
        uploadedData,
        analysisStatus,
        analysisProgress,
        analysisResults,
        uploadData,
        startAnalysis,
        resetAnalysis,
      }}
    >
      {children}
    </TrafficDataContext.Provider>
  );
};

export const useTrafficData = () => {
  const context = useContext(TrafficDataContext);
  if (context === undefined) {
    throw new Error('useTrafficData must be used within a TrafficDataProvider');
  }
  return context;
};