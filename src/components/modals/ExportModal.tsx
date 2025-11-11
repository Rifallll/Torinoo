"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState<string>('csv');

  const handleExport = () => {
    console.log(`Simulating export to ${exportFormat} format.`);
    alert(`Tampilan atau data simulasi akan diekspor ke format ${exportFormat.toUpperCase()}.`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="flex items-center"> {/* Wrapped icon and text in a span */}
              <Download className="mr-2 h-5 w-5" /> Ekspor Data
            </span>
          </DialogTitle>
          <DialogDescription>
            Pilih format untuk mengekspor tampilan peta atau data simulasi.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exportFormat" className="text-right">
              Format
            </Label>
            <Select onValueChange={setExportFormat} defaultValue={exportFormat}>
              <SelectTrigger id="exportFormat" className="col-span-3">
                <SelectValue placeholder="Pilih format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="png">PNG (Tampilan Peta)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleExport}>Ekspor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;