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
          Budaya, Kuliner & Pariwisata Torino
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Palette className="h-5 w-5 mr-2 text-blue-600" />
              Kegiatan Budaya & Arsitektur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Torino adalah kota yang kaya akan warisan budaya, dengan arsitektur Barok yang mendominasi pusat kota. Jelajahi istana-istana megah, museum kelas dunia, dan festival seni yang semarak.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="font-medium">Mole Antonelliana:</strong> Simbol kota, kini menjadi Museum Nasional Sinema.</li>
              <li><strong className="font-medium">Musei Reali:</strong> Kompleks museum yang mencakup Istana Kerajaan, Armory, dan Galeri Sabauda.</li>
              <li><strong className="font-medium">Museo Egizio (Museum Mesir):</strong> Salah satu koleksi Mesir kuno terbesar di dunia di luar Kairo.</li>
              <li><strong className="font-medium">Festival Jazz Torino:</strong> Acara tahunan yang menarik musisi dan penggemar jazz dari seluruh dunia.</li>
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
              Kuliner Khas Torino
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Torino adalah surga bagi pecinta kuliner, terutama bagi mereka yang menyukai cokelat dan tradisi aperitivo.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="font-medium">Cokelat:</strong> Kota ini terkenal dengan gianduiotto, cokelat hazelnut yang lezat, dan bicerin, minuman kopi, cokelat, dan krim.</li>
              <li><strong className="font-medium">Kafe Bersejarah:</strong> Nikmati suasana klasik di kafe-kafe seperti Caffè Al Bicerin atau Caffè Fiorio.</li>
              <li><strong className="font-medium">Aperitivo Piemonte:</strong> Tradisi minum sebelum makan malam dengan hidangan pembuka lokal.</li>
              <li><strong className="font-medium">Pasta Agnolotti:</strong> Pasta isi khas Piemonte yang wajib dicoba.</li>
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
              Tempat Wisata & Landmark Utama
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Selain museum, Torino menawarkan berbagai tempat wisata ikonik yang patut dikunjungi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Piazza Castello</h3>
                <p>Alun-alun utama kota yang dikelilingi oleh bangunan-bangunan penting seperti Palazzo Reale dan Palazzo Madama.</p>
                <img
                  src="https://images.unsplash.com/photo-1590664239601-3111d11177d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Piazza Castello"
                  className="w-full h-40 object-cover rounded-md shadow-md mt-2"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Parco del Valentino</h3>
                <p>Taman kota yang luas di tepi Sungai Po, dengan kastil abad pertengahan dan kebun raya.</p>
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