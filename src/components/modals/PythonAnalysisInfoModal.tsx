"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';

interface PythonAnalysisInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PythonAnalysisInfoModal: React.FC<PythonAnalysisInfoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BarChart2 className="mr-2 h-5 w-5" /> Lihat & Sinkronisasi Data
          </DialogTitle>
          <DialogDescription>
            Analisis data lalu lintas Anda akan dilakukan secara terpisah menggunakan sistem Python.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-gray-700">
          <p className="mb-2">
            Data CSV yang Anda unggah akan diproses di backend Python untuk menghasilkan insight lalu lintas yang mendalam, seperti pola kemacetan, kecepatan rata-rata, dan prediksi arus.
          </p>
          <p>
            Setelah analisis selesai, hasilnya dapat disinkronkan kembali ke antarmuka ini untuk visualisasi yang lebih kaya.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PythonAnalysisInfoModal;