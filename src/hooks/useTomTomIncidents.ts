import { useState, useEffect } from 'react';

export interface TomTomIncident {
    id: string;
    type: string;
    severity: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    reportedAt: string;
    status: string;
    type_code?: number;
    from?: string;
    to?: string;
}

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;
// Torino Bounding Box: minLon, minLat, maxLon, maxLat (Expanded to include Tangenziale/Metro area)
const TORINO_BBOX = '7.40,44.90,7.95,45.28';

export const useTomTomIncidents = () => {
    const [incidents, setIncidents] = useState<TomTomIncident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIncidents = async () => {
        if (!TOMTOM_API_KEY) {
            setError("TomTom API Key is missing.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            // TomTom Incident Details API (v5) - Correct fields and full property names
            const fields = '{incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,startTime,endTime,from,to,length,delay,events{description,code,iconCategory}}}}';
            const encodedFields = encodeURIComponent(fields);
            const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${TOMTOM_API_KEY}&bbox=${TORINO_BBOX}&fields=${encodedFields}&language=en-GB`;

            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to fetch TomTom incidents: ${response.statusText}. ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();

            if (data && data.incidents) {
                const mappedIncidents: TomTomIncident[] = data.incidents.map((inc: any) => {
                    const props = inc.properties;
                    const coords = inc.geometry.coordinates;
                    const event = props.events && props.events.length > 0 ? props.events[0] : null;

                    // Map iconCategory to typeLabel
                    let typeLabel = 'Incident';
                    switch (props.iconCategory) {
                        case 1: typeLabel = 'Accident'; break;
                        case 6: typeLabel = 'Congestion'; break;
                        case 7: typeLabel = 'Lane Closure'; break;
                        case 8: typeLabel = 'Road Closure'; break;
                        case 9: typeLabel = 'Roadworks'; break;
                        case 14: typeLabel = 'Breakdown'; break;
                    }

                    // Map magnitudeOfDelay to severityLabel
                    let severityLabel = 'Medium';
                    const magnitude = props.magnitudeOfDelay;
                    if (magnitude >= 3) severityLabel = 'High';
                    else if (magnitude <= 1) severityLabel = 'Low';

                    return {
                        id: props.id,
                        type: typeLabel,
                        severity: severityLabel,
                        description: event?.description || props.description || 'No description available',
                        location: props.from || props.to || 'Torino',
                        from: props.from,
                        to: props.to,
                        latitude: coords[1],
                        longitude: coords[0],
                        reportedAt: props.startTime || new Date().toISOString(),
                        status: 'Ongoing'
                    };
                });

                // Client-side filtering removed to trust API BBOX and ensure data visibility
                console.log("Mapped Incidents:", mappedIncidents);
                setIncidents(mappedIncidents);
            } else {
                setIncidents([]);
            }
            setError(null);
        } catch (err: any) {
            console.error('Error fetching TomTom incidents:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
        // Refresh every 1 minute
        const interval = setInterval(() => {
            console.log("Auto-refreshing TomTom incidents...");
            fetchIncidents();
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { incidents, isLoading, error, refetch: fetchIncidents };
};
