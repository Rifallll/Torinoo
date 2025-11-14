"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { useTrafficData } from '@/contexts/TrafficDataContext'; // Import the new hook

interface UploadCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadData, resetAnalysis } = useTrafficData();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      toast.info(`Mengunggah dan memulai analisis simulasi untuk file '${selectedFile.name}'...`);
      
      // IMPORTANT: In a real application, this file upload would be sent to a backend
      // for secure processing, including robust server-side validation and sanitization
      // of the CSV content to prevent various attacks (e.g., injection, DoS).
      toast.warning("Penting: Pastikan Anda menerapkan validasi dan sanitasi sisi server yang kuat untuk file CSV yang diunggah!");

      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("CSV parsing errors:", results.errors);
            toast.error(`Gagal mengurai CSV: ${results.errors[0].message}`);
            setSelectedFile(null);
            return;
          }
          
          const parsedData = results.data as { [key: string]: string | number }[];
          uploadData(parsedData); // Pass parsed data to context
          toast.success(`File '${selectedFile.name}' berhasil diunggah dan analisis dimulai.`);
          onClose();
          setSelectedFile(null); // Clear selected file after upload
        },
        error: (error: Error) => {
          console.error("Error parsing CSV:", error);
          toast.error(`Terjadi kesalahan saat mengurai file: ${error.message}`);
          setSelectedFile(null);
        }
      });
    } else {
      toast.warning("Harap pilih file CSV terlebih dahulu.");
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="flex items-center">
              <Upload className="mr-2 h-5 w-5" /> Unggah Data CSV
            </span>
          </DialogTitle>
          <DialogDescription>
            Pilih file CSV yang berisi data lalu lintas untuk analisis.
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
          <Button variant="outline" onClick={handleCancel}>Batal</Button>
          <Button onClick={handleUpload} disabled={!selectedFile}>Unggah</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadCSVModal;