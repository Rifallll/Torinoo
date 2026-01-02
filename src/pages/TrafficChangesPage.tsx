import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrafficCone, Info, CalendarDays, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTomTomIncidents } from '@/hooks/useTomTomIncidents';
import { useSupabaseTraffic } from '@/hooks/useSupabaseTraffic';
import { TrafficChange } from '@/components/TrafficChangesInsights';

const TrafficChangesPage: React.FC = () => {
  const { incidents: tomtomIncidents, isLoading: isTomTomLoading, error: tomtomError } = useTomTomIncidents();
  const { trafficChanges: supabaseRoadworks, isLoading: isSupabaseLoading, error: supabaseError } = useSupabaseTraffic();

  const isLoading = isTomTomLoading || isSupabaseLoading;
  const error = tomtomError || supabaseError;

  // Map TomTom incidents to the TrafficChange interface for consistency
  const trafficChanges: TrafficChange[] = [
    ...(supabaseRoadworks || []).map(rw => ({
      id: rw.id,
      title: rw.title,
      description: rw.description,
      latitude: rw.latitude,
      longitude: rw.longitude,
      startDate: rw.start_date,
      type: (rw.type || 'roadwork') as any,
      responsibleEntity: rw.responsible_entity || 'Muoversi a Torino'
    })),
    ...(tomtomIncidents || []).map(inc => ({
      id: inc.id,
      title: inc.from ? `${inc.type} at ${inc.from}` : inc.type,
      description: inc.description,
      latitude: inc.latitude,
      longitude: inc.longitude,
      startDate: inc.reportedAt,
      type: (inc.type.toLowerCase().includes('closure') ? 'closure' :
        inc.type.toLowerCase().includes('work') ? 'roadwork' : 'reduction') as any,
      responsibleEntity: 'TomTom Live'
    }))
  ];

  // Deduplicate items based on title + description signature
  const uniqueTrafficChanges = Array.from(
    new Map(
      trafficChanges.map(item => [
        `${item.title}-${item.description?.substring(0, 50)}`, // Signature
        item
      ])
    ).values()
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <TrafficCone className="h-8 w-8 mr-3 text-indigo-600" />
          All Traffic Changes & Roadworks
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-600 rounded-md">
          Error loading traffic changes: {error}. Using TomTom Real-time API.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">Reported</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueTrafficChanges.length > 0 ? (
                uniqueTrafficChanges.map((change) => {
                  const isClosure = change.title.toLowerCase().includes('closure');
                  // Determine 'Macet' / 'Sedang' / 'Lancar'
                  // Logic: Closure or High Severity = Macet. Roadworks = Sedang. Minor = Lancar.
                  let statusLabel = 'Lancar';
                  let statusBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';

                  // We use the severity from TomTom if available, otherwise guess based on type
                  const severity = change.severity || (isClosure ? 'High' : 'Medium');

                  if (severity === 'High' || isClosure) {
                    statusLabel = 'Macet';
                    statusBadgeColor = 'bg-red-100 text-red-800 border-red-200';
                  } else if (severity === 'Medium') {
                    statusLabel = 'Sedang';
                    statusBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                  }

                  return (
                    <TableRow key={change.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                      <TableCell>
                        <Badge variant="outline" className={`${statusBadgeColor} font-semibold shadow-sm`}>
                          {statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                        {change.title.replace(/^(Road Closure|Roadworks|Road Work|Works) (at|in|on) /i, '')}
                        <div className="md:hidden text-xs text-gray-500 mt-1 font-normal line-clamp-1">{change.description}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="capitalize text-sm text-gray-600 dark:text-gray-400">
                          {change.type || 'Incident'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-600 dark:text-gray-400 max-w-md truncate text-sm">
                        {change.description}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-500 text-xs whitespace-nowrap">
                        {change.startDate ? new Date(change.startDate).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No active traffic changes reported in Torino.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div >
  );
};

export default TrafficChangesPage;