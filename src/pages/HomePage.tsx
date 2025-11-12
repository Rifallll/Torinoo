"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const backgroundImages = [
  '/GAMBAR/1.jpg',
  '/GAMBAR/2.jpg',
  '/GAMBAR/3.jpg',
];

const HomePage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 30000); // Ganti gambar setiap 30 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Hero Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url('${backgroundImages[currentImageIndex]}')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-white p-4 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          Torino – Industrial & Cultural City at the Foot of the Alps
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Explore the heart of Piedmont, Northern Italy. Torino is a perfect blend of Roman history, magnificent Baroque architecture, automotive industry innovation, and delicious chocolate cuisine.
        </p>
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <Link to="/torino-dashboard" className="flex items-center">
            Explore Dashboard
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Kredit foto telah dihapus */}
    </div>
  );
};

export default HomePage;