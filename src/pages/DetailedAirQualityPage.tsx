"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, AlertCircle, Thermometer, Wind, Droplet, Cloud, Sun, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAirQuality } from '@/hooks/useAirQuality';
import { useSettings } from '@/contexts/SettingsContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer }
  from 'recharts';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale'; // Import enUS locale for English dates

const DetailedAirQualityPage: React.FC = () => {
  const { isAirQualityFeatureEnabled } = useSettings();
  const { data, isLoading, error } = useAirQuality("Torino", isAirQualityFeatureEnabled);

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-100 text-green-700"; // Good
    if (aqi <= 100) return "bg-yellow-100 text-yellow-700"; // Moderate
    if (aqi <= 150) return "bg-orange-100 text-orange-700"; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return "bg-red-100 text-red-700"; // Unhealthy
    if (aqi <= 300) return "bg-purple-100 text-purple-700"; // Very Unhealthy
    return "bg-rose-100 text-rose-700"; // Hazardous
  };

  const getAqiDescription = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getHealthRecommendation = (aqi: number) => {
    if (aqi <= 50) return "Air quality is satisfactory, and air pollution poses little or no risk.";
    if (aqi <= 100) return "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.";
    if (aqi <= 150) return "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
    if (aqi <= 200) return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
    if (aqi <= 300) return "Health warnings of emergency conditions. The entire population is more likely to be affected.";
    return "Health alert: everyone may experience more serious health effects.";
  };

  const getPollutantValue = (iaqi: any, pollutant: string) => {
    return iaqi?.[pollutant]?.v !== undefined ? iaqi[pollutant].v.toFixed(1) : 'N/A';
  };

  if (!isAirQualityFeatureEnabled) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Leaf className="h-8 w-8 mr-3 text-gray-500" />
            Torino Air Quality
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-gray-500" />
                Air Quality Feature Disabled
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>The air quality feature is currently disabled. Enable it in Settings to view data.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 items-center justify-center">
        <Leaf className="h-12 w-12 mr-3 text-indigo-600 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Loading Air Quality...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Leaf className="h-8 w-8 mr-3 text-indigo-600" />
            Torino Air Quality
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-red-500 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-500 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Air Quality Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Failed to load air quality data: {error.message}</p>
              <p className="text-sm text-gray-500">Please ensure your AQICN API key is correct and internet connection is stable.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!data || data.aqi === undefined) { // FIX 3: This check is now robust
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Leaf className="h-8 w-8 mr-3 text-indigo-600" />
            Torino Air Quality
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-indigo-600" />
                Air Quality Data Not Available
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>No air quality data could be loaded at this time.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const aqi = data.aqi;
  const dominantPollutant = data.dominant_pollutant?.toUpperCase() || 'N/A';
  const aqiDescription = getAqiDescription(aqi);
  const healthRecommendation = getHealthRecommendation(aqi); // Define healthRecommendation here

  // Dummy data for historical trend (replace with actual API data if available)
  const historicalData = [
    { date: '2023-11-08', aqi: 65 },
    { date: '2023-11-09', aqi: 72 },
    { date: '2023-11-10', aqi: 80 },
    { date: '2023-11-11', aqi: 95 },
    { date: '2023-11-12', aqi: 110 },
    { date: '2023-11-13', aqi: 105 },
    { date: '2023-11-14', aqi: 98 },
    { date: '2023-11-15', aqi: aqi }, // Current day
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Leaf className="h-8 w-8 mr-3 text-indigo-600" />
          Torino Air Quality
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full space-y-8">
        {/* Current Air Quality Summary */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-green-600" />
              Current Air Quality in {data.city.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-5xl font-bold">{aqi} AQI</span>
              <Badge className={`text-lg px-4 py-2 ${getAqiColor(aqi)}`}>{aqiDescription}</Badge>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Dominant Pollutant: <span className="font-medium">{dominantPollutant}</span></p>
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
              <p className="text-base">{healthRecommendation}</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              *Data provided by AQICN.org. Last updated: {new Date(data.time.iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </p>
          </CardContent>
        </Card>

        {/* Pollutant Details */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Cloud className="h-5 w-5 mr-2 text-gray-600" />
              Main Pollutant Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.iaqi || {}).map(([pollutant, valueObj]) => {
              return (
                <div key={pollutant} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <span className="font-medium text-gray-800 dark:text-gray-100">{pollutant.toUpperCase()}:</span>
                  <Badge variant="secondary" className="text-base">{getPollutantValue(data.iaqi, pollutant)}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Historical AQI Trend (Simulated) */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
              Historical AQI Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="date" tickFormatter={(dateStr) => format(new Date(dateStr), 'dd MMM', { locale: enUS })} className="text-sm text-gray-600 dark:text-gray-400" />
                <YAxis domain={[0, 300]} className="text-sm text-gray-600 dark:text-gray-400" />
                <Tooltip
                  labelFormatter={(label) => format(new Date(label), 'EEEE, dd MMMM yyyy', { locale: enUS })}
                  formatter={(value: number) => [`${value} AQI`, 'AQI']}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="aqi" stroke="#8884d8" activeDot={{ r: 8 }} name="AQI" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4 text-center">
              *This is simulated historical trend data. Actual data may vary.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DetailedAirQualityPage;