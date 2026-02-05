import React from "react";
import { cn } from "@/lib/utils";

interface CategoryPillProps {
  label: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryPill({
  label,
  icon,
  isSelected,
  onClick,
}: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 snap-start items-center gap-2 rounded-full px-5 py-2.5",
        "min-h-[44px] text-sm font-medium",
        "touch-manipulation transition-colors",
        "active:scale-95",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
