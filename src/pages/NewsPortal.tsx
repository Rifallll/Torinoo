"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNewsApi } from '@/hooks/useNewsApi'; // Import the new hook

const NewsPortal = () => {
  // Fetch news related to "Torino traffic" in English
  const { data: newsArticles, isLoading, error } = useNewsApi("Torino traffic", "en");

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 items-center justify-center">
        <Newspaper className="h-12 w-12 mr-3 text-indigo-600 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Memuat Berita Terbaru...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Newspaper className="h-8 w-8 mr-3 text-indigo-600" />
            Portal Berita Lalu Lintas
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-red-500 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-500 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Kesalahan Memuat Berita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Gagal memuat artikel berita: {error.message}</p>
              <p className="text-sm text-gray-500">Pastikan kunci API NewsAPI Anda benar dan koneksi internet stabil.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!newsArticles || newsArticles.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Newspaper className="h-8 w-8 mr-3 text-indigo-600" />
            Portal Berita Lalu Lintas
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Newspaper className="h-5 w-5 mr-2 text-indigo-600" />
                Tidak Ada Berita Tersedia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Tidak ada artikel berita yang dapat dimuat saat ini.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Newspaper className="h-8 w-8 mr-3 text-indigo-600" />
          Portal Berita Lalu Lintas
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {newsArticles.map(article => (
          <Card key={article.url} className="overflow-hidden flex flex-col">
            <img
              src={article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{article.title}</CardTitle>
              <p className="text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-gray-700 mb-4">{article.description || article.content || 'Tidak ada deskripsi tersedia.'}</p>
              <Button variant="link" className="p-0 h-auto justify-start" asChild>
                <a href={article.url} target="_blank" rel="noopener noreferrer">Baca Selengkapnya</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default NewsPortal;