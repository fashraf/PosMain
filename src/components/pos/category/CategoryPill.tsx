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
      key={`${label}-${isSelected}`}
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 snap-start items-center gap-2 rounded-full",
        "touch-manipulation transition-all duration-200",
        "active:scale-95",
        isSelected
          ? "bg-primary text-primary-foreground py-3.5 px-5 font-bold shadow-sm animate-[bounce-in_0.4s_ease-out]"
          : "bg-muted text-muted-foreground py-2.5 px-5 font-medium hover:bg-muted/80 text-sm"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
