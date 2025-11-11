"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const newsArticles = [
  {
    id: '1',
    title: 'New Smart Traffic Lights Reduce Congestion by 15%',
    date: 'November 10, 2023',
    summary: 'A pilot program implementing AI-powered traffic lights has shown promising results, significantly easing rush hour congestion in downtown areas.',
    imageUrl: 'https://images.unsplash.com/photo-1532936790947-d06f70530588?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '2',
    title: 'City Launches Public Awareness Campaign for Pedestrian Safety',
    date: 'November 9, 2023',
    summary: 'Authorities are urging residents to be more vigilant on roads with a new campaign aimed at reducing pedestrian-related accidents.',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '3',
    title: 'Upcoming Road Closures for Infrastructure Maintenance',
    date: 'November 8, 2023',
    summary: 'Several key roads will experience temporary closures next week for essential maintenance work. Drivers are advised to seek alternative routes.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946526-c29d02993b9f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const NewsPortal = () => {
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

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {newsArticles.map(article => (
          <Card key={article.id} className="overflow-hidden flex flex-col">
            <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{article.title}</CardTitle>
              <p className="text-sm text-gray-500">{article.date}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-gray-700 mb-4">{article.summary}</p>
              <Button variant="link" className="p-0 h-auto justify-start">Read More</Button>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default NewsPortal;