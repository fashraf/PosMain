import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CategoryPill } from "./CategoryPill";
import { Home, Star } from "lucide-react";
import type { POSCategory } from "@/lib/pos/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CategoryBarProps {
  categories: POSCategory[];
  selectedCategoryId: string | null;
  showFavorites: boolean;
  onCategorySelect: (categoryId: string | null) => void;
  onFavoritesSelect: () => void;
  isLoading?: boolean;
}

export function CategoryBar({
  categories,
  selectedCategoryId,
  showFavorites,
  onCategorySelect,
  onFavoritesSelect,
  isLoading,
}: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-16 items-center gap-2 border-b bg-background px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 border-2 border-dashed border-border rounded-lg mx-2 mt-2 bg-background">
      <div className="flex items-center">
        {/* Floating Dashboard Home Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => navigate("/")}
              className={cn(
                "flex shrink-0 items-center justify-center",
                "w-12 h-12 rounded-xl -my-2 ml-2",
                "bg-card shadow-md border border-border",
                "text-muted-foreground hover:text-primary hover:shadow-lg",
                "transition-all duration-200 active:scale-95",
                "z-10"
              )}
            >
              <Home className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Dashboard</TooltipContent>
        </Tooltip>

        {/* 20% left offset spacer */}
        <div className="w-[18%] shrink-0" />

        {/* Scrollable pills */}
        <div
          ref={scrollRef}
          className={cn(
            "flex items-center gap-2 overflow-x-auto py-3 pr-4",
            "scrollbar-hide",
            "snap-x snap-mandatory"
          )}
        >
          <CategoryPill
            key={`all-${!selectedCategoryId && !showFavorites}`}
            label="All"
            isSelected={!selectedCategoryId && !showFavorites}
            onClick={() => onCategorySelect(null)}
          />

          {categories.map((category) => (
            <CategoryPill
              key={`${category.id}-${selectedCategoryId === category.id && !showFavorites}`}
              label={category.name_en}
              isSelected={selectedCategoryId === category.id && !showFavorites}
              onClick={() => onCategorySelect(category.id)}
            />
          ))}

          <CategoryPill
            key={`fav-${showFavorites}`}
            label="Favorites"
            icon={<Star className="h-4 w-4" />}
            isSelected={showFavorites}
            onClick={onFavoritesSelect}
          />
        </div>
      </div>
    </div>
  );
}
