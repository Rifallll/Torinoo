import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TorinoDashboard from "./pages/TorinoDashboard";
import NewsPortal from "./pages/NewsPortal";
import SensorsPage from "./pages/SensorsPage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import ReportsPage from "./pages/ReportsPage";
import DataAnalysisPage from "./pages/DataAnalysisPage"; // Import the new DataAnalysisPage
import AboutTorinoPage from "./pages/AboutTorinoPage"; // Import the new AboutTorinoPage
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/torino-dashboard" replace />} />
          <Route path="/torino-dashboard" element={<TorinoDashboard />} />
          <Route path="/news" element={<NewsPortal />} />
          <Route path="/sensors" element={<SensorsPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/data-analysis" element={<DataAnalysisPage />} /> {/* New route */}
          <Route path="/about-torino" element={<AboutTorinoPage />} /> {/* New route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;