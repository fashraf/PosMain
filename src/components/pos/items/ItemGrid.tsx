import React from "react";
import { ItemCard } from "./ItemCard";
import type { POSMenuItem } from "@/lib/pos/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemGridProps {
  items: POSMenuItem[];
  isLoading?: boolean;
  onAddItem: (item: POSMenuItem) => void;
  onCustomizeItem: (item: POSMenuItem) => void;
}

export function ItemGrid({
  items,
  isLoading,
  onAddItem,
  onCustomizeItem,
}: ItemGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="mt-4 h-12 w-full rounded-lg" />
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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onAdd={() => onAddItem(item)}
          onCustomize={() => onCustomizeItem(item)}
        />
      ))}
    </div>
  );
}
