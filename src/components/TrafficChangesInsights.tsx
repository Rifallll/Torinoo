"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react'; // Only need one icon for the title

// Interface untuk data perubahan lalu lintas yang diekstrak dari HTML
export interface TrafficChange {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  latitude: number;
  longitude: number;
  startDate?: string; // Misalnya, 'Da lunedì 10 novembre'
  endDate?: string;   // Misalnya, 'Fino a venerdì 8 desember'
  type?: 'closure' | 'roadwork' | 'reduction' | 'pedestrianization'; // Tipe perubahan
  responsibleEntity?: string; // Misalnya, 'Comune di Torino', 'SMAT', 'IRETI'
}

// Data dummy yang diekstrak secara manual dari HTML yang Anda berikan
export const mockTrafficChanges: TrafficChange[] = [
  {
    id: '668853',
    title: 'CHIUSURA IN CORSO MORTARA',
    description: 'Da lunedì 10 novembre, per lavori del comune di Torino, è prevista la chiusura dell\'utimo tratto di corso Mortara in direzione piazza Baldissera con obbligo di svolta a destra su corso Principe Oddone.',
    latitude: 45.0918,
    longitude: 7.66297,
    startDate: '2025-11-10', // Asumsi tahun 2025 dari konteks
    type: 'closure',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '667941',
    title: '14/11 CHIUSURA IN SOTTOPASSO MORTARA',
    description: 'Venerdì 14 novembre dalle 9:30 alle 16:30, per lavori del Comune di Torino, è prevista la chiusura del sottopasso Mortara in direzione via Orvieto.',
    latitude: 45.0918,
    longitude: 7.66297,
    startDate: '2025-11-14',
    endDate: '2025-11-14',
    type: 'closure',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '668781',
    title: 'LAVORI IN PIAZZA SOFIA',
    description: 'Fino a venerdì 14 november, per lavori SMAT, sono previste riduzioni di carreggiata in piazza Sofia all\'intersezione con strada Settimo.',
    latitude: 45.0951,
    longitude: 7.71709,
    endDate: '2025-11-14',
    type: 'reduction',
    responsibleEntity: 'SMAT',
  },
  {
    id: '668498',
    title: 'LAVORI SU CONTROVIALI DI CORSO TASSONI',
    description: 'Da lunedì 17 november a mercoledì 17 dicembre, per lavori del comune di Torino, sono previsti lavori con chiusure di carreggiata sui controviali est e ovest di corso Tassoni tra piazza Bernini e corso Regina Margherita.',
    latitude: 45.0814,
    longitude: 7.65617,
    startDate: '2025-11-17',
    endDate: '2025-12-17',
    type: 'roadwork',
    responsibleEntity: 'Comune di Torino',
  },
  {
    id: '668465',
    title: 'LAVORI AL PARCO DEL VALENTINO',
    description: 'Per lavori all\'interno del parco del Valentino sono previste chiusure viabili. Baca tutto...',
    fullDescription: 'Per lavori all\'interno del parco del Valentino sono previste chiusure viabili. Da lunedì 10 november 2025 a domenica 1 marzo 2026 adalah penutupan diviale Turr antara viale Boiardo dan via Millio. Hingga Minggu 1 Maret 2026 adalah penutupan di: - viale Stefano Turr antara viale Boiardo dan viale Marinai d\'Italia - viale Boiardo antara via Turr dan viale Marinai d\'Italia - viale Marinai d\'Italia antara viale Boiardo dan viale Turr - viale Millio antara viale Turr dan pintu masuk ke Borgo Medievale',
    latitude: 45.0501,
    longitude: 7.68233,
    startDate: '2025-11-10',
    endDate: '2026-03-01',
    type: 'closure',
    responsibleEntity: 'Comune de Torino',
  },
  {
    id: '667923',
    title: 'PEDONALIZZAZIONE VIA ROMA',
    description: 'Per lavori propedeutici alla pedonalizzazione di via Roma sono previste chiusure nel cento città. Baca tutto...',
    fullDescription: 'Per lavori propedeutici alla pedonalizzazione di via Roma sono previste chiusure nel cento città. Hingga Rabu 31 Desember adalah penutupan di: - piazza CLN antara via Giolitti dan via Rossi - piazza CLN antara via Rossi dan via Amendola - piazza CLN antara via Alfieri dan via Frola - via Frola antara via XX Settembre dan via piazza CLN. Hingga Sabtu 31 Januari 2026 juga adalah penutupan via Roma antara via Cavour dan via Buozzi.',
    latitude: 45.066,
    longitude: 7.68131,
    startDate: '2025-09-22', // Asumsi dari deskripsi di HTML asli
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
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" /> Wawasan & Prediksi Perubahan Lalu Lintas (Simplified)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Ini adalah versi sederhana dari Wawasan Perubahan Lalu Lintas.</p>
          <p>Jika Anda melihat ini, komponen berhasil dirender tanpa crash.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficChangesInsights;