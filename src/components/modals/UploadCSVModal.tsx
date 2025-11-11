"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface UploadCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file (dummy):", selectedFile.name);
      // In a real application, you would handle the file upload here.
      // For this frontend-only app, we just simulate it.
      alert(`File '${selectedFile.name}' dipilih. Data akan diproses oleh sistem Python.`);
      onClose();
    } else {
      alert("Pilih file CSV terlebih dahulu.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" /> Upload CSV Data
          </DialogTitle>
          <DialogDescription>
            Pilih file CSV yang berisi data lalu lintas untuk dianalisis.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="csvFile" className="text-right">
              File CSV
            </Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              className="col-span-3"
              onChange={handleFileChange}
            />
          </div>
          {selectedFile && (
            <p className="text-sm text-gray-600 text-center">File dipilih: <span className="font-medium">{selectedFile.name}</span></p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleUpload} disabled={!selectedFile}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadCSVModal;