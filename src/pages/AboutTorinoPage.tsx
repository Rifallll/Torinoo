"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, Building2, Users, MapPin, History, Coffee, Car, Factory, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

      <main className="flex-1 max-w-4xl mx-auto w-full">
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Torino, Jewel of Northern Italy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mole_Antonelliana_Torino.jpg/1280px-Mole_Antonelliana_Torino.jpg"
              alt="Mole Antonelliana, Torino"
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Torino is a major city in northern Italy, the capital of the Piedmont region. Located on the western bank of the Po River, the city is surrounded by the Alps to the west and north, offering stunning views. Torino is known as an important cultural and business center, with a rich history and beautiful Baroque architecture.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <MapPin className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">Geographical Location:</strong>
                  <span className="text-sm">Piedmont, Northern Italy, on the Po River, surrounded by the Alps.</span>
                </div>
              </div>
              <div className="flex items-center">
                <History className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">Brief History:</strong>
                  <span className="text-sm">Originated from the Taurini people, then Roman, once the capital of Italy.</span>
                </div>
              </div>
              <div className="flex items-center">
                <Building2 className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">City Characteristics:</strong>
                  <span className="text-sm">Baroque style, magnificent architecture, cafe culture, automotive industry, famous chocolate.</span>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">Population:</strong>
                  <span className="text-sm">Around 870,000 inhabitants (metropolitan area over 2 million).</span>
                </div>
              </div>
              <div className="flex items-center">
                <Factory className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">Main Economy:</strong>
                  <span className="text-sm">Industry (automotive), tourism, research, and technology.</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Traffic efficiency is crucial for Torino to support economic growth and the quality of life for its residents. With a smart traffic management system, the city can reduce congestion, improve road safety, and promote sustainable mobility. This project aims to help achieve these goals by providing advanced analysis and visualization tools.
            </p>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Explore Further</h3>
              <Button asChild className="w-full md:w-auto">
                <Link to="/culture-tourism" className="flex items-center justify-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Culture, Cuisine & Tourism
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutTorinoPage;