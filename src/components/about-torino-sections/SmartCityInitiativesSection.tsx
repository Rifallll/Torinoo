"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const smartCityInitiatives = [
  "Smart City Torino – a smart city project focusing on:",
  "Smart transportation & traffic management.",
  "Renewable energy & building efficiency.",
  "Digitalization of public services.",
  "Urban data center & open mobility data.",
  "Smart Road Project: road sensor & autonomous vehicle trials.",
];

const SmartCityInitiativesSection: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-lime-600" /> Smart City Initiatives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700 dark:text-gray-300">
          {smartCityInitiatives.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SmartCityInitiativesSection;