"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

interface TrafficDataRow {
  [key: string]: string | number;
}

interface TrafficDataContextType {
  uploadedData: TrafficDataRow[] | null;
  analysisStatus: 'idle' | 'processing' | 'completed' | 'error';
  analysisProgress: number;
  analysisResults: any | null; // Simulated analysis results
  uploadData: (data: TrafficDataRow[]) => void;
  startAnalysis: () => void;
  resetAnalysis: () => void;
}

const TrafficDataContext = createContext<TrafficDataContextType | undefined>(undefined);

export const TrafficDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedData, setUploadedData] = useState<TrafficDataRow[] | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);

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
        toast.success("Analisis data lalu lintas selesai!");

        // Simulate some analysis results
        const totalRows = data.length;
        const uniqueLocations = new Set(data.map(row => row.location)).size;
        const avgSpeed = data.reduce((sum, row) => sum + (Number(row.speed) || 0), 0) / totalRows;
        const highCongestionCount = data.filter(row => row.traffic_level === 'high').length;

        setAnalysisResults({
          totalRecords: totalRows,
          uniqueLocations: uniqueLocations,
          averageSpeed: avgSpeed ? avgSpeed.toFixed(2) + ' km/h' : 'N/A',
          highCongestionSegments: highCongestionCount,
          // Add more simulated results as needed
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
      toast.error("Tidak ada data untuk dianalisis. Harap unggah file CSV terlebih dahulu.");
    }
  }, [uploadedData, simulateAnalysis]);

  const resetAnalysis = useCallback(() => {
    setUploadedData(null);
    setAnalysisStatus('idle');
    setAnalysisProgress(0);
    setAnalysisResults(null);
    toast.info("Status analisis telah direset.");
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