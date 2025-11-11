"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, Building2, Users, MapPin, History, Coffee, Car, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutTorinoPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Info className="h-8 w-8 mr-3 text-indigo-600" />
          Tentang Kota Torino
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full">
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Torino, Permata Italia Utara</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mole_Antonelliana_Torino.jpg/1280px-Mole_Antonelliana_Torino.jpg"
              alt="Mole Antonelliana, Torino"
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Torino adalah kota besar di Italia utara, ibu kota wilayah Piedmont. Terletak di tepi barat Sungai Po, kota ini dikelilingi oleh pegunungan Alpen di barat dan utara, menawarkan pemandangan yang menakjubkan. Torino dikenal sebagai pusat budaya dan bisnis yang penting, dengan sejarah yang kaya dan arsitektur Barok yang indah.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <MapPin className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">Letak Geografis:</strong>
                  <span className="text-sm">Piemonte, Italia Utara, di tepi Sungai Po, dikelilingi Pegunungan Alpen.</span>
                </div>
              </div>
              <div className="flex items-center">
                <History className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">Sejarah Singkat:</strong>
                  <span className="text-sm">Berawal dari bangsa Taurini, kemudian Romawi, pernah menjadi ibu kota Italia.</span>
                </div>
              </div>
              <div className="flex items-center">
                <Building2 className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">Karakter Khas Kota:</strong>
                  <span className="text-sm">Gaya Barok, arsitektur megah, budaya kafe, industri otomotif, cokelat terkenal.</span>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">Populasi:</strong>
                  <span className="text-sm">Sekitar 870.000 jiwa (area metropolitan lebih dari 2 juta).</span>
                </div>
              </div>
              <div className="flex items-center">
                <Factory className="mr-3 h-6 w-6 text-blue-600" />
                <div>
                  <strong className="block text-md">Ekonomi Utama:</strong>
                  <span className="text-sm">Industri (otomotif), pariwisata, riset, dan teknologi.</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Efisiensi lalu lintas sangat penting bagi Torino untuk mendukung pertumbuhan ekonomi dan kualitas hidup penduduknya. Dengan sistem manajemen lalu lintas yang cerdas, kota ini dapat mengurangi kemacetan, meningkatkan keamanan jalan, dan mempromosikan mobilitas yang berkelanjutan. Proyek ini bertujuan untuk membantu mencapai tujuan tersebut dengan menyediakan alat analisis dan visualisasi yang canggih.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutTorinoPage;