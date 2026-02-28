import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import BuildingsPage from "./pages/BuildingsPage";
import BenchmarksPage from "./pages/BenchmarksPage";
import AIForecastingPage from "./pages/AIForecastingPage";
import ReportsPage from "./pages/ReportsPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/buildings" element={<BuildingsPage />} />
            <Route path="/benchmarks" element={<BenchmarksPage />} />
            <Route path="/ai-forecasting" element={<AIForecastingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
