"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchNewsFromBackend } from '@/api/news'; // Import the new backend simulation

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

export const useCombinedNews = (query: string = "Torino traffic", language: string = 'en', enabled: boolean = true) => {
  return useQuery<NewsArticle[], Error>({
    queryKey: ["combinedNews", query, language],
    queryFn: () => fetchNewsFromBackend(query, language), // Call the new backend simulation
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
};