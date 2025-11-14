"use client";

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowLeft, Search, XCircle, AlertCircle } from 'lucide-react'; // Filter icon removed
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Select, SelectContent, SelectItem, SelectTrigger, SelectValue removed
import { useCombinedNews } from '@/hooks/useCombinedNews';

const NewsPortal = () => {
  const [searchTerm, setSearchTerm] = useState<string>('Torino AND (traffic OR incident)');
  // currentQuery state removed, use searchTerm directly for the hook
  const fixedLanguage = 'en'; // Fixed language to English

  // Fetch news based on searchTerm and fixedLanguage
  const { data: newsArticles, isLoading, error } = useCombinedNews(searchTerm, fixedLanguage);

  // handleSearch function removed as search is now live

  const handleResetFilters = () => {
    setSearchTerm('Torino AND (traffic OR incident)');
    // Language is now fixed, no need to reset it here
  };

  // availableLanguages memo removed as language filter is removed

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 items-center justify-center">
        <Newspaper className="h-12 w-12 mr-3 text-indigo-600 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Loading Latest News...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Newspaper className="h-8 w-8 mr-3 text-indigo-600" />
            Traffic News Portal
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-red-500 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-500 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Error Loading News
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>Failed to load news articles: {error.message}</p>
              <p className="text-sm text-gray-500">Please ensure your NewsAPI and GNews.io API keys are correct and internet connection is stable.</p>
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
          Traffic News Portal
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <div className="mb-6 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search news (e.g., 'Torino traffic', 'congestion')..."
              className="pl-9 pr-8 w-full h-10 text-base border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // onKeyPress removed as search is now live
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

          {/* Language Select dropdown removed */}

          {/* Search button removed as search is now live */}

          {searchTerm !== 'Torino AND (traffic OR incident)' && ( // Condition adjusted
            <Button variant="outline" onClick={handleResetFilters} className="flex items-center h-10 px-4 py-2 text-base">
              <XCircle className="h-4 w-4 mr-2" />
              Reset Filters
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
                <p className="text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-gray-700 mb-4">{article.description || article.content || 'No description available.'}</p>
                <Button variant="link" className="p-0 h-auto justify-start" asChild>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">No news articles could be loaded at this time.</p>
        )}
      </main>
    </div>
  );
};

export default NewsPortal;