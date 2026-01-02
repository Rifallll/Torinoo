"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Clock, MapPin } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const TrafficChangesInsights = ({ id }: { id?: string }) => {
  const [analysisData, setAnalysisData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/supabase-analysis');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setAnalysisData(data);
        setError(false);
      } catch (err) {
        console.error("Failed to load traffic analysis:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Poll every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div id={id} className="grid grid-cols-1 gap-6">
        <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg h-96 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading analysis data...</div>
        </Card>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div id={id} className="grid grid-cols-1 gap-6">
        <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" /> Traffic Data Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300 text-center py-12">
            <div className="flex flex-col items-center justify-center opacity-75">
              <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500">Real-time Analysis Data Not Available</p>
              <p className="text-sm text-gray-400 mt-2 max-w-md">
                Ensure the analysis server is running and Supabase is accessible.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare data for charts
  const typeData = Object.entries(analysisData.by_type || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number
  }));

  const entityData = Object.entries(analysisData.by_entity || {}).map(([name, value]) => ({
    name,
    count: value as number
  })).slice(0, 5); // Top 5

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div id={id} className="grid grid-cols-1 gap-6">
      <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" /> Traffic Data Analysis from Supabase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Traffic Changes</p>
              <p className="text-3xl font-bold text-blue-600">{analysisData.summary?.total_traffic_changes || 0}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Incidents</p>
              <p className="text-3xl font-bold text-red-600">{analysisData.summary?.total_incidents || 0}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Last 24h</p>
              <p className="text-3xl font-bold text-green-600">{analysisData.timeline?.last_24h || 0}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Last 7 Days</p>
              <p className="text-3xl font-bold text-purple-600">{analysisData.timeline?.last_7d || 0}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traffic Changes by Type */}
            {typeData.length > 0 && (
              <div className="h-[300px] w-full">
                <h3 className="text-lg font-semibold mb-4 text-center">Traffic Changes by Type</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Entities */}
            {entityData.length > 0 && (
              <div className="h-[300px] w-full">
                <h3 className="text-lg font-semibold mb-4 text-center">Top Responsible Entities</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={entityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#888" fontSize={11} angle={-15} textAnchor="end" height={80} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                      itemStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Recent Items */}
          {analysisData.recent_items && analysisData.recent_items.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2" /> Recent Traffic Updates
              </h3>
              <div className="space-y-2">
                {analysisData.recent_items.slice(0, 5).map((item: any, idx: number) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-0.5 rounded">{item.type}</span>
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">{item.entity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficChangesInsights;