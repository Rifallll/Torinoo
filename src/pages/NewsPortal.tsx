"use client";

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowLeft, Search, XCircle, AlertCircle } from 'lucide-react'; // Filter icon removed
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Select, SelectContent, SelectItem, SelectTrigger, SelectValue removed
// Fetch real-time traffic news from Supabase (scraped from Official sources)
import { useSupabaseTraffic, SupabaseTrafficChange } from '@/hooks/useSupabaseTraffic';

const NewsPortal = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { trafficChanges, isLoading, error } = useSupabaseTraffic();

  // Filter news based on search term (Local search)
  const filteredNews = useMemo(() => {
    if (!trafficChanges) return [];
    if (!searchTerm) return trafficChanges;

    const lowerTerm = searchTerm.toLowerCase();

    // 1. Filter by Search Term & Strict Link Requirement
    const matches = trafficChanges.filter(item =>
      (item.description?.includes('LINK:') ?? false) &&
      // Aggressive Exclusion
      !item.type?.toLowerCase().includes('public_transport') && // Exclude Type
      !item.type?.toLowerCase().includes('debug') && // Exclude Type
      !item.responsible_entity?.toLowerCase().includes('gtt') && // Exclude Entity
      !item.responsible_entity?.toLowerCase().includes('debug') && // Exclude Entity
      !item.title.toUpperCase().includes('GTT') && // Exclude Title
      !(item.description || '').includes('Public Transport Alert') && // Exclude specific GTT phrase
      !(item.description || '').includes('GTT') && // Exclude GTT in desc (Aggressive)
      // Standard Search
      (item.title.toLowerCase().includes(lowerTerm) ||
        item.description?.toLowerCase().includes(lowerTerm) ||
        item.responsible_entity?.toLowerCase().includes(lowerTerm))
    );

    // 2. Deduplicate (Keep only the first occurrence of a unique title+desc signature)
    const uniqueItems = new Map();
    matches.forEach(item => {
      const signature = `${item.title}-${item.description?.substring(0, 50)}`; // Create unique signature
      if (!uniqueItems.has(signature)) {
        uniqueItems.set(signature, item);
      }
    });

    return Array.from(uniqueItems.values());
  }, [trafficChanges, searchTerm]);

  // Determine an image based on keyword
  const getNewsImage = (item: SupabaseTrafficChange) => {
    const text = (item.title + item.description).toLowerCase();
    if (text.includes('sciopero') || text.includes('strike')) return 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=400';
    if (text.includes('lavori') || text.includes('work') || text.includes('cantiere')) return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=400';
    if (text.includes('linea') || text.includes('metro') || text.includes('bus')) return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400';
    return 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=400'; // Default Traffic
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 items-center justify-center">
        <Newspaper className="h-12 w-12 mr-3 text-indigo-600 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Loading Latest Traffic News...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Newspaper className="h-8 w-8 mr-3 text-indigo-600" />
            Torino Traffic News
          </h1>
          <Button asChild variant="outline">
            <Link to="/torino-dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 text-red-600 rounded-lg">
            Error loading news: {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Newspaper className="h-8 w-8 mr-3 text-indigo-600" />
          Torino Traffic News (Official)
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
              placeholder="Search news..."
              className="pl-9 pr-8 w-full h-10 text-base border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {filteredNews && filteredNews.length > 0 ? (
          filteredNews.map((article, idx) => (
            <Card key={article.id || idx} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
              <img
                src={getNewsImage(article)}
                alt="Traffic News"
                className="w-full h-48 object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">
                    {article.responsible_entity || 'Traffic Update'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(article.start_date || Date.now()).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div
                  className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-4 prose prose-indigo max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: (article.description || 'No description provided.').split('LINK:')[0].trim().replace(/\n/g, '<br/>')
                  }}
                />

                {/* Strict External Link Only */}
                {(article.description || '').includes('LINK:') && (
                  <Button variant="outline" className="w-full mt-auto" asChild>
                    <a
                      href={(article.description || '').split('LINK:')[1].trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Read on {article.responsible_entity || 'Official Site'} &rarr;
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Newspaper className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>No traffic news found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsPortal;