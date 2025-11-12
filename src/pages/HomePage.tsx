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
  const [isFading, setIsFading] = useState(false); // State untuk mengontrol transisi fade

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true); // Mulai fade out gambar saat ini dan fade in gambar berikutnya

      // Setelah durasi transisi (1 detik), perbarui gambar dan reset state fade
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setIsFading(false); // Selesai fade, gambar baru sekarang sepenuhnya terlihat
      }, 1000); // Durasi transisi (harus cocok dengan 'duration-1000' di Tailwind)

    }, 30000); // Total siklus: 30 detik (29 detik terlihat, 1 detik transisi)

    return () => clearInterval(interval);
  }, []);

  // Tentukan gambar saat ini dan gambar berikutnya untuk transisi
  const currentBg = backgroundImages[currentImageIndex];
  const nextImageIndex = (currentImageIndex + 1) % backgroundImages.length;
  const nextBg = backgroundImages[nextImageIndex];

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Lapisan Gambar Latar Belakang */}
      {/* Gambar yang sedang aktif dan akan memudar */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url('${currentBg}')` }}
      ></div>
      {/* Gambar berikutnya yang akan memudar masuk */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          isFading ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url('${nextBg}')` }}
      ></div>

      {/* Overlay Hitam */}
      <div className="absolute inset-0 bg-black opacity-50 z-20"></div>

      {/* Konten Halaman */}
      <div className="relative z-30 text-white p-4 md:p-8 max-w-4xl mx-auto">
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
    </div>
  );
};

export default HomePage;