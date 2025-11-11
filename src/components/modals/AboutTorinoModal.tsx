"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Building2 } from 'lucide-react';

interface AboutTorinoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutTorinoModal: React.FC<AboutTorinoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" /> Tentang Kota Torino
          </DialogTitle>
          <DialogDescription>
            Informasi singkat mengenai Kota Torino, Italia.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-gray-700">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mole_Antonelliana_Torino.jpg/800px-Mole_Antonelliana_Torino.jpg"
            alt="Mole Antonelliana, Torino"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <p>
            Torino adalah kota besar di Italia utara, ibu kota wilayah Piedmont. Dikenal sebagai pusat budaya dan bisnis, kota ini memiliki sejarah yang kaya dan arsitektur yang indah.
          </p>
          <div className="flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-blue-600" />
            <strong>Populasi:</strong> Sekitar 870.000 jiwa (area metropolitan lebih dari 2 juta)
          </div>
          <div className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-600" />
            <strong>Luas Wilayah:</strong> Sekitar 130 km²
          </div>
          <p className="mt-2">
            Efisiensi lalu lintas sangat penting bagi Torino untuk mendukung pertumbuhan ekonomi dan kualitas hidup penduduknya. Proyek ini bertujuan untuk membantu mencapai tujuan tersebut.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AboutTorinoModal;