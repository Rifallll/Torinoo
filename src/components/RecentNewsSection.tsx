"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, ArrowRight } from 'lucide-react';

const recentNewsArticles = [
  {
    id: '1',
    title: 'Current Congestion Alert: Via Roma Heavy Traffic',
    date: 'November 11, 2023', // Updated date to reflect "today"
    summary: 'Heavy congestion reported on Via Roma due to an ongoing event. Drivers advised to seek alternative routes.',
    imageUrl: 'https://images.unsplash.com/photo-1532936790947-d06f70530588?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '2',
    title: 'Minor Accident Cleared on Corso Vittorio Emanuele II',
    date: 'November 11, 2023', // Updated date to reflect "today"
    summary: 'A minor vehicle incident has been cleared, traffic flow returning to normal. Expect residual delays.',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '3',
    title: 'Public Transport Delays Expected Due to Weather',
    date: 'November 11, 2023', // Updated date to reflect "today"
    summary: 'Light rain causing minor delays across bus and tram services. Check schedules before travel.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946526-c29d02993b9f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const RecentNewsSection: React.FC = () => {
  return (
    <Card className="lg:col-span-3"> {/* Span across all columns on large screens */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <Newspaper className="h-5 w-5 mr-2 text-indigo-600" /> Today's Traffic News
        </CardTitle>
        <Button asChild variant="link" className="p-0 h-auto">
          <Link to="/news" className="flex items-center text-indigo-600 hover:text-indigo-700">
            View All Torino News <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentNewsArticles.map(article => (
            <Card key={article.id} className="overflow-hidden flex flex-col">
              <img src={article.imageUrl} alt={article.title} className="w-full h-32 object-cover" />
              <CardHeader className="p-3 pb-0">
                <CardTitle className="text-base font-semibold line-clamp-2">{article.title}</CardTitle>
                <p className="text-xs text-gray-500">{article.date}</p>
              </CardHeader>
              <CardContent className="p-3 pt-2 flex-1 flex flex-col justify-between">
                <p className="text-sm text-gray-700 line-clamp-3 mb-2">{article.summary}</p>
                <Button variant="link" className="p-0 h-auto justify-start text-sm">Read More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentNewsSection;