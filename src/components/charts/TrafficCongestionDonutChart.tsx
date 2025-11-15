"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrafficCone } from 'lucide-react';

interface TrafficCongestionDonutChartProps {
  congestionData: any[];
  totalCongestionPercentage: string | number;
}

const PIE_COLORS = ['#82ca9d', '#ffc658', '#ff7300']; // Green, Yellow, Orange

const TrafficCongestionDonutChart: React.FC<TrafficCongestionDonutChartProps> = React.memo(({
  congestionData,
  totalCongestionPercentage,
}) => {
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
        <TrafficCone className="h-5 w-5 mr-2 text-orange-600" /> Traffic Congestion Breakdown
      </h2>
      <div className="h-[300px] flex items-center justify-center">
        {congestionData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={congestionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {congestionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string, props: any) => [`${value} (${props.payload.percentage.toFixed(1)}%)`, name]}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ right: -20, top: '50%', transform: 'translateY(-50%)' }}
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold text-gray-800 dark:text-gray-100">
                <tspan x="50%" dy="-0.5em">Total</tspan>
                <tspan x="50%" dy="1.5em">{totalCongestionPercentage}%</tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No congestion data available.</p>
        )}
      </div>
    </>
  );
});

export default TrafficCongestionDonutChart;