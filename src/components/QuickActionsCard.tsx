"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Upload, Info, Download } from 'lucide-react';

interface QuickActionsCardProps {
  onUploadCSVClick: () => void;
  onExportClick: () => void;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = React.memo(({ onUploadCSVClick, onExportClick }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center p-3 h-auto w-full
                       bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
            onClick={onUploadCSVClick}
          >
            <Upload className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Upload CSV Data</span>
          </Button>
          {/* Tombol 'View & Sync Data' dihapus sesuai permintaan */}
          {/* <Button
            asChild
            variant="ghost"
            className="flex flex-col items-center justify-center p-3 h-auto w-full
                       bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
          >
            <Link to="/data-analysis" className="flex flex-col items-center justify-center">
              <BarChart2 className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">View & Sync Data</span>
            </Link>
          </Button> */}
          <Button
            asChild
            variant="ghost"
            className="flex flex-col items-center justify-center p-3 h-auto w-full
                       bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
          >
            <Link to="/about-torino" className="flex flex-col items-center justify-center">
              <Info className="h-6 w-6 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">About Torino City</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center p-3 h-auto w-full
                       bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
            onClick={onExportClick}
          >
            <Download className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Export</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default QuickActionsCard;