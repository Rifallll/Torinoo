"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Route, Bus, TramFront, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGtfsData } from '@/hooks/useGtfsData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AllGtfsRoutesPage: React.FC = () => {
  const { data: gtfsData, isLoading, error } = useGtfsData();
  const routes = gtfsData?.routes || [];
  const agencies = gtfsData?.agencies || [];

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
      default: return 'Lainnya';
    }
  };

  const getRouteTypeIcon = (routeType: number) => {
    switch (routeType) {
      case 0: return <TramFront className="h-4 w-4 mr-1" />;
      case 3: return <Bus className="h-4 w-4 mr-1" />;
      default: return <Info className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Route className="h-8 w-8 mr-3 text-indigo-600" />
          Semua Rute Transportasi Publik (GTFS)
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1">
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">Memuat data rute GTFS lokal...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-8">Gagal memuat rute: {error.message}</p>
        ) : routes.length > 0 ? (
          <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID Rute</TableHead>
                      <TableHead>Nama Pendek</TableHead>
                      <TableHead>Nama Panjang</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Deskripsi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route) => {
                      const agency = agencies.find(a => a.agency_id === route.agency_id);
                      return (
                        <TableRow key={route.route_id}>
                          <TableCell className="font-medium">{route.route_id}</TableCell>
                          <TableCell>{route.route_short_name || 'N/A'}</TableCell>
                          <TableCell>{route.route_long_name || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs flex items-center">
                              {getRouteTypeIcon(route.route_type)} {getRouteTypeLabel(route.route_type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{agency?.agency_name || 'N/A'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{route.route_desc || 'N/A'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">Tidak ada rute transportasi publik yang tersedia dari data GTFS lokal.</p>
        )}
      </main>
    </div>
  );
};

export default AllGtfsRoutesPage;