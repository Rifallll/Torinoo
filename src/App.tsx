import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from './components/LoadingSpinner';
import { TrafficDataProvider } from './contexts/TrafficDataContext';
import { SettingsProvider } from './contexts/SettingsContext'; // Import SettingsProvider

// Menggunakan React.lazy untuk memuat komponen secara dinamis
const HomePage = React.lazy(() => import("./pages/HomePage"));
const TorinoDashboard = React.lazy(() => import("./pages/TorinoDashboard"));
const NewsPortal = React.lazy(() => import("./pages/NewsPortal"));
const SensorsPage = React.lazy(() => import("./pages/SensorsPage"));
const IncidentsPage = React.lazy(() => import("./pages/IncidentsPage"));
const IncidentDetailPage = React.lazy(() => import("./pages/IncidentDetailPage"));
const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));
const DataAnalysisPage = React.lazy(() => import("./pages/DataAnalysisPage"));
const AboutTorinoPage = React.lazy(() => import("./pages/AboutTorinoPage"));
const CultureTourismPage = React.lazy(() => import("./pages/CultureTourismPage"));
const ContactCollaborationPage = React.lazy(() => import("./pages/ContactCollaborationPage"));
const WeatherPage = React.lazy(() => import("./pages/WeatherPage"));
const AllVehiclePositionsPage = React.lazy(() => import("./pages/AllVehiclePositionsPage"));
const AllTripUpdatesPage = React.lazy(() => import("./pages/AllTripUpdatesPage"));
const AllGtfsRoutesPage = React.lazy(() => import("./pages/AllGtfsRoutesPage")); // New: Import AllGtfsRoutesPage
const SettingsPage = React.lazy(() => import("./pages/SettingsPage")); // New: Import SettingsPage
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TrafficDataProvider>
      <SettingsProvider>
        <>
          <Toaster />
          <Sonner />
          <TooltipProvider>
            <div>
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/torino-dashboard" element={<TorinoDashboard />} />
                    <Route path="/news" element={<NewsPortal />} />
                    <Route path="/sensors" element={<SensorsPage />} />
                    <Route path="/incidents" element={<IncidentsPage />} />
                    <Route path="/incidents/:id" element={<IncidentDetailPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/data-analysis" element={<DataAnalysisPage />} />
                    <Route path="/about-torino" element={<AboutTorinoPage />} />
                    <Route path="/culture-tourism" element={<CultureTourismPage />} />
                    <Route path="/contact-collaboration" element={<ContactCollaborationPage />} />
                    <Route path="/weather" element={<WeatherPage />} />
                    <Route path="/all-vehicle-positions" element={<AllVehiclePositionsPage />} />
                    <Route path="/all-trip-updates" element={<AllTripUpdatesPage />} />
                    <Route path="/all-gtfs-routes" element={<AllGtfsRoutesPage />} /> {/* New route for AllGtfsRoutesPage */}
                    <Route path="/settings" element={<SettingsPage />} /> {/* New route for SettingsPage */}
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </>
      </SettingsProvider>
    </TrafficDataProvider>
  </QueryClientProvider>
);

export default App;