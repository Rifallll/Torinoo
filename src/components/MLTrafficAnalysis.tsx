import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    BarChart2,
    TrendingUp,
    Clock,
    AlertCircle,
    Brain,
    Activity,
    Zap,
    Target,
    ArrowLeft,
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts';

interface StatisticsData {
    row_count: number;
    date_range: { start: string; end: string };
    detector_count: number;
    flow_stats: { mean: number; min: number; max: number };
    speed_stats: { mean: number; min: number; max: number };
}

interface ModelMetrics {
    r2_score: number;
    mae: number;
    rmse: number;
    train_size: number;
    test_size: number;
}

interface AnalysisData {
    weekday_vs_weekend: {
        weekday: { avg_flow: number; avg_speed: number; avg_occ: number; avg_traffic_index: number };
        weekend: { avg_flow: number; avg_speed: number; avg_occ: number; avg_traffic_index: number };
    };
    hourly_congestion: Record<number, number>;
    daily_congestion: Record<string, number>;
    peak_hours: Array<{ hour: number; index: number }>;
    weekday_hourly_flow: Record<number, number>;
    weekend_hourly_flow: Record<number, number>;
}

interface FeatureImportance {
    [key: string]: number;
}

interface TrafficData {
    hourly_flow: Record<number, number>;
    traffic_distribution: Record<string, number>;
}

const MLTrafficDashboard = () => {
    const [statistics, setStatistics] = useState<StatisticsData | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
    const [features, setFeatures] = useState<FeatureImportance | null>(null);
    const [correlations, setCorrelations] = useState<Record<string, number> | null>(null);
    const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false);
    const [filterMessage, setFilterMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [training, setTraining] = useState(false);
    const [predicting, setPredicting] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);

    // Prediction form state
    const [predHour, setPredHour] = useState('12');
    const [predWeekday, setPredWeekday] = useState('0');
    const [predDetid, setPredDetid] = useState('230');

    // Filter state - default to 2016 data range
    const [filterStartDate, setFilterStartDate] = useState('2016-09-26');
    const [filterEndDate, setFilterEndDate] = useState('2016-10-16');
    const [filterDetectorId, setFilterDetectorId] = useState('');
    const [filterHourStart, setFilterHourStart] = useState('0');
    const [filterHourEnd, setFilterHourEnd] = useState('23');

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 300000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [statsRes, analysisRes, dataRes] = await Promise.all([
                fetch(`${import.meta.env.BASE_URL}api/statistics`),
                fetch(`${import.meta.env.BASE_URL}api/analysis`),
                fetch(`${import.meta.env.BASE_URL}api/data`),
            ]);

            if (!statsRes.ok || !analysisRes.ok || !dataRes.ok) {
                throw new Error('Backend not available');
            }

            const [statsData, analysisData, trafficDataRes] = await Promise.all([
                statsRes.json(),
                analysisRes.json(),
                dataRes.json(),
            ]);

            setStatistics(statsData);
            setAnalysis(analysisData);
            setTrafficData(trafficDataRes);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = async () => {
        try {
            setFilterLoading(true);
            setFilterMessage(null);
            setError(null);
            const params = new URLSearchParams();
            if (filterStartDate) params.append('start_date', filterStartDate);
            if (filterEndDate) params.append('end_date', filterEndDate);
            if (filterDetectorId) params.append('detid', filterDetectorId);
            if (filterHourStart) params.append('hour_start', filterHourStart);
            if (filterHourEnd) params.append('hour_end', filterHourEnd);

            const queryString = params.toString();

            // Fetch ALL data with filters
            const [statsRes, analysisRes, dataRes] = await Promise.all([
                fetch(`${import.meta.env.BASE_URL}api/statistics?${queryString}`),
                fetch(`${import.meta.env.BASE_URL}api/analysis?${queryString}`),
                fetch(`${import.meta.env.BASE_URL}api/data?${queryString}`),
            ]);

            if (statsRes.ok && analysisRes.ok && dataRes.ok) {
                const [statsData, analysisData, trafficDataRes] = await Promise.all([
                    statsRes.json(),
                    analysisRes.json(),
                    dataRes.json(),
                ]);

                setStatistics(statsData);
                setAnalysis(analysisData);
                setTrafficData(trafficDataRes);

                // Show success message with record count
                const recordCount = statsData.row_count || 0;
                setFilterMessage(`Found ${recordCount.toLocaleString()} records`);
                setError(null);
            }
        } catch (err) {
            console.error('Filter error:', err);
            setError('Failed to apply filters');
            setFilterMessage(null);
        } finally {
            setFilterLoading(false);
        }
    };

    const handleTrainModel = async () => {
        try {
            setTraining(true);
            const res = await fetch(`${import.meta.env.BASE_URL}api/train`, { method: 'POST' });
            if (!res.ok) throw new Error('Training failed');
            const data = await res.json();
            setModelMetrics(data.metrics);
            setFeatures(data.feature_importance);

            // Fetch correlations after training
            const corrRes = await fetch(`${import.meta.env.BASE_URL}api/correlation`);
            if (corrRes.ok) {
                const corrData = await corrRes.json();
                setCorrelations(corrData.correlations);
            }
        } catch (err) {
            console.error('Training error:', err);
        } finally {
            setTraining(false);
        }
    };

    const handlePredict = async () => {
        try {
            setPredicting(true);
            const res = await fetch(`${import.meta.env.BASE_URL}api/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hour: parseInt(predHour),
                    weekday: parseInt(predWeekday),
                    detid: parseInt(predDetid),
                }),
            });
            if (!res.ok) throw new Error('Prediction failed');
            const data = await res.json();
            setPrediction(data);
        } catch (err) {
            console.error('Prediction error:', err);
        } finally {
            setPredicting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading ML Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !statistics || !analysis) {
        return (
            <Card className="border-orange-500/50 bg-gray-900">
                <CardHeader>
                    <CardTitle className="flex items-center text-orange-400">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Backend Not Running
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-300 mb-4">Run: <code className="bg-black px-2 py-1 rounded text-green-400">npm run dev:all</code></p>
                </CardContent>
            </Card>
        );
    }

    // Prepare chart data
    const featureData = features
        ? Object.entries(features)
            .map(([name, value]) => ({ name, value: Math.round(value * 1000) / 1000 }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8)
        : [];

    const hourlyFlowData = trafficData?.hourly_flow
        ? Object.entries(trafficData.hourly_flow).map(([hour, flow]) => ({
            hour: `${hour}:00`,
            flow: Math.round(flow || 0),
        }))
        : [];

    const trafficDistData = trafficData?.traffic_distribution
        ? Object.entries(trafficData.traffic_distribution).map(([name, value]) => ({
            name,
            value: (value as number) || 0,
        }))
        : [];

    const COLORS = ['#10b981', '#fbbf24', '#ef4444'];

    const congestionHourlyData = Object.entries(analysis.hourly_congestion).map(([hour, index]) => ({
        hour: `${hour}:00`,
        index: Math.round(index * 100) / 100,
    }));

    const congestionDailyData = Object.entries(analysis.daily_congestion).map(([day, index]) => ({
        day,
        index: Math.round(index * 100) / 100,
    }));

    const weekdayWeekendFlowData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${String(i).padStart(2, '0')}:00`,
        weekday: Math.round(analysis.weekday_hourly_flow[i] || 0),
        weekend: Math.round(analysis.weekend_hourly_flow[i] || 0),
    }));

    return (
        <div className="space-y-8 bg-gray-950 min-h-screen p-4 md:p-8">
            {/* Back Button */}
            <div className="mb-4">
                <Button
                    onClick={() => window.location.href = `${import.meta.env.BASE_URL}torino-dashboard`}
                    variant="outline"
                    className="border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-3">Torino Traffic ML Analysis</h1>
                <p className="text-gray-400 text-lg">Random Forest Prediction System • Torino Dataset • 2026</p>
            </div>

            {/* Top Row: Statistics, Model Training, Prediction */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Data Statistics */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-lg">Data Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Records:</span>
                            <span className="text-white font-mono">{(statistics?.row_count || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Date Range:</span>
                            <span className="text-white text-sm">
                                {statistics?.date_range?.start || 'N/A'} to {statistics?.date_range?.end || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Detectors:</span>
                            <span className="text-white font-mono">{statistics?.detector_count || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Avg Flow:</span>
                            <span className="text-white font-mono">{Math.round(statistics?.flow_stats?.mean || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Avg Speed:</span>
                            <span className="text-white font-mono">{Math.round(statistics?.speed_stats?.mean || 0)} km/h</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Model Training */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-lg">Model Training</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <Button
                            onClick={handleTrainModel}
                            disabled={training}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            {training ? 'Training...' : '⚡ Train Model'}
                        </Button>
                        {modelMetrics && (
                            <>
                                <div className="text-center text-sm text-green-400">Model trained successfully!</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400">{modelMetrics.r2_score.toFixed(4)}</div>
                                        <div className="text-xs text-gray-400">R² SCORE</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400">{modelMetrics.mae.toFixed(2)}</div>
                                        <div className="text-xs text-gray-400">MAE</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400">{modelMetrics.rmse.toFixed(2)}</div>
                                        <div className="text-xs text-gray-400">RMSE</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400">{modelMetrics.train_size.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">TRAIN SIZE</div>
                                    </div>
                                </div>
                                <div className="text-center text-xs text-gray-500">
                                    (sampled from {(statistics?.row_count || 0).toLocaleString()})
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Prediction */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-lg">Prediction</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <Label className="text-gray-400 text-xs">HOUR (0-23)</Label>
                            <Input
                                type="number"
                                value={predHour}
                                onChange={(e) => setPredHour(e.target.value)}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-400 text-xs">WEEKDAY (0=MON)</Label>
                            <Input
                                type="number"
                                value={predWeekday}
                                onChange={(e) => setPredWeekday(e.target.value)}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-400 text-xs">DETECTOR ID</Label>
                            <Input
                                type="number"
                                value={predDetid}
                                onChange={(e) => setPredDetid(e.target.value)}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <Button
                            onClick={handlePredict}
                            disabled={predicting}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            Predict Flow
                        </Button>
                        {prediction && (
                            <div className="bg-gray-800 p-3 rounded">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">{Math.round(prediction.prediction)}</div>
                                    <div className="text-xs text-gray-400">Predicted Flow</div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        Index: {prediction.traffic_index?.toFixed(2)} • {prediction.category}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feature Importance */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-sm">Feature Importance</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={featureData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis type="number" stroke="#9ca3af" fontSize={10} />
                                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={10} width={120} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Hourly Traffic Flow */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-sm">Hourly Traffic Flow</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={hourlyFlowData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="hour" stroke="#9ca3af" fontSize={9} angle={-45} textAnchor="end" height={60} />
                                <YAxis stroke="#9ca3af" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                <Area type="monotone" dataKey="flow" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Traffic Distribution */}
                <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-all">
                    <CardHeader className="border-b border-gray-800 pb-4">
                        <CardTitle className="text-green-400 text-base font-semibold">Traffic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={trafficDistData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    labelLine={true}
                                >
                                    {trafficDistData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                                    formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekday vs Weekend Comparison */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-sm">Weekday vs Weekend Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                                data={[
                                    {
                                        metric: 'Avg Flow',
                                        Weekday: Math.round(analysis.weekday_vs_weekend.weekday.avg_flow),
                                        Weekend: Math.round(analysis.weekday_vs_weekend.weekend.avg_flow),
                                    },
                                    {
                                        metric: 'Avg Speed',
                                        Weekday: Math.round(analysis.weekday_vs_weekend.weekday.avg_speed),
                                        Weekend: Math.round(analysis.weekday_vs_weekend.weekend.avg_speed),
                                    },
                                    {
                                        metric: 'Avg Occupancy',
                                        Weekday: Math.round(analysis.weekday_vs_weekend.weekday.avg_occ * 10) / 10,
                                        Weekend: Math.round(analysis.weekday_vs_weekend.weekend.avg_occ * 10) / 10,
                                    },
                                    {
                                        metric: 'Traffic Index',
                                        Weekday: Math.round(analysis.weekday_vs_weekend.weekday.avg_traffic_index * 10) / 10,
                                        Weekend: Math.round(analysis.weekday_vs_weekend.weekend.avg_traffic_index * 10) / 10,
                                    },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="metric" stroke="#9ca3af" fontSize={10} />
                                <YAxis stroke="#9ca3af" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                <Legend />
                                <Bar dataKey="Weekday" fill="#8b5cf6" />
                                <Bar dataKey="Weekend" fill="#ec4899" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Congestion by Hour */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-sm">Congestion by Hour</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={congestionHourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="hour" stroke="#9ca3af" fontSize={9} angle={-45} textAnchor="end" height={60} />
                                <YAxis stroke="#9ca3af" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                <Bar dataKey="index" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Congestion by Day */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-sm">Congestion by Day</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={congestionDailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="day" stroke="#9ca3af" fontSize={10} />
                                <YAxis stroke="#9ca3af" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                <Bar dataKey="index" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Peak Congestion Hours */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-sm">Peak Congestion Hours</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-3">
                            {analysis.peak_hours.map((peak, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">
                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx === 3 ? '🔵' : '🔴'}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{peak.hour}:00</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-yellow-400 font-bold">Index: {peak.index}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Weekday vs Weekend Flow Pattern */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-sm">Weekday vs Weekend Flow Pattern</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={weekdayWeekendFlowData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="hour" stroke="#9ca3af" fontSize={9} angle={-45} textAnchor="end" height={60} />
                                <YAxis stroke="#9ca3af" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                <Legend />
                                <Area type="monotone" dataKey="weekday" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="weekend" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Data Filters and Feature Correlations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Data Filters */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-sm">Data Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-400 text-xs">START DATE</Label>
                                <Input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-400 text-xs">END DATE</Label>
                                <Input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-400 text-xs">DETECTOR ID</Label>
                                <Input
                                    type="number"
                                    value={filterDetectorId}
                                    onChange={(e) => setFilterDetectorId(e.target.value)}
                                    placeholder="e.g., 230"
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-400 text-xs">HOUR START</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={filterHourStart}
                                    onChange={(e) => setFilterHourStart(e.target.value)}
                                    placeholder="0-23"
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-400 text-xs">HOUR END</Label>
                            <Input
                                type="number"
                                min="0"
                                max="23"
                                value={filterHourEnd}
                                onChange={(e) => setFilterHourEnd(e.target.value)}
                                placeholder="0-23"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <Button
                            onClick={applyFilters}
                            disabled={filterLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {filterLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block" />
                                    Applying...
                                </>
                            ) : (
                                'Apply Filters'
                            )}
                        </Button>
                        <Button
                            onClick={() => {
                                setFilterStartDate('2016-09-26');
                                setFilterEndDate('2016-10-16');
                                setFilterDetectorId('');
                                setFilterHourStart('0');
                                setFilterHourEnd('23');
                                setFilterMessage(null);
                                setError(null);
                                setTimeout(() => applyFilters(), 100);
                            }}
                            variant="outline"
                            className="w-full"
                        >
                            Reset Filters
                        </Button>
                        {filterMessage && (
                            <div className="bg-green-500/10 border border-green-500/50 rounded p-3 text-green-400 text-sm font-semibold flex items-center gap-2 mt-4">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {filterMessage}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Feature Correlations */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-blue-400 text-sm">Feature Correlations</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {correlations ? (
                            <div className="space-y-2">
                                {Object.entries(correlations)
                                    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                                    .slice(0, 10)
                                    .map(([feature, correlation], idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${correlation > 0 ? 'bg-green-500' : 'bg-red-500'
                                                            }`}
                                                        style={{
                                                            width: `${Math.abs(correlation) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span
                                                    className={`text-sm font-mono font-bold ${correlation > 0 ? 'text-green-400' : 'text-red-400'
                                                        }`}
                                                >
                                                    {correlation.toFixed(4)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p className="mb-4">Train the model to see feature correlations</p>
                                <p className="text-sm">Click "Train Model" button above</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MLTrafficDashboard;
