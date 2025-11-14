"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Import Alert components
import { AlertTriangle } from 'lucide-react';

// Define validation schema using Zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Nama lengkap harus memiliki setidaknya 2 karakter." }).max(100, { message: "Nama lengkap tidak boleh lebih dari 100 karakter." }),
  email: z.string().email({ message: "Alamat email tidak valid." }),
  subject: z.string().min(5, { message: "Subjek harus memiliki setidaknya 5 karakter." }).max(200, { message: "Subjek tidak boleh lebih dari 200 karakter." }),
  message: z.string().min(10, { message: "Pesan harus memiliki setidaknya 10 karakter." }).max(1000, { message: "Pesan tidak boleh lebih dari 1000 karakter." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactCollaborationPage: React.FC = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log('Form submitted with data:', data);
    alert('Pesan Anda telah terkirim! Kami akan menghubungi Anda segera.');
    form.reset(); // Reset form after successful submission
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
              Kami ingin mendengar dari Anda! Gunakan formulir di bawah ini untuk pertanyaan umum, umpan balik, atau dukungan.
            </p>
            {/* Security Warning */}
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Peringatan Keamanan (Validasi Input)</AlertTitle>
              <AlertDescription>
                Validasi sisi klien telah ditambahkan untuk pengalaman pengguna yang lebih baik.
                Namun, **validasi dan sanitasi sisi server yang kuat sangat penting**
                untuk mencegah serangan injeksi (misalnya, XSS, injeksi header email)
                saat data formulir ini dikirim ke backend.
              </AlertDescription>
            </Alert>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Anda"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="subject">Subjek</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Subjek pesan Anda"
                  {...form.register("subject")}
                />
                {form.formState.errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.subject.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="message">Pesan</Label>
                <Textarea
                  id="message"
                  placeholder="Tulis pesan Anda di sini..."
                  rows={5}
                  {...form.register("message")}
                />
                {form.formState.errors.message && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">Kirim Pesan</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Kolaborasi & Data Terbuka
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <p>
              Kami percaya pada kekuatan kolaborasi dan data terbuka untuk meningkatkan mobilitas perkotaan. Jika Anda seorang peneliti, pengembang, atau organisasi dengan data mobilitas atau ide-ide inovatif, kami ingin bekerja sama dengan Anda!
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
                Alamat: Via Roma 1, 10121 Torino, Italy
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Sumber Daya & Kemitraan:</h3>
              <p>
                Kami terbuka untuk kemitraan dengan lembaga pemerintah, universitas, dan perusahaan teknologi. Kunjungi portal data terbuka kami (jika tersedia) atau hubungi kami untuk membahas potensi kolaborasi.
              </p>
              <Button variant="outline" className="w-full">
                <Link to="#" className="flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  Lihat Mitra Kami
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