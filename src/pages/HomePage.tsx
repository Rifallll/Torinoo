"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Hero Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
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

      {/* Footer/Credit (optional) */}
      <div className="absolute bottom-4 text-gray-300 text-sm z-10">
        Photo by <a href="https://unsplash.com/@alessandro_c" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Alessandro Capuzzi</a> on Unsplash
      </div>
    </div>
  );
};

export default HomePage;