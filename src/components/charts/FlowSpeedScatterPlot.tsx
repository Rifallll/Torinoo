"use client";

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Car } from 'lucide-react';

interface FlowSpeedScatterPlotProps {
  data: any[];
}

const FlowSpeedScatterPlot: React.FC<FlowSpeedScatterPlotProps> = React.memo(({ data }) => {
  return (
    <>
      <h2 className="text-xl font-semibold flex items-center">
        <Car className="h-5 w-5 mr-2 text-red-600" /> Flow vs Speed Scatter Plot
      </h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis type="number" dataKey="flow" name="Flow" unit="" className="text-sm text-gray-600 dark:text-gray-400" />
            <YAxis type="number" dataKey="speed" name="Speed" unit="km/h" className="text-sm text-gray-600 dark:text-gray-400" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Scatter name="Traffic Data" data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </>
  );
});

export default FlowSpeedScatterPlot;