"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react'; // Renamed Palette to ImageIcon for clarity

const visualGalleryImages = [
  { src: "https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Piazza Castello, Torino" },
  { src: "https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Mole Antonelliana, Torino" },
  { src: "https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Po River, Torino" },
  { src: "https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Egyptian Museum, Torino" },
];

interface VisualGallerySectionProps {
  id?: string;
}

const VisualGallerySection: React.FC<VisualGallerySectionProps> = ({ id }) => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 lg:col-span-2 shadow-lg rounded-lg" id={id}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <ImageIcon className="h-5 w-5 mr-2 text-teal-600" /> Visual Gallery
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Explore the beauty of Torino through these captivating images. Click on an image to view it in more detail.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visualGalleryImages.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-700 group cursor-pointer">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 p-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-medium">
                {image.alt}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualGallerySection;