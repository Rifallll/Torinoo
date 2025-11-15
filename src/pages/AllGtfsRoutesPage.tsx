"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Route, Bus, TramFront, Info, Search, XCircle, TrainFront, CableCar, Ship, Cable, Plus } from 'lucide-react'; // Replaced Ferry with Ship
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGtfsData } from '@/hooks/useGtfsData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ITEMS_PER_LOAD = 20; // Number of items to load at a time

const AllGtfsRoutesPage: React.FC = () => {
  const { data: gtfsData, isLoading, error } = useGtfsData();
  const allRoutes = gtfsData?.routes || [];
  const agencies = gtfsData?.agencies || [];

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRouteType, setSelectedRouteType] = useState<string>('all');
  const [loadCount, setLoadCount] = useState(1);

  const getRouteTypeLabel = (routeType: number) => {
    switch (routeType) {
      case 0: return 'Tram';
      case 1: return 'Subway';
      case 2: return 'Rail';
      case 3: return 'Bus';
      case 4: return 'Ferry';
      case 5: return 'Cable Car';
      case 6: return 'Gondola';
      case 7: return 'Funicular';
      default: return 'Other';
    }
  };

  const getRouteTypeIcon = (routeType: number) => {
    switch (routeType) {
      case 0: return <TramFront className="h-4 w-4 mr-1" />;
      case 1: return <TrainFront className="h-4 w-4 mr-1" />; // Subway
      case 2: return <TrainFront className="h-4 w-4 mr-1" />; // Rail
      case 3: return <Bus className="h-4 w-4 mr-1" />;
      case 4: return <Ship className="h-4 w-4 mr-1" />; // Ferry (using Ship icon)
      case 5: return <CableCar className="h-4 w-4 mr-1" />; // Cable Car
      case 6: return <Cable className="h-4 w-4 mr-1" />; // Gondola (using Cable as a generic icon)
      case 7: return <CableCar className="h-4 w-4 mr-1" />; // Funicular (using CableCar as a generic icon)
      default: return <Info className="h-4 w-4 mr-1" />; // Default for unknown types
    }
  };

  const filteredRoutes = useMemo(() => {
    let currentRoutes = allRoutes;

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentRoutes = currentRoutes.filter(route =>
        route.route_id.toLowerCase().includes(lowerCaseSearchTerm) ||
        (route.route_short_name?.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (route.route_long_name?.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (route.route_desc?.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (agencies.find(a => a.agency_id === route.agency_id)?.agency_name.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Filter by route type
    if (selectedRouteType !== 'all') {
      const typeNumber = parseInt(selectedRouteType, 10);
      currentRoutes = currentRoutes.filter(route => route.route_type === typeNumber);
    }

    return currentRoutes;
  }, [allRoutes, searchTerm, selectedRouteType, agencies]);

  const displayedRoutes = useMemo(() => {
    return filteredRoutes.slice(0, loadCount * ITEMS_PER_LOAD);
  }, [filteredRoutes, loadCount]);

  const handleLoadMore = useCallback(() => {
    setLoadCount(prevCount => prevCount + 1);
  }, []);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRouteType('all');
    setLoadCount(1); // Reset load count when filters change
  };

  const availableRouteTypes = useMemo(() => {
    const types = new Set<number>();
    allRoutes.forEach(route => types.add(route.route_type));
    return Array.from(types).sort((a, b) => a - b);
  }, [allRoutes]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Route className="h-8 w-8 md:h-10 md:w-10 mr-3 text-indigo-600" />
          All Public Transport Routes (GTFS)
        </h1>
        <Button asChild variant="outline" className="px-4 py-2 text-sm md:text-base">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full">
        <Card className="mb-6 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search routes (ID, name, description, operator)..."
                  className="pl-9 pr-8 w-full h-10 text-base border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:bg-transparent"
                    onClick={() => setSearchTerm('')}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Select onValueChange={setSelectedRouteType} value={selectedRouteType}>
                <SelectTrigger className="w-full sm:w-[200px] h-10 text-base border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                  <SelectValue placeholder="Filter Route Type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:text-gray-200">
                  <SelectItem value="all">All Types</SelectItem>
                  {availableRouteTypes.map(type => (
                    <SelectItem key={type} value={String(type)}>
                      {getRouteTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm || selectedRouteType !== 'all') && (
                <Button variant="outline" onClick={handleResetFilters} className="flex items-center h-10 px-4 py-2 text-base">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-12 text-lg">Loading local GTFS route data...</p>
        ) : error ? (
          <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-xl border-red-500">
            <CardContent className="p-6 text-center text-red-500 text-lg">
              Failed to load routes: {error.message}
            </CardContent>
          </Card>
        ) : displayedRoutes.length > 0 ? (
          <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-xl rounded-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow className="border-b border-gray-200 dark:border-gray-600">
                      <TableHead className="w-[120px] py-4 px-6 text-gray-700 dark:text-gray-300 font-semibold text-sm">Route ID</TableHead>
                      <TableHead className="py-4 px-6 text-gray-700 dark:text-gray-300 font-semibold text-sm">Short Name</TableHead>
                      <TableHead className="py-4 px-6 text-gray-700 dark:text-gray-300 font-semibold text-sm">Long Name</TableHead>
                      <TableHead className="py-4 px-6 text-gray-700 dark:text-gray-300 font-semibold text-sm">Type</TableHead>
                      <TableHead className="py-4 px-6 text-gray-700 dark:text-gray-300 font-semibold text-sm">Operator</TableHead>
                      <TableHead className="py-4 px-6 text-gray-700 dark:text-gray-300 font-semibold text-sm">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedRoutes.map((route) => {
                      const agency = agencies.find(a => a.agency_id === route.agency_id);
                      return (
                        <TableRow key={route.route_id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <TableCell className="font-medium py-3 px-6 text-gray-800 dark:text-gray-100">{route.route_id}</TableCell>
                          <TableCell className="py-3 px-6 text-gray-700 dark:text-gray-200">{route.route_short_name || 'N/A'}</TableCell>
                          <TableCell className="py-3 px-6 text-gray-700 dark:text-gray-200">{route.route_long_name || 'N/A'}</TableCell>
                          <TableCell className="py-3 px-6">
                            <Badge variant="outline" className="text-xs flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                              {getRouteTypeIcon(route.route_type)} {getRouteTypeLabel(route.route_type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 px-6 text-gray-700 dark:text-gray-200">{agency?.agency_name || 'N/A'}</TableCell>
                          <TableCell className="max-w-[250px] truncate py-3 px-6 text-gray-700 dark:text-gray-200">{route.route_desc || 'N/A'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {displayedRoutes.length < filteredRoutes.length && (
              <div className="text-center mt-4 p-4 border-t dark:border-gray-700">
                <Button onClick={handleLoadMore} variant="outline" className="flex items-center mx-auto">
                  <Plus className="h-4 w-4 mr-2" /> Load More ({filteredRoutes.length - displayedRoutes.length} remaining)
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-xl">
            <CardContent className="p-6 text-center text-gray-600 dark:text-gray-400 text-lg">
              No public transport routes available from local GTFS data matching your filters.
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AllGtfsRoutesPage;