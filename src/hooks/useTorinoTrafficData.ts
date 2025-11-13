"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface TorinoTrafficSegment {
  roadName: string;
  speed: string;
  flow: string;
}

interface UseTorinoTrafficDataResult {
  data: TorinoTrafficSegment[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => void;
}

const useTorinoTrafficData = (): UseTorinoTrafficDataResult => {
  const [data, setData] = useState<TorinoTrafficSegment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTorinoTrafficData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const urlXML = 'https://opendata.5t.torino.it/get_fdt';

    console.log('Attempting to fetch Torino traffic XML data...');

    try {
      const response = await fetch(urlXML);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const xmlText = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const fdtDataElements = xmlDoc.getElementsByTagName('fdt_data');

      console.log(`✅ ${fdtDataElements.length} Torino Traffic Segments Found.`);
      
      const parsedResults: TorinoTrafficSegment[] = [];

      for (let i = 0; i < Math.min(5, fdtDataElements.length); i++) { // Limit to first 5 for summary
        const item = fdtDataElements[i];
        
        const speedElement = item.getElementsByTagName('speedflow_speed')[0];
        const speed = speedElement ? speedElement.textContent || 'N/A' : 'N/A';
        
        const roadName = item.getAttribute('Road_name') || 'Unknown Road';
        
        const flowElement = item.getElementsByTagName('speedflow_flow')[0];
        const flow = flowElement ? flowElement.textContent || 'N/A' : 'N/A';

        parsedResults.push({
          roadName: roadName,
          speed: speed,
          flow: flow,
        });
      }
      setData(parsedResults);
      toast.success("Real-time Torino traffic data loaded!");

    } catch (err) {
      console.error("❌ Failed to load Torino XML data:", err);
      setError(`Failed to load Torino traffic data: ${err instanceof Error ? err.message : String(err)}`);
      toast.error("Failed to load real-time Torino traffic data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTorinoTrafficData(); // Initial fetch

    const interval = setInterval(fetchTorinoTrafficData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, [fetchTorinoTrafficData]);

  return { data, isLoading, error, fetchData: fetchTorinoTrafficData };
};

export default useTorinoTrafficData;