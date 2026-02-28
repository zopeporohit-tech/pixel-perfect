import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import SystemHealthBar from "@/components/SystemHealthBar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        {/* Scanning line animation */}
        <div className="scan-line pointer-events-none" />
        
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-12 flex items-center justify-between border-b border-border/50 px-4 glass-card z-10">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-sm font-semibold text-foreground">Campus Energy Intelligence Portal</h1>
            </div>
            <SystemHealthBar />
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
