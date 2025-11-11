"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, Utensils, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CultureTourismPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Palette className="h-8 w-8 mr-3 text-indigo-600" />
          Torino Culture, Cuisine & Tourism
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Palette className="h-5 w-5 mr-2 text-blue-600" />
              Cultural Activities & Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Torino is a city rich in cultural heritage, with Baroque architecture dominating the city center. Explore magnificent palaces, world-class museums, and vibrant art festivals.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="font-medium">Mole Antonelliana:</strong> The symbol of the city, now home to the National Museum of Cinema.</li>
              <li><strong className="font-medium">Musei Reali:</strong> A museum complex including the Royal Palace, Armory, and Sabauda Gallery.</li>
              <li><strong className="font-medium">Museo Egizio (Egyptian Museum):</strong> One of the largest collections of ancient Egypt outside Cairo.</li>
              <li><strong className="font-medium">Torino Jazz Festival:</strong> An annual event attracting musicians and jazz enthusiasts from around the world.</li>
            </ul>
            <img
              src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Mole Antonelliana interior"
              className="w-full h-48 object-cover rounded-md shadow-md mt-4"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Utensils className="h-5 w-5 mr-2 text-green-600" />
              Torino's Signature Cuisine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Torino is a paradise for food lovers, especially for those who enjoy chocolate and the aperitivo tradition.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="font-medium">Chocolate:</strong> The city is famous for gianduiotto, delicious hazelnut chocolate, and bicerin, a coffee, chocolate, and cream drink.</li>
              <li><strong className="font-medium">Historic Cafes:</strong> Enjoy the classic atmosphere in cafes like Caffè Al Bicerin or Caffè Fiorio.</li>
              <li><strong className="font-medium">Piedmontese Aperitivo:</strong> A pre-dinner drink tradition with local appetizers.</li>
              <li><strong className="font-medium">Agnolotti Pasta:</strong> A must-try traditional Piedmontese stuffed pasta.</li>
            </ul>
            <img
              src="https://images.unsplash.com/photo-1575936123201-e85230447270?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Italian food"
              className="w-full h-48 object-cover rounded-md shadow-md mt-4"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Landmark className="h-5 w-5 mr-2 text-purple-600" />
              Main Tourist Attractions & Landmarks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              In addition to museums, Torino offers various iconic tourist attractions worth visiting.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Piazza Castello</h3>
                <p>The city's main square surrounded by important buildings such as Palazzo Reale and Palazzo Madama.</p>
                <img
                  src="https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Piazza Castello"
                  className="w-full h-40 object-cover rounded-md shadow-md mt-2"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Parco del Valentino</h3>
                <p>A large city park on the banks of the Po River, with a medieval castle and botanical gardens.</p>
                <img
                  src="https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Parco del Valentino"
                  className="w-full h-40 object-cover rounded-md shadow-md mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CultureTourismPage;