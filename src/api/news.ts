"use client";

import { NewsArticle } from '@/hooks/useCombinedNews';
import { toast } from 'sonner';

// In a real application, this file would contain functions that make requests
// to YOUR OWN backend server or serverless functions, which would then
// securely call NewsAPI and GNews.io using API keys stored on the server.
// This prevents API keys from being exposed in the client-side bundle.

// For this simulation, we will still directly call the third-party APIs,
// but the structure here demonstrates how you would abstract it.

const NEWSAPI_BASE_URL = "https://newsapi.org/v2/everything";
const GNEWS_BASE_URL = "https://gnews.io/api/v4/search";

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

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// Helper to normalize a string for comparison (e.g., for titles)
const normalizeText = (text: string | null | undefined) => {
  if (!text) return '';
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

export const fetchNewsFromBackend = async (query: string, language: string): Promise<NewsArticle[]> => {
  // IMPORTANT: In a real application, these API keys should be loaded securely
  // from a backend server (e.g., environment variables in a serverless function)
  // and not exposed client-side.
  const newsApiKey = "YOUR_NEWSAPI_KEY_HERE"; // Placeholder for client-side simulation
  const gnewsApiKey = "YOUR_GNEWS_API_KEY_HERE"; // Placeholder for client-side simulation

  const [newsApiResult, gNewsResult] = await Promise.allSettled([
    (async () => {
      if (!newsApiKey || newsApiKey === "YOUR_NEWSAPI_KEY_HERE") {
        console.warn("NewsAPI Key tidak ditemukan atau belum diatur. Melewatkan pengambilan dari NewsAPI.");
        return [];
      }
      const params = new URLSearchParams({
        q: query,
        language: language,
        sortBy: 'publishedAt',
        pageSize: '100',
        apiKey: newsApiKey,
      });
      const url = `${NEWSAPI_BASE_URL}?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Gagal mengambil berita dari NewsAPI: ${errorData.message || response.statusText}`);
        return [];
      }
      const result: NewsApiResponse = await response.json();
      return result.articles;
    })(),
    (async () => {
      if (!gnewsApiKey || gnewsApiKey === "YOUR_GNEWS_API_KEY_HERE") {
        console.warn("GNews.io API Key tidak ditemukan atau belum diatur. Melewatkan pengambilan dari GNews.io.");
        return [];
      }
      const params = new URLSearchParams({
        q: query,
        lang: language,
        max: '100',
        token: gnewsApiKey,
      });
      const url = `${GNEWS_BASE_URL}?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Gagal mengambil berita dari GNews.io: ${errorData.errors?.[0] || response.statusText}`);
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
    })(),
  ]);

  let allArticles: NewsArticle[] = [];

  if (newsApiResult.status === 'fulfilled') {
    allArticles = allArticles.concat(newsApiResult.value);
  }
  if (gNewsResult.status === 'fulfilled') {
    allArticles = allArticles.concat(gNewsResult.value);
  }

  const deduplicatedArticles = new Map<string, NewsArticle>();

  for (const article of allArticles) {
    const key = article.url || normalizeText(article.title); 

    if (!key) continue;

    if (deduplicatedArticles.has(key)) {
      const existingArticle = deduplicatedArticles.get(key)!;
      
      let shouldReplace = false;

      const newHasImage = !!article.urlToImage;
      const existingHasImage = !!existingArticle.urlToImage;
      const newHasDescription = !!article.description;
      const existingHasDescription = !!existingArticle.description;
      const newPublishedAt = new Date(article.publishedAt).getTime();
      const existingPublishedAt = new Date(existingArticle.publishedAt).getTime();

      if (newHasImage && !existingHasImage) {
        shouldReplace = true;
      } else if (!newHasImage && existingHasImage) {
        shouldReplace = false;
      } 
      else if (newHasDescription && !existingHasDescription) {
        shouldReplace = true;
      } else if (!newHasDescription && existingHasDescription) {
        shouldReplace = false;
      }
      else if (newPublishedAt > existingPublishedAt) {
        shouldReplace = true;
      }

      if (shouldReplace) {
        deduplicatedArticles.set(key, article);
      }
    } else {
      deduplicatedArticles.set(key, article);
    }
  }

  let finalArticles = Array.from(deduplicatedArticles.values());

  finalArticles = finalArticles.filter(isTrafficRelated);

  finalArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return finalArticles;
};