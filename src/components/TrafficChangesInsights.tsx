"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react'; // Only need one icon for the title

// Interface for traffic change data extracted from HTML
export interface TrafficChange {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  latitude: number;
  longitude: number;
  startDate?: string; // e.g., 'From Monday 10 November'
  endDate?: string;   // e.g., 'Until Friday 8 December'
  type?: 'closure' | 'roadwork' | 'reduction' | 'pedestrianization'; // Type of change
  responsibleEntity?: string; // e.g., 'Comune di Torino', 'SMAT', 'IRETI'
}

// Dummy data manually extracted from your provided HTML
export const mockTrafficChanges: TrafficChange[] = [
  {
    id: '668853',
    title: 'CLOSURE IN CORSO MORTARA',
    description: 'From Monday, November 10, due to municipal works, the last section of Corso Mortara towards Piazza Baldissera will be closed with a mandatory right turn onto Corso Principe Oddone.',
    latitude: 45.0918,
    longitude: 7.66297,
    startDate: '2025-11-10', // Assuming year 2025 from context
    type: 'closure',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '667941',
    title: '14/11 CLOSURE IN MORTARA UNDERPASS',
    description: 'Friday, November 14, from 9:30 AM to 4:30 PM, due to municipal works, the Mortara underpass towards Via Orvieto will be closed.',
    latitude: 45.0918,
    longitude: 7.66297,
    startDate: '2025-11-14',
    endDate: '2025-11-14',
    type: 'closure',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '668781',
    title: 'WORKS IN PIAZZA SOFIA',
    description: 'Until Friday, November 14, due to SMAT works, lane reductions are planned in Piazza Sofia at the intersection with Strada Settimo.',
    latitude: 45.0951,
    longitude: 7.71709,
    endDate: '2025-11-14',
    type: 'reduction',
    responsibleEntity: 'SMAT',
  },
  {
    id: '668498',
    title: 'WORKS ON CORSO TASSONI SERVICE ROADS',
    description: 'From Monday, November 17 to Wednesday, December 17, due to municipal works, road closures are planned on the east and west service roads of Corso Tassoni between Piazza Bernini and Corso Regina Margherita.',
    latitude: 45.0814,
    longitude: 7.65617,
    startDate: '2025-11-17',
    endDate: '2025-12-17',
    type: 'roadwork',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '668465',
    title: 'WORKS AT VALENTINO PARK',
    description: 'Due to works inside Valentino Park, road closures are planned. Read more...',
    fullDescription: 'Due to works inside Valentino Park, road closures are planned. From Monday, November 10, 2025 to Sunday, March 1, 2026, Viale Turr will be closed between Viale Boiardo and Via Millio. Until Sunday, March 1, 2026, closures are also in effect on: - Viale Stefano Turr between Viale Boiardo and Viale Marinai d\'Italia - Viale Boiardo between Via Turr and Viale Marinai d\'Italia - Viale Marinai d\'Italia between Viale Boiardo and Viale Turr - Viale Millio between Viale Turr and the entrance to the Medieval Village',
    latitude: 45.0501,
    longitude: 7.68233,
    startDate: '2025-11-10',
    endDate: '2026-03-01',
    type: 'closure',
    responsibleEntity: 'Comune de Torino',
  },
  {
    id: '667923',
    title: 'VIA ROMA PEDESTRIANIZATION',
    description: 'Due to preparatory works for the pedestrianization of Via Roma, closures are planned in the city center. Read more...',
    fullDescription: 'Due to preparatory works for the pedestrianization of Via Roma, closures are planned in the city center. Until Wednesday, December 31, closures are in effect on: - Piazza CLN between Via Giolitti and Via Rossi - Piazza CLN between Via Rossi and Via Amendola - Piazza CLN between Via Alfieri and Via Frola - Via Frola between Via XX Settembre and Piazza CLN. Until Saturday, January 31, 2026, Via Roma will also be closed between Via Cavour and Via Buozzi.',
    latitude: 45.066,
    longitude: 7.68131,
    startDate: '2025-09-22', // Assumed from original HTML description
    endDate: '2026-01-31',
    type: 'pedestrianization',
    responsibleEntity: 'Comune di Torino',
  },
];

interface TrafficChangesInsightsProps {
  id?: string;
}

const TrafficChangesInsights: React.FC<TrafficChangesInsightsProps> = ({ id }) => {
  console.log("Rendering simplified TrafficChangesInsights"); // Add log to check if it renders
  return (
    <div id={id} className="grid grid-cols-1 gap-6">
      <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" /> Traffic Changes Insights & Predictions (Simplified)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>This is a simplified version of Traffic Changes Insights.</p>
          <p>If you see this, the component rendered successfully without crashing.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficChangesInsights;