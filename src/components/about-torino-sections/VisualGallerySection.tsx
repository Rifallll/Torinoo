"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';

const visualGalleryImages = [
  { src: "https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Piazza Castello, Torino" },
  { src: "https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Mole Antonelliana, Torino" },
  { src: "https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Po River, Torino" },
  { src: "https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Egyptian Museum, Torino" },
];

const VisualGallerySection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Palette className="h-5 w-5 mr-2 text-teal-600" /> Visual Gallery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Explore the beauty of Torino through these captivating images.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visualGalleryImages.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-md shadow-md">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 p-2">{image.alt}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualGallerySection;