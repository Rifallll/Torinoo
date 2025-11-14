"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { useTrafficData, TrafficDataRow } from '@/contexts/TrafficDataContext'; // Import TrafficDataRow

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
      toast.info(`Uploading and starting simulated analysis for file '${selectedFile.name}'...`);
      
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically convert numbers, booleans, etc.
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("CSV parsing errors:", results.errors);
            toast.error(`Failed to parse CSV: ${results.errors[0].message}`);
            setSelectedFile(null);
            return;
          }
          
          // Type assertion here, assuming the CSV structure matches TrafficDataRow
          const parsedData = results.data as TrafficDataRow[]; 
          uploadData(parsedData); // Pass parsed data to context
          toast.success(`File '${selectedFile.name}' uploaded successfully and analysis started.`);
          onClose();
          setSelectedFile(null); // Clear selected file after upload
        },
        error: (error: Error) => {
          console.error("Error parsing CSV:", error);
          toast.error(`An error occurred while parsing the file: ${error.message}`);
          setSelectedFile(null);
        }
      });
    } else {
      toast.warning("Please select a CSV file first.");
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
              <Upload className="mr-2 h-5 w-5" /> Upload CSV Data
            </span>
          </DialogTitle>
          <DialogDescription>
            Select a CSV file containing traffic data for analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="csvFile" className="text-right">
              CSV File
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
            <p className="text-sm text-gray-600 text-center">Selected file: <span className="font-medium">{selectedFile.name}</span></p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleUpload} disabled={!selectedFile}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadCSVModal;