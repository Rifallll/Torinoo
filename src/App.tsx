import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TrafficDashboard from "./pages/TrafficDashboard";
import NewsPortal from "./pages/NewsPortal";
import SensorsPage from "./pages/SensorsPage"; // Import the new SensorsPage
import IncidentsPage from "./pages/IncidentsPage"; // Import the new IncidentsPage
import ReportsPage from "./pages/ReportsPage"; // Import the new ReportsPage
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<TrafficDashboard />} />
          <Route path="/news" element={<NewsPortal />} />
          <Route path="/sensors" element={<SensorsPage />} /> {/* New Sensors Page route */}
          <Route path="/incidents" element={<IncidentsPage />} /> {/* New Incidents Page route */}
          <Route path="/reports" element={<ReportsPage />} /> {/* New Reports Page route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;