"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const quotesMotto = [
  "“Torino — Where History Drives the Future.”",
  "“A city of elegance, innovation, and timeless heritage.”",
];

const QuotesMottoSection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Quote className="h-5 w-5 mr-2 text-gray-600" /> Quotes & Motto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-gray-700 dark:text-gray-300 italic">
          {quotesMotto.map((quote, index) => (
            <p key={index}>&ldquo;{quote.replace(/“|”/g, '')}&rdquo;</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotesMottoSection;