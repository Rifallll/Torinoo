"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, FileText, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';

interface Report {
  id: string;
  title: string;
  date: string;
  description: string;
  type: string;
  download_url?: string;
}

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReports(data || []);
      } catch (err: any) {
        console.error('Error fetching reports:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <BarChart2 className="h-8 w-8 mr-3 text-indigo-600" />
          Traffic Reports
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-600 rounded-md">
          Error loading reports: {error}. Make sure you have created the `reports` table in Supabase.
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No reports available yet.
        </div>
      ) : (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {reports.map(report => (
            <Card key={report.id} className="overflow-hidden flex flex-col bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">{report.title}</CardTitle>
                <p className="text-sm text-gray-500">Generated: {report.date}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-gray-700 dark:text-gray-300 mb-4">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <FileText className="h-4 w-4 mr-1" /> {report.type}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => {
                      if (report.download_url) {
                        window.open(report.download_url, '_blank');
                      } else {
                        alert('Download link not available for this report.');
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </main>
      )}
    </div>
  );
};

export default ReportsPage;