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
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="history-governance">History & Governance</TabsTrigger>
        <TabsTrigger value="geography-climate">Geography & Climate</TabsTrigger>
        <TabsTrigger value="economy-innovation">Economy & Innovation</TabsTrigger>
        <TabsTrigger value="culture-lifestyle">Culture & Lifestyle</TabsTrigger>
        <TabsTrigger value="transportation">Transportation</TabsTrigger>
      </TabsList>

      <div className="mt-6 space-y-8">
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GeneralInfoSection />
            <DemographicsSection />
            <SummaryTableSection />
            <QuotesMottoSection />
          </div>
        </TabsContent>

        <TabsContent value="history-governance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HistorySection />
            <GovernmentInfoSection />
          </div>
        </TabsContent>

        <TabsContent value="geography-climate">
          <GeographyClimateSection />
        </TabsContent>

        <TabsContent value="economy-innovation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EconomySection />
            <EducationResearchSection />
            <SmartCityInitiativesSection />
          </div>
        </TabsContent>

        <TabsContent value="culture-lifestyle">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CultureTourismSection />
            <CuisineSection />
            <VisualGallerySection />
          </div>
        </TabsContent>

        <TabsContent value="transportation">
          <TransportationMobilitySection />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default AboutTorinoTabs;