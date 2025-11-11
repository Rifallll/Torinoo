"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ContactCollaborationPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
    // In a real application, you would send this data to a backend.
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Mail className="h-8 w-8 mr-3 text-indigo-600" />
          Kontak & Kolaborasi
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
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Hubungi Kami
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300">
              Kami senang mendengar dari Anda! Gunakan formulir di bawah ini untuk pertanyaan umum, umpan balik, atau dukungan.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" type="text" placeholder="Nama Anda" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" required />
              </div>
              <div>
                <Label htmlFor="subject">Subjek</Label>
                <Input id="subject" type="text" placeholder="Subjek pesan Anda" required />
              </div>
              <div>
                <Label htmlFor="message">Pesan</Label>
                <Textarea id="message" placeholder="Tulis pesan Anda di sini..." rows={5} required />
              </div>
              <Button type="submit" className="w-full">Kirim Pesan</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Kolaborasi & Open Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <p>
              Kami percaya pada kekuatan kolaborasi dan data terbuka untuk meningkatkan mobilitas kota. Jika Anda adalah peneliti, pengembang, atau organisasi yang memiliki data mobilitas atau ide inovatif, kami ingin bekerja sama!
            </p>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Informasi Kontak Langsung:</h3>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                Email: <a href="mailto:info@torinotraffic.com" className="ml-2 text-blue-600 hover:underline">info@torinotraffic.com</a>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                Telepon: <a href="tel:+390111234567" className="ml-2 text-blue-600 hover:underline">+39 011 1234 567</a>
              </p>
              <p className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                Alamat: Via Roma 1, 10121 Torino, Italia
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Sumber Daya & Kemitraan:</h3>
              <p>
                Kami terbuka untuk kemitraan dengan lembaga pemerintah, universitas, dan perusahaan teknologi. Kunjungi portal data terbuka kami (jika ada) atau hubungi kami untuk mendiskusikan potensi kolaborasi.
              </p>
              <Button variant="outline" className="w-full">
                <Link to="#" className="flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  Lihat Partner Kami
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ContactCollaborationPage;