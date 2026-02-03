import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isRTL } = useLanguage();
  const [selectedBranch, setSelectedBranch] = useState("all");

  return (
    <SidebarProvider>
      <div className={cn(
        "min-h-screen flex w-full bg-background",
        isRTL && "flex-row-reverse"
      )}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            selectedBranch={selectedBranch} 
            onBranchChange={setSelectedBranch} 
          />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
