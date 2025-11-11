"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';

// Import modular sections
import GeneralInfoSection from '@/components/about-torino-sections/GeneralInfoSection';
import GovernmentInfoSection from '@/components/about-torino-sections/GovernmentInfoSection';
import HistorySection from '@/components/about-torino-sections/HistorySection';
import GeographyClimateSection from '@/components/about-torino-sections/GeographyClimateSection';
import TransportationMobilitySection from '@/components/about-torino-sections/TransportationMobilitySection';
import EconomySection from '@/components/about-torino-sections/EconomySection';
import EducationResearchSection from '@/components/about-torino-sections/EducationResearchSection';
import CultureTourismSection from '@/components/about-torino-sections/CultureTourismSection';
import CuisineSection from '@/components/about-torino-sections/CuisineSection';
import VisualGallerySection from '@/components/about-torino-sections/VisualGallerySection';
import DemographicsSection from '@/components/about-torino-sections/DemographicsSection';
import SmartCityInitiativesSection from '@/components/about-torino-sections/SmartCityInitiativesSection';
import QuotesMottoSection from '@/components/about-torino-sections/QuotesMottoSection';
import SummaryTableSection from '@/components/about-torino-sections/SummaryTableSection';

const AboutTorinoTabs: React.FC = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto flex-wrap bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-inner">
        <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Overview</TabsTrigger>
        <TabsTrigger value="history-governance" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">History & Governance</TabsTrigger>
        <TabsTrigger value="geography-climate" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Geography & Climate</TabsTrigger>
        <TabsTrigger value="economy-innovation" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Economy & Innovation</TabsTrigger>
        <TabsTrigger value="culture-lifestyle" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Culture & Lifestyle</TabsTrigger>
        <TabsTrigger value="transportation" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Transportation</TabsTrigger>
      </TabsList>

      <div className="mt-6 space-y-8">
        <TabsContent value="overview" id="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GeneralInfoSection id="general-info" />
            <DemographicsSection id="demographics" />
            <SummaryTableSection id="summary-table" />
            <QuotesMottoSection id="quotes-motto" />
          </div>
        </TabsContent>

        <TabsContent value="history-governance" id="history-governance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HistorySection id="history" />
            <GovernmentInfoSection id="government-info" />
          </div>
        </TabsContent>

        <TabsContent value="geography-climate" id="geography-climate">
          <GeographyClimateSection id="geography-climate-section" />
        </TabsContent>

        <TabsContent value="economy-innovation" id="economy-innovation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EconomySection id="economy" />
            <EducationResearchSection id="education-research" />
            <SmartCityInitiativesSection id="smart-city-initiatives" />
          </div>
        </TabsContent>

        <TabsContent value="culture-lifestyle" id="culture-lifestyle">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CultureTourismSection id="culture-tourism-section" />
            <CuisineSection id="cuisine" />
            <VisualGallerySection id="visual-gallery" />
          </div>
        </TabsContent>

        <TabsContent value="transportation" id="transportation">
          <TransportationMobilitySection id="transportation-mobility" />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default AboutTorinoTabs;