import React from "react";
import { cn } from "@/lib/utils";
import { Plus, Settings2, ImageIcon } from "lucide-react";
import type { POSMenuItem } from "@/lib/pos/types";

interface POSItemCardProps {
  item: POSMenuItem;
  onAdd: () => void;
  onCustomize: () => void;
  onViewDetails: () => void;
}

export function POSItemCard({ item, onAdd, onCustomize, onViewDetails }: POSItemCardProps) {
  const hasImage = !!item.image_url;
  const isCustomizable = !!item.is_customizable;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    onViewDetails();
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "flex flex-col rounded-xl border border-dashed border-border bg-card overflow-hidden",
        "touch-manipulation cursor-pointer",
        "active:scale-[0.98] transition-all duration-100"
      )}
    >
      {/* Top row: image + text */}
      <div className="flex items-center gap-2.5 p-2.5 pb-1.5">
        {/* Small square image */}
        {hasImage && (
          <div className="h-[52px] w-[52px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={item.image_url!}
              alt={item.name_en}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Name + price */}
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold leading-tight text-card-foreground truncate">
              {item.name_en}
            </h3>
          </div>
          <p className="text-base font-bold text-foreground mt-0.5">
            Rs. {item.base_price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-2.5 pb-2 pt-0.5">
        {isCustomizable ? (
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className={cn(
                "flex items-center justify-center gap-1 rounded-lg",
                "bg-primary text-primary-foreground font-semibold text-sm",
                "h-8 active:scale-95 transition-transform duration-100"
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              ADD
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onCustomize(); }}
              className={cn(
                "flex items-center justify-center gap-1 rounded-lg",
                "border border-primary/30 text-primary font-semibold text-sm",
                "h-8 active:scale-95 transition-transform duration-100"
              )}
            >
              <Settings2 className="h-3.5 w-3.5" />
              EDIT
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className={cn(
              "flex w-full items-center justify-center gap-1 rounded-lg",
              "bg-primary text-primary-foreground font-semibold text-sm",
              "h-8 active:scale-95 transition-transform duration-100"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            ADD
          </button>
        )}
      </div>
    </div>
  );
}
