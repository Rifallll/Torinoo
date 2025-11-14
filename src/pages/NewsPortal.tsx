"use client";

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowLeft, Search, XCircle, Filter, AlertCircle } from 'lucide-react'; // Import AlertCircle
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCombinedNews } from '@/hooks/useCombinedNews'; // Import the new hook

const NewsPortal = () => {
  const [searchTerm, setSearchTerm] = useState<string>('Torino AND (traffico OR incidente)'); // Updated default search term
  const [selectedLanguage, setSelectedLanguage] = useState<string>('it'); // Updated default language to Italian
  const [currentQuery, setCurrentQuery] = useState<string>('Torino AND (traffico OR incidente)'); // Updated default query
  const [currentLanguage, setCurrentLanguage] = useState<string>('it'); // Updated default language

  // Fetch news based on currentQuery and currentLanguage
  const { data: newsArticles, isLoading, error } = useCombinedNews(currentQuery, currentLanguage);

  const handleSearch = () => {
    setCurrentQuery(searchTerm);
    setCurrentLanguage(selectedLanguage);
  };

  const handleResetFilters = () => {
    setSearchTerm('Torino AND (traffico OR incidente)');
    setSelectedLanguage('it');
    setCurrentQuery('Torino AND (traffico OR incidente)');
    setCurrentLanguage('it');
  };

  const availableLanguages = useMemo(() => [
    { code: 'ar', name: 'Arabic' },
    { code: 'de', name: 'German' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'he', name: 'Hebrew' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'no', name: 'Norwegian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'sv', name: 'Swedish' },
    { code: 'ud', name: 'Urdu' },
    { code: 'zh', name: 'Chinese' },
  ], []);

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
              <p className="text-sm text-gray-500">Pastikan kunci API NewsAPI dan GNews.io Anda benar dan koneksi internet stabil.</p>
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

      <div className="mb-6 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari berita (mis. 'Torino traffic', 'kemacetan')..."
              className="pl-9 pr-8 w-full h-10 text-base border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:bg-transparent"
                onClick={() => setSearchTerm('')}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 text-base border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Pilih Bahasa" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:text-gray-200">
              {availableLanguages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} className="flex items-center h-10 px-4 py-2 text-base">
            <Search className="h-4 w-4 mr-2" />
            Cari
          </Button>

          {(searchTerm !== 'Torino AND (traffico OR incidente)' || selectedLanguage !== 'it') && (
            <Button variant="outline" onClick={handleResetFilters} className="flex items-center h-10 px-4 py-2 text-base">
              <XCircle className="h-4 w-4 mr-2" />
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {newsArticles && newsArticles.length > 0 ? (
          newsArticles.map(article => (
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
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">Tidak ada artikel berita yang dapat dimuat saat ini.</p>
        )}
      </main>
    </div>
  );
};

export default NewsPortal;