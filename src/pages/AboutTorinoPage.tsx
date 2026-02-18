"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import the new tabbed component
import AboutTorinoTabs from '@/components/AboutTorinoTabs';

const AboutTorinoPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Info className="h-8 w-8 mr-3 text-indigo-600" />
          About the City of Torino
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full space-y-8">
        {/* Hero Section */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Torino, Jewel of Northern Italy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <img
              src={`${import.meta.env.BASE_URL}GAMBAR/12.jpg`}
              alt="Mole Antonelliana, Torino"
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Torino is a major city in northern Italy, the capital of the Piedmont region. Located on the western bank of the Po River, the city is surrounded by the Alps to the west and north, offering stunning views. Torino is known as an important cultural and business center, with a rich history and beautiful Baroque architecture.
            </p>
          </CardContent>
        </Card>

        {/* Render the new tabbed content */}
        <AboutTorinoTabs />
      </main>
    </div>
  );
};

export default AboutTorinoPage;