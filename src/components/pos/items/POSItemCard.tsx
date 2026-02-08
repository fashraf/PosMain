import React from "react";
import { cn } from "@/lib/utils";
import { Plus, Settings2 } from "lucide-react";
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
    // Only open details if click is on the card body, not buttons
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    onViewDetails();
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "relative flex flex-col rounded-xl border border-dashed border-border bg-card overflow-hidden",
        "touch-manipulation cursor-pointer",
        "active:scale-[0.98] transition-all duration-100"
      )}
    >
      {/* Customizable badge */}
      {isCustomizable && (
        <div className="absolute top-2 right-2 z-10 rounded-full bg-accent px-2 py-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            Customizable
          </span>
        </div>
      )}

      {/* Image or text-only header */}
      {hasImage ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={item.image_url!}
            alt={item.name_en}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      {/* Info section */}
      <div className={cn("flex flex-1 flex-col p-3", !hasImage && "justify-center py-6")}>
        <h3
          className={cn(
            "font-semibold leading-tight text-card-foreground truncate",
            hasImage ? "text-sm" : "text-base text-center"
          )}
        >
          {item.name_en}
        </h3>
        <p
          className={cn(
            "mt-1 font-bold",
            hasImage ? "text-sm" : "text-base text-center",
            "text-foreground font-bold"
          )}
        >
          Rs. {item.base_price.toFixed(2)}
        </p>
      </div>

      {/* Action buttons */}
      <div className="p-2 pt-0">
        {isCustomizable ? (
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg",
                "bg-primary text-primary-foreground font-semibold text-xs",
                "h-11 active:scale-95 transition-transform duration-100"
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              ADD
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onCustomize(); }}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg",
                "border border-muted-foreground/30 text-muted-foreground font-semibold text-xs",
                "h-11 active:scale-95 transition-transform duration-100"
              )}
            >
              <Settings2 className="h-3.5 w-3.5" />
              CUSTOMIZE
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className={cn(
              "flex w-full items-center justify-center gap-1.5 rounded-lg",
              "bg-primary text-primary-foreground font-semibold text-sm",
              "h-11 active:scale-95 transition-transform duration-100"
            )}
          >
            <Plus className="h-4 w-4" />
            ADD
          </button>
        )}
      </div>
    </div>
  );
}
