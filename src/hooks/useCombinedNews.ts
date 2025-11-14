"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string; // ISO 8601 date string
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsApiResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

const fetchNewsFromNewsApi = async (query: string, language: string): Promise<NewsArticle[]> => {
  const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
  if (!apiKey) {
    console.warn("NewsAPI Key tidak ditemukan. Melewatkan pengambilan dari NewsAPI.");
    return [];
  }

  const params = new URLSearchParams({
    q: query,
    language: language,
    sortBy: 'publishedAt',
    pageSize: '100',
    apiKey: apiKey,
  });

  const url = `https://newsapi.org/v2/everything?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Gagal mengambil berita dari NewsAPI: ${errorData.message || response.statusText}`);
      toast.error(`Gagal mengambil berita dari NewsAPI: ${errorData.message || response.statusText}`);
      return [];
    }

    const result: NewsApiResponse = await response.json();
    return result.articles;
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    toast.error(`Terjadi kesalahan saat mengambil berita dari NewsAPI: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
};

const fetchNewsFromGNewsApi = async (query: string, language: string): Promise<NewsArticle[]> => {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  if (!apiKey) {
    console.warn("GNews.io API Key tidak ditemukan. Melewatkan pengambilan dari GNews.io.");
    return [];
  }

  const params = new URLSearchParams({
    q: query,
    lang: language,
    max: '100',
    token: apiKey,
  });

  const url = `https://gnews.io/api/v4/search?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Gagal mengambil berita dari GNews.io: ${errorData.errors?.[0] || response.statusText}`);
      toast.error(`Gagal mengambil berita dari GNews.io: ${errorData.errors?.[0] || response.statusText}`);
      return [];
    }

    const result: GNewsApiResponse = await response.json();
    return result.articles.map(gNewsArticle => ({
      source: {
        id: null,
        name: gNewsArticle.source.name,
      },
      author: null,
      title: gNewsArticle.title,
      description: gNewsArticle.description,
      url: gNewsArticle.url,
      urlToImage: gNewsArticle.image,
      publishedAt: gNewsArticle.publishedAt,
      content: gNewsArticle.content,
    }));
  } catch (error) {
    console.error("Error fetching from GNews.io:", error);
    toast.error(`Terjadi kesalahan saat mengambil berita dari GNews.io: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
};

// Helper to normalize a string for comparison (e.g., for titles)
const normalizeTitle = (title: string | null | undefined) => {
  if (!title) return '';
  // Convert to lowercase, remove punctuation, and extra spaces
  // Using \p{L} for Unicode letters, \p{N} for Unicode numbers
  return title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
};

const fetchCombinedNews = async (query: string, language: string): Promise<NewsArticle[]> => {
  const [newsApiResult, gNewsResult] = await Promise.allSettled([
    fetchNewsFromNewsApi(query, language),
    fetchNewsFromGNewsApi(query, language),
  ]);

  let allArticles: NewsArticle[] = [];

  if (newsApiResult.status === 'fulfilled') {
    allArticles = allArticles.concat(newsApiResult.value);
  }
  if (gNewsResult.status === 'fulfilled') {
    allArticles = allArticles.concat(gNewsResult.value);
  }

  const deduplicatedArticles = new Map<string, NewsArticle>(); // Key: URL or normalized title

  for (const article of allArticles) {
    // Use URL as primary key, fallback to normalized title if URL is missing or generic
    const key = article.url || normalizeTitle(article.title); 

    if (!key) continue; // Skip articles without a valid key

    if (deduplicatedArticles.has(key)) {
      const existingArticle = deduplicatedArticles.get(key)!;
      
      // Compare articles and keep the one with more complete data or is newer
      const existingHasImage = !!existingArticle.urlToImage;
      const newHasImage = !!article.urlToImage;
      const existingHasDescription = !!existingArticle.description;
      const newHasDescription = !!article.description;

      // Prioritize article with image, then description, then newer published date
      if (
        (newHasImage && !existingHasImage) || // New has image, existing doesn't
        (!newHasImage && existingHasImage) || // Existing has image, new doesn't (keep existing)
        (newHasImage === existingHasImage && newHasDescription && !existingHasDescription) || // Same image status, new has description, existing doesn't
        (newHasImage === existingHasImage && !newHasDescription && existingHasDescription) || // Same image status, existing has description, new doesn't (keep existing)
        (newHasImage === existingHasImage && newHasDescription === existingHasDescription && new Date(article.publishedAt) > new Date(existingArticle.publishedAt))
      ) {
        // If new article is "better" (more info or newer), replace existing
        deduplicatedArticles.set(key, article);
      }
    } else {
      deduplicatedArticles.set(key, article);
    }
  }

  const finalArticles = Array.from(deduplicatedArticles.values());

  // Sort by publishedAt in descending order
  finalArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return finalArticles;
};

export const useCombinedNews = (query: string = "Torino traffic", language: string = 'en', enabled: boolean = true) => {
  return useQuery<NewsArticle[], Error>({
    queryKey: ["combinedNews", query, language],
    queryFn: () => fetchCombinedNews(query, language),
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
};