"use client";

import { toast } from 'sonner';

export interface TrafficModification {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  latitude: number;
  longitude: number;
  status: 'red' | 'yellow' | 'green'; // Based on the 'avviso' class, assuming 'rosso' means 'red'
}

// Simulated data extracted from the provided HTML snippet
const mockTrafficModifications: TrafficModification[] = [
  {
    id: "668853",
    title: "CHIUSURA IN CORSO MORTARA",
    shortDescription: "Da lunedì 10 novembre, per lavori del comune di Torino, è prevista la chiusura dell'utimo tratto di corso Mortara in direzione piazza Baldissera con obbligo di svolta a destra su corso Principe Oddone.",
    fullDescription: "Da lunedì 10 novembre, per lavori del comune di Torino, è prevista la chiusura dell'utimo tratto di corso Mortara in direzione piazza Baldissera con obbligo di svolta a destra su corso Principe Oddone.",
    latitude: 45.0918,
    longitude: 7.66297,
    status: "red",
  },
  {
    id: "667938",
    title: "13/11 CHIUSURA IN SOTTOPASSO MORTARA",
    shortDescription: "Giovedì 13 novembre dalle 9:30 alle 16:30, per lavori del Comune di Torino, è prevista la chiusura del sottopasso Mortara in direzione via Orvieto.",
    fullDescription: "Giovedì 13 novembre dalle 9:30 alle 16:30, per lavori del Comune di Torino, è prevista la chiusura del sottopasso Mortara in direzione via Orvieto.",
    latitude: 45.0918,
    longitude: 7.66297,
    status: "red",
  },
  {
    id: "668636",
    title: "13/11 CHIUSURA SOTTOPASSO REPUBBLICA",
    shortDescription: "Dalle 23:30 di giovedì 13 alle 1:30 di venerdì 14 novembre divieto di transito nel sottopasso Repubblica per pulizia meccanizzata.",
    fullDescription: "Dalle 23:30 di giovedì 13 alle 1:30 di venerdì 14 novembre divieto di transito nel sottopasso Repubblica per pulizia meccanizzata.",
    latitude: 45.0766,
    longitude: 7.68376,
    status: "red",
  },
  {
    id: "668635",
    title: "14/11 CHIUSURA SOTTOPASSO LANZA",
    shortDescription: "Venerdì 14 novembre dalle 2:30 alle 4:30 divieto di transito nel sottopasso Lanza per pulizia meccanizzata.",
    fullDescription: "Venerdì 14 novembre dalle 2:30 alle 4:30 divieto di transito nel sottopasso Lanza per pulizia meccanizzata.",
    latitude: 45.036,
    longitude: 7.67645,
    status: "red",
  },
  {
    id: "668465",
    title: "LAVORI AL PARCO DEL VALENTINO",
    shortDescription: "Per lavori all'interno del parco del Valentino sono previste chiusure viabili.",
    fullDescription: "Per lavori all'interno del parco del Valentino sono previste chiusure viabili. Da lunedì 10 novembre 2025 a domenica 1 marzo 2026 è prevista la chiusura diviale Turr tra viale Boiardo e via Millio. Fino a domenica 1 marzo 2026 sono previste chiusure in: - viale Stefano Turr tra viale Boiardo e viale Marinai d'Italia - viale Boiardo tra via Turr e viale Marinai d'Italia - viale Marinai d'Italia tra viale Boiardo e viale Turr - viale Millio tra viale Turr e l'ingresso al Borgo Medievale",
    latitude: 45.0501,
    longitude: 7.68233,
    status: "red",
  },
  {
    id: "661425",
    title: "PEDONALIZZAZIONE DI VIA ROMA",
    shortDescription: "Fino a venerdì 8 november, per lavori del Comune di Torino, sono previste chiusure in: - piazza CLN tra via Giolitti e via Rossi - piazza CLN tra via Rossi e via Amendola - piazza CLN tra via Alfieri e via Frola - via Roma tra piazza CLN e via Cavour - via Roma da piazza San Carlo a via Monte di Pietà - via Viotti da via Bertola a via Monte di Pietà - via Bertola da via XX Settembre a via Viott - via Frola tra via XX Settembre e via piazza CLN - via Principe Amedeo da via Duse a via Roma - piazza Carlo Felice tra piazza Lagrange e piazza Paleocapa",
    fullDescription: "Fino a venerdì 8 november, per lavori del Comune di Torino, sono previste chiusure in: - piazza CLN tra via Giolitti e via Rossi - piazza CLN tra via Rossi e via Amendola - piazza CLN tra via Alfieri e via Frola - via Roma tra piazza CLN e via Cavour - via Roma da piazza San Carlo a via Monte di Pietà - via Viotti da via Bertola a via Monte di Pietà - via Bertola da via XX Settembre a via Viott - via Frola tra via XX Settembre e via piazza CLN - via Principe Amedeo da via Duse a via Roma - piazza Carlo Felice tra piazza Lagrange e piazza Paleocapa. Fino a sabato 31 Januari 2026 è, inoltre, prevista la chiusura di via Roma tra via Cavour e via Buozzi. I dettagli sul Comunicato Stampa del Comune di Torino",
    latitude: 45.0665,
    longitude: 7.6817,
    status: "red",
  },
];

export const fetchTrafficModifications = async (): Promise<TrafficModification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.info("Simulating fetch of traffic modifications data...");
      resolve(mockTrafficModifications);
    }, 1000); // Simulate network delay
  });
};