import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TorinoDashboard from "./pages/TorinoDashboard"; // Import the new TorinoDashboard
import NewsPortal from "./pages/NewsPortal";
import SensorsPage from "./pages/SensorsPage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/torino-dashboard" replace />} /> {/* Redirect to new dashboard */}
          {/* <Route path="/dashboard" element={<TrafficDashboard />} /> -- Old dashboard route removed */}
          <Route path="/torino-dashboard" element={<TorinoDashboard />} /> {/* New Torino Dashboard route */}
          <Route path="/news" element={<NewsPortal />} />
          <Route path="/sensors" element={<SensorsPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;