import React from "react";
import { cn } from "@/lib/utils";

interface SplitPanelContainerProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
}

/**
 * 70/30 split layout for POS main screen
 * - Left: Category bar + Item grid (70%)
 * - Right: Cart panel (30%)
 */
export function SplitPanelContainer({
  leftPanel,
  rightPanel,
  className,
}: SplitPanelContainerProps) {
  return (
    <div className={cn("flex h-screen w-full", className)}>
      {/* Left Panel - 70% */}
      <div className="flex w-[70%] flex-col overflow-hidden border-r border-border">
        {leftPanel}
      </div>

      {/* Right Panel - 30% */}
      <div className="flex w-[30%] flex-col bg-muted/30">
        {rightPanel}
      </div>
    </div>
  );
}
