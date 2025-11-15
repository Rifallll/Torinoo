"use client";

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Corrected import
import { Input } from '@/components/ui/input'; // Corrected import
import { Button } from '@/components/ui/button'; // Corrected import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Corrected import
import { useTrafficData, TrafficDataRow } from '@/contexts/TrafficDataContext';

const ITEMS_PER_PAGE = 20; // Number of rows per page

const TrafficDataTablePage: React.FC = () => {
  const { uploadedData, analysisStatus } = useTrafficData(); // Corrected destructuring
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = analysisStatus === 'processing' || analysisStatus === 'idle';
  const error = analysisStatus === 'error' ? new Error("Failed to load raw data.") : null;


  const filteredData = useMemo(() => {
    if (!uploadedData) return [];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return uploadedData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }, [uploadedData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5; // Max number of page buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  const columns: (keyof TrafficDataRow)[] = [
    "day", "day_of_week", "interval", "hour", "minute", "time", "time_of_day",
    "flow", "speed", "occ", "city", "day_of_month", "month", "month_name",
    "quarter", "week_number", "is_weekend"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <FileText className="h-8 w-8 md:h-10 md:w-10 mr-3 text-indigo-600" />
          Raw Traffic Data Table
        </h1>
        <Button asChild variant="outline" className="px-4 py-2 text-sm md:text-base">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 max-w-full mx-auto w-full">
        <Card className="mb-6 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <CardContent className="p-0">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search all columns..."
                className="pl-9 pr-4 w-full h-10 text-base border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-12 text-lg">Loading raw traffic data...</p>
        ) : error ? (
          <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-xl border-red-500">
            <CardContent className="p-6 text-center text-red-500 text-lg">
              Failed to load raw data: {error.message}
            </CardContent>
          </Card>
        ) : filteredData.length > 0 ? (
          <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-xl rounded-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                    <TableRow className="border-b border-gray-200 dark:border-gray-600">
                      {columns.map(key => (
                        <TableHead key={key} className="py-4 px-6 text-gray-700 dark:text-gray-300 font-semibold text-sm whitespace-nowrap">
                          {(key as string).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} {/* Format column names */}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTableData.map((row, rowIndex) => (
                      <TableRow key={rowIndex} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {columns.map(key => (
                          <TableCell key={key} className="font-medium py-3 px-6 text-gray-800 dark:text-gray-100 whitespace-nowrap">
                            {String(row[key])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-xl">
            <CardContent className="p-6 text-center text-gray-600 dark:text-gray-400 text-lg">
              No raw traffic data available or matching your search.
            </CardContent>
          </Card>
        )}

        {/* Pagination Controls */}
        {filteredData.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {renderPaginationButtons()}
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrafficDataTablePage;