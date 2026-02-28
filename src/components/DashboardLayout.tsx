import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import SystemHealthBar from "@/components/SystemHealthBar";
import { useRealtimeEngine } from "@/hooks/useRealtimeEngine";
import { createContext, useContext } from "react";
import type { LiveMetrics, ForecastPoint } from "@/hooks/useRealtimeEngine";

interface RealtimeContextValue {
  liveMetrics: LiveMetrics | null;
  forecastData: ForecastPoint[];
  anomalies: Set<string>;
  liveHistory: { time: string; value: number }[];
  tick: number;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  liveMetrics: null,
  forecastData: [],
  anomalies: new Set(),
  liveHistory: [],
  tick: 0,
});

export const useRealtime = () => useContext(RealtimeContext);

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const realtimeData = useRealtimeEngine();

  return (
    <RealtimeContext.Provider value={realtimeData}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full relative">
          {/* Scanning line animation */}
          <div className="scan-line pointer-events-none" />

          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-12 flex items-center justify-between border-b border-border/50 px-4 glass-card z-10">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4" />
                <h1 className="text-sm font-semibold text-foreground hidden sm:block">Campus Energy Intelligence Portal</h1>
              </div>
              <SystemHealthBar metrics={realtimeData.liveMetrics} />
            </header>
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </RealtimeContext.Provider>
  );
}
