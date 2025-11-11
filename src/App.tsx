import React, { Suspense } from 'react'; // Import Suspense dan React
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from './components/LoadingSpinner'; // Import LoadingSpinner

// Menggunakan React.lazy untuk memuat komponen secara dinamis
const TorinoDashboard = React.lazy(() => import("./pages/TorinoDashboard"));
const NewsPortal = React.lazy(() => import("./pages/NewsPortal"));
const SensorsPage = React.lazy(() => import("./pages/SensorsPage"));
const IncidentsPage = React.lazy(() => import("./pages/IncidentsPage"));
const IncidentDetailPage = React.lazy(() => import("./pages/IncidentDetailPage"));
const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));
const DataAnalysisPage = React.lazy(() => import("./pages/DataAnalysisPage"));
const AboutTorinoPage = React.lazy(() => import("./pages/AboutTorinoPage"));
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
            <Suspense fallback={<LoadingSpinner />}> {/* Tambahkan Suspense dengan fallback */}
              <Routes>
                <Route path="/" element={<Navigate to="/torino-dashboard" replace />} />
                <Route path="/torino-dashboard" element={<TorinoDashboard />} />
                <Route path="/news" element={<NewsPortal />} />
                <Route path="/sensors" element={<SensorsPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/incidents/:id" element={<IncidentDetailPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/data-analysis" element={<DataAnalysisPage />} />
                <Route path="/about-torino" element={<AboutTorinoPage />} />
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