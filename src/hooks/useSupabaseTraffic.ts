import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface SupabaseIncident {
    id: string;
    type: string;
    location: string;
    status: string;
    severity: string;
    description: string;
    reported_at: string;
}

export interface SupabaseTrafficChange {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    start_date: string;
    type: string;
    responsible_entity: string;
}

export const useSupabaseTraffic = () => {
    const [incidents, setIncidents] = useState<SupabaseIncident[]>([]);
    const [trafficChanges, setTrafficChanges] = useState<SupabaseTrafficChange[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch incidents (Official alerts)
            const { data: incidentsData, error: incidentsError } = await supabase
                .from('incidents')
                .select('*')
                .order('reported_at', { ascending: false });

            if (incidentsError) throw incidentsError;

            // Fetch traffic changes (Official roadworks)
            const { data: trafficChangesData, error: trafficChangesError } = await supabase
                .from('traffic_changes')
                .select('*')
                .order('start_date', { ascending: false });

            if (trafficChangesError) {
                // It's possible the table doesn't exist yet if user hasn't run the SQL
                console.warn("traffic_changes table not found, skipping.");
                setTrafficChanges([]);
            } else {
                setTrafficChanges(trafficChangesData || []);
            }

            setIncidents(incidentsData || []);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching Supabase traffic data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Refresh every 1 minute
        const interval = setInterval(() => {
            console.log("Auto-refreshing Supabase traffic data...");
            fetchData();
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { incidents, trafficChanges, isLoading, error, refetch: fetchData };
};
