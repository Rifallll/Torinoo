import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from './components/LoadingSpinner';

// Menggunakan React.lazy untuk memuat komponen secara dinamis
const HomePage = React.lazy(() => import("./pages/HomePage")); // Import HomePage
const TorinoDashboard = React.lazy(() => import("./pages/TorinoDashboard"));
const NewsPortal = React.lazy(() => import("./pages/NewsPortal"));
const SensorsPage = React.lazy(() => import("./pages/SensorsPage"));
const IncidentsPage = React.lazy(() => import("./pages/IncidentsPage"));
const IncidentDetailPage = React.lazy(() => import("./pages/IncidentDetailPage"));
const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));
const DataAnalysisPage = React.lazy(() => import("./pages/DataAnalysisPage"));
const AboutTorinoPage = React.lazy(() => import("./pages/AboutTorinoPage"));
const CultureTourismPage = React.lazy(() => import("./pages/CultureTourismPage")); // New page
const ContactCollaborationPage = React.lazy(() => import("./pages/ContactCollaborationPage")); // New page
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <>
      <Toaster />
      <Sonner />
      <TooltipProvider>
        <div>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} /> {/* Set HomePage as default */}
                <Route path="/torino-dashboard" element={<TorinoDashboard />} />
                <Route path="/news" element={<NewsPortal />} />
                <Route path="/sensors" element={<SensorsPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/incidents/:id" element={<IncidentDetailPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/data-analysis" element={<DataAnalysisPage />} />
                <Route path="/about-torino" element={<AboutTorinoPage />} />
                <Route path="/culture-tourism" element={<CultureTourismPage />} /> {/* New route */}
                <Route path="/contact-collaboration" element={<ContactCollaborationPage />} /> {/* New route */}
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </>
  </QueryClientProvider>
);

export default App;