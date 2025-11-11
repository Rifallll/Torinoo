"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';

const visualGallery = [
  "Mole Antonelliana – city's main icon",
  "Piazza San Carlo",
  "Parco del Valentino",
  "Po River in the evening",
  "Museo Egizio",
  "Torino night view from Superga",
];

const VisualGallerySection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Palette className="h-5 w-5 mr-2 text-teal-600" /> Visual Gallery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Here are some visual highlights of Torino. (Image integration would go here)
        </p>
        <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700 dark:text-gray-300">
          {visualGallery.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default VisualGallerySection;