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
    q: query, // Menggunakan query pengguna
    language: language,
    sortBy: 'publishedAt',
    pageSize: '100',
    apiKey: apiKey,
    // Menambahkan domain spesifik untuk mempersempit cakupan pencarian
    domains: 'repubblica.it,corriere.it,lastampa.it,ansa.it,ilsole24ore.com',
  });

  const url = `https://newsapi.org/v2/everything?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Gagal mengambil berita dari NewsAPI: ${errorData.message || response.statusText}`);
      // Menyederhanakan pesan error untuk pengguna
      toast.error(`Gagal mengambil berita dari NewsAPI. Coba lagi nanti.`);
      return [];
    }

    const result: NewsApiResponse = await response.json();
    return result.articles;
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    toast.error(`Terjadi kesalahan saat mengambil berita dari NewsAPI. Coba lagi nanti.`);
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
    q: query, // Menggunakan query pengguna
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
      // Menyederhanakan pesan error untuk pengguna
      toast.error(`Gagal mengambil berita dari GNews.io. Coba lagi nanti.`);
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
    toast.error(`Terjadi kesalahan saat mengambil berita dari GNews.io. Coba lagi nanti.`);
    return [];
  }
};

// Helper to normalize a string for comparison (e.g., for titles)
const normalizeText = (text: string | null | undefined) => {
  if (!text) return '';
  // Convert to lowercase, remove punctuation, and extra spaces
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
};

// Helper to check if an article is traffic-related
const isTrafficRelated = (article: NewsArticle): boolean => {
  const trafficKeywords = [
    "traffic", "congestion", "road", "incident", "accident", "delay", "route", "vehicle", "mobility", "transport", "transit",
    "traffico", "congestione", "strada", "incidente", "ritardo", "percorso", "veicolo", "mobilità", "trasporto", "circolazione"
  ];

  const title = normalizeText(article.title);
  const description = normalizeText(article.description);
  const content = normalizeText(article.content);

  return trafficKeywords.some(keyword => 
    title.includes(keyword) || 
    description.includes(keyword) || 
    content.includes(keyword)
  );
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
    const key = article.url || normalizeText(article.title); 

    if (!key) continue; // Skip articles without a valid key

    if (deduplicatedArticles.has(key)) {
      const existingArticle = deduplicatedArticles.get(key)!;
      
      // Determine which article is "better"
      let shouldReplace = false;

      const newHasImage = !!article.urlToImage;
      const existingHasImage = !!existingArticle.urlToImage;
      const newHasDescription = !!article.description;
      const existingHasDescription = !!existingArticle.description;
      const newPublishedAt = new Date(article.publishedAt).getTime();
      const existingPublishedAt = new Date(existingArticle.publishedAt).getTime();

      // Prioritize article with an image
      if (newHasImage && !existingHasImage) {
        shouldReplace = true;
      } else if (!newHasImage && existingHasImage) {
        shouldReplace = false; // Keep existing
      } 
      // If both/neither have image, then prioritize article with a description
      else if (newHasDescription && !existingHasDescription) {
        shouldReplace = true;
      } else if (!newHasDescription && existingHasDescription) {
        shouldReplace = false; // Keep existing
      }
      // If both/neither have image/description, then prioritize newer article
      else if (newPublishedAt > existingPublishedAt) {
        shouldReplace = true;
      }

      if (shouldReplace) {
        deduplicatedArticles.set(key, article);
      }
      // If shouldReplace is false, we implicitly keep the existing article.
    } else {
      deduplicatedArticles.set(key, article);
    }
  }

  let finalArticles = Array.from(deduplicatedArticles.values());

  // Apply the traffic-related filter
  finalArticles = finalArticles.filter(isTrafficRelated);

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