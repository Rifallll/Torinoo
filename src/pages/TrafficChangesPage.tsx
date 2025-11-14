"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrafficCone, Info, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockTrafficChanges } from '@/components/TrafficChangesInsights';

const TrafficChangesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <TrafficCone className="h-8 w-8 mr-3 text-indigo-600" />
          Semua Perubahan Lalu Lintas & Pekerjaan Jalan
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTrafficChanges.length > 0 ? (
          mockTrafficChanges.map(change => (
            <Card key={change.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <TrafficCone className="h-5 w-5 mr-2 text-orange-600" />
                  {change.title}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {change.responsibleEntity ? `Oleh: ${change.responsibleEntity}` : 'N/A'}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {change.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs flex items-center">
                    <Info className="h-4 w-4 mr-1" /> {change.type ? change.type.charAt(0).toUpperCase() + change.type.slice(1) : 'Perubahan'}
                  </Badge>
                  {change.startDate && (
                    <Badge variant="secondary" className="text-xs flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" /> Mulai: {change.startDate}
                    </Badge>
                  )}
                  {change.endDate && (
                    <Badge variant="secondary" className="text-xs flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" /> Berakhir: {change.endDate}
                    </Badge>
                  )}
                </div>
                {change.fullDescription && (
                  <Button variant="link" className="p-0 h-auto justify-start text-sm mt-2">
                    Baca Selengkapnya
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">Tidak ada perubahan lalu lintas yang dilaporkan.</p>
        )}
      </main>
    </div>
  );
};

export default TrafficChangesPage;