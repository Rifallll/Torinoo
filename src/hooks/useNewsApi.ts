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

const fetchNewsFromApi = async (query: string, language: string = 'en'): Promise<NewsArticle[]> => {
  const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
  if (!apiKey) {
    toast.error("Kunci API NewsAPI tidak ditemukan di environment variables.");
    throw new Error("NewsAPI Key tidak ditemukan.");
  }

  // NewsAPI requires a query for the 'everything' endpoint
  const params = new URLSearchParams({
    q: query,
    language: language,
    sortBy: 'publishedAt',
    pageSize: '10', // Fetch 10 articles
    apiKey: apiKey,
  });

  const url = `https://newsapi.org/v2/everything?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    toast.error(`Gagal mengambil berita: ${errorData.message || response.statusText}`);
    throw new Error(`Gagal mengambil berita: ${errorData.message || response.statusText}`);
  }

  const result: NewsApiResponse = await response.json();

  if (result.status === "ok") {
    return result.articles;
  } else {
    toast.error(`API NewsAPI mengembalikan status error: ${result.status}`);
    throw new Error(`API NewsAPI mengembalikan status error: ${result.status}`);
  }
};

export const useNewsApi = (query: string = "Torino traffic", language: string = 'en', enabled: boolean = true) => {
  return useQuery<NewsArticle[], Error>({
    queryKey: ["newsApi", query, language],
    queryFn: () => fetchNewsFromApi(query, language),
    staleTime: 5 * 60 * 1000, // Data dianggap segar selama 5 menit
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
};