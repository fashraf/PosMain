import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { CategoryPill } from "./CategoryPill";
import { Star } from "lucide-react";
import type { POSCategory } from "@/lib/pos/types";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="sticky top-0 z-10 border-b bg-background">
      <div
        ref={scrollRef}
        className={cn(
          "flex items-center gap-2 overflow-x-auto px-4 py-3",
          "scrollbar-hide", // Hide scrollbar
          "snap-x snap-mandatory" // Snap scrolling
        )}
      >
        {/* All Items */}
        <CategoryPill
          label="All"
          isSelected={!selectedCategoryId && !showFavorites}
          onClick={() => onCategorySelect(null)}
        />

        {/* Categories */}
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            label={category.name_en}
            isSelected={selectedCategoryId === category.id && !showFavorites}
            onClick={() => onCategorySelect(category.id)}
          />
        ))}

        {/* Favorites */}
        <CategoryPill
          label="Favorites"
          icon={<Star className="h-4 w-4" />}
          isSelected={showFavorites}
          onClick={onFavoritesSelect}
        />
      </div>
    </div>
  );
}
