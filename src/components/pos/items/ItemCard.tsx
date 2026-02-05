import React from "react";
import { cn } from "@/lib/utils";
import { ItemImage } from "@/components/pos/shared";
import { TouchButton } from "@/components/pos/shared";
import { Plus, Pencil } from "lucide-react";
import type { POSMenuItem } from "@/lib/pos/types";

interface ItemCardProps {
  item: POSMenuItem;
  onAdd: () => void;
  onCustomize: () => void;
}

export function ItemCard({ item, onAdd, onCustomize }: ItemCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card p-4",
        "min-w-[180px] touch-manipulation",
        "active:bg-accent/30 transition-colors"
      )}
    >
      {/* Header with image and info */}
      <div className="flex items-start gap-3">
        <ItemImage src={item.image_url} alt={item.name_en} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight truncate">
            {item.name_en}
          </h3>
          <p className="mt-1 text-base font-semibold text-primary">
            Rs. {item.base_price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-2">
        <TouchButton
          onClick={onAdd}
          className="h-12 flex-1 text-sm"
        >
          <Plus className="h-4 w-4" />
          ADD
        </TouchButton>

        {item.is_customizable && (
          <TouchButton
            onClick={onCustomize}
            variant="outline"
            className="h-12 flex-1 text-sm"
          >
            <Pencil className="h-4 w-4" />
            CUSTOMIZE
          </TouchButton>
        )}
      </div>
    </div>
  );
}
