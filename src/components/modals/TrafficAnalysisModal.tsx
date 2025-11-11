"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Car, Clock, MapPin, Gauge } from 'lucide-react';

interface TrafficAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrafficAnalysisModal: React.FC<TrafficAnalysisModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Car className="mr-2 h-5 w-5" /> Analisis Lalu Lintas
          </DialogTitle>
          <DialogDescription>
            Berikut adalah beberapa insight lalu lintas simulasi untuk Kota Torino:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-gray-700 overflow-y-auto flex-1">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-indigo-600" />
            <strong>Jam Tersibuk:</strong> 07.00–09.00 (Pagi) & 17.00–19.00 (Sore)
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-red-600" />
            <strong>Area Paling Padat:</strong> Via Roma, Piazza Castello, Corso Vittorio Emanuele II
          </div>
          <div className="flex items-center">
            <Gauge className="mr-2 h-5 w-5 text-green-600" />
            <strong>Kecepatan Rata-rata:</strong> 24 km/jam
          </div>
          <p className="text-sm text-gray-500 mt-2">
            *Ini adalah data simulasi. Analisis sebenarnya akan dihasilkan oleh sistem Python.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrafficAnalysisModal;