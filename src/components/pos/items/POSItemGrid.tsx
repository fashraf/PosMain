import React from "react";
import { POSItemCard } from "./POSItemCard";
import type { POSMenuItem } from "@/lib/pos/types";
import { Skeleton } from "@/components/ui/skeleton";

interface POSItemGridProps {
  items: POSMenuItem[];
  isLoading?: boolean;
  onAddItem: (item: POSMenuItem) => void;
  onCustomizeItem: (item: POSMenuItem) => void;
  onViewDetails: (item: POSMenuItem) => void;
}

export function POSItemGrid({
  items,
  isLoading,
  onAddItem,
  onCustomizeItem,
  onViewDetails,
}: POSItemGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="p-2 pt-0">
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No items found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <POSItemCard
          key={item.id}
          item={item}
          onAdd={() => onAddItem(item)}
          onCustomize={() => onCustomizeItem(item)}
          onViewDetails={() => onViewDetails(item)}
        />
      ))}
    </div>
  );
}
