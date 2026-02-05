import React from "react";
import { cn } from "@/lib/utils";

interface POSLayoutProps {
  children: React.ReactNode;
}

/**
 * Tablet-optimized full-screen layout for POS module
 * - No admin sidebar
 * - Fixed landscape orientation optimization
 * - Touch-optimized scrolling
 */
export function POSLayout({ children }: POSLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full bg-background",
        "touch-manipulation", // Optimize for touch
        "select-none", // Prevent text selection
        "overflow-hidden" // Prevent body scroll
      )}
    >
      {children}
    </div>
  );
}
