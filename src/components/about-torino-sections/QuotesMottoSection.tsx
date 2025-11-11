"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const quotesMotto = [
  "“Torino — Where History Drives the Future.”",
  "“A city of elegance, innovation, and timeless heritage.”",
];

interface QuotesMottoSectionProps {
  id?: string;
}

const QuotesMottoSection: React.FC<QuotesMottoSectionProps> = ({ id }) => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg" id={id}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <Quote className="h-5 w-5 mr-2 text-gray-600" /> Quotes & Motto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 text-gray-700 dark:text-gray-300 italic text-lg">
          {quotesMotto.map((quote, index) => (
            <p key={index} className="leading-relaxed">&ldquo;{quote.replace(/“|”/g, '')}&rdquo;</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotesMottoSection;