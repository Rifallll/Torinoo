import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, MapPin, Loader2, Info, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTomTomIncidents } from '@/hooks/useTomTomIncidents';
import { useSupabaseTraffic } from '@/hooks/useSupabaseTraffic';

const IncidentsPage = () => {
  const { incidents: tomtomIncidents, isLoading: isTomTomLoading, error: tomtomError } = useTomTomIncidents();
  const { incidents: supabaseIncidents, isLoading: isSupabaseLoading, error: supabaseError } = useSupabaseTraffic();

  const isLoading = isTomTomLoading || isSupabaseLoading;
  const error = tomtomError || supabaseError;

  const rawIncidents = [
    ...(supabaseIncidents || []).map(inc => ({
      ...inc,
      reportedAt: inc.reported_at, // Normalize
      source: 'Official Torino (MATO/GTT)'
    })),
    ...(tomtomIncidents || []).map(inc => ({
      ...inc,
      source: 'TomTom Live'
    }))
  ];

  // Deduplication Logic
  // We use a Map to keep unique incidents. Key derived from title + description (normalized)
  const uniqueIncidentsMap = new Map();

  rawIncidents.forEach(inc => {
    // Create a unique signature. 
    // We normalize strings to ignore minor whitespace diffs.
    const sig = `${inc.type}-${inc.description?.substring(0, 50)}`.toLowerCase().trim();

    if (!uniqueIncidentsMap.has(sig)) {
      uniqueIncidentsMap.set(sig, inc);
    }
  });

  const allIncidents = Array.from(uniqueIncidentsMap.values());

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <AlertTriangle className="h-8 w-8 mr-3 text-indigo-600" />
          Traffic Incidents
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
          Error loading incidents: {error}. Using TomTom Real-time API.
        </div>
      ) : allIncidents.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No incidents reported at the moment.
        </div>
      ) : (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {allIncidents.map(incident => {
            const isHighSeverity = incident.severity === 'High';
            const statusColor = isHighSeverity ? 'bg-red-500' : 'bg-amber-500';
            const borderColor = isHighSeverity ? 'border-l-red-500' : 'border-l-amber-500';

            return (
              <Card key={incident.id} className={`overflow-hidden flex flex-col bg-white dark:bg-gray-800 border-t border-b border-r border-l-4 ${borderColor} shadow-sm hover:shadow-lg transition-all duration-300`}>
                <CardHeader className="pb-3 bg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className={`${isHighSeverity ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'} border-none font-medium mb-1`}
                      >
                        {incident.severity} SEVERITY
                      </Badge>
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug">
                        {incident.type}
                      </CardTitle>
                    </div>
                    <span className="text-xs text-gray-400 font-mono flex items-center bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(incident.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                    <MapPin className="h-4 w-4 mr-1.5 text-indigo-500 shrink-0" />
                    <span className="line-clamp-1">{incident.location || 'Location pinpointed on map'}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                      <div
                        className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>img]:rounded-md [&>img]:shadow-sm [&>img]:max-h-48 [&>a]:text-blue-600 hover:[&>a]:underline"
                        dangerouslySetInnerHTML={{ __html: incident.description }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                      <Info className="h-3.5 w-3.5 mr-1.5" />
                      Source: <span className="font-semibold ml-1">{incident.source}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-[10px] px-2">
                      {incident.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </main>
      )
      }
    </div >
  );
};

export default IncidentsPage;