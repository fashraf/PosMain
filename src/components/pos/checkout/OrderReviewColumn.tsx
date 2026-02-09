import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TouchButton } from "@/components/pos/shared";
import { Minus, Plus, Pencil } from "lucide-react";
import type { CartItem } from "@/lib/pos/types";

interface OrderReviewColumnProps {
  items: CartItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onEditCustomization: (cartItemId: string) => void;
}

export function OrderReviewColumn({
  items,
  subtotal,
  vatRate,
  vatAmount,
  total,
  onIncrement,
  onDecrement,
  onEditCustomization,
}: OrderReviewColumnProps) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Order Review
      </h3>

      <ScrollArea className="flex-1 -mx-1 px-1">
        <div className="space-y-1">
          {items.map((item, idx) => {
            const hasCustomization =
              item.customization.extras.length > 0 ||
              item.customization.removals.length > 0 ||
              item.customization.replacements.length > 0;

            return (
              <React.Fragment key={item.id}>
                <div className="flex items-start gap-2 py-2">
                  {/* Customization indicator */}
                  {hasCustomization && (
                    <div className="mt-1 h-8 w-1 rounded-full bg-destructive shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold truncate">{item.name}</span>
                      <button
                        onClick={() => onEditCustomization(item.id)}
                        className="shrink-0 p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {item.basePrice.toFixed(2)} SAR
                    </div>

                    {/* Modifier chips */}
                    {hasCustomization && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.customization.removals.map((r) => (
                          <span
                            key={r.id}
                            className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700"
                          >
                            ✕ {r.name}
                          </span>
                        ))}
                        {item.customization.extras.map((e) => (
                          <span
                            key={e.id}
                            className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700"
                          >
                            + {e.name}
                          </span>
                        ))}
                        {item.customization.replacements.map((r) => (
                          <span
                            key={r.id}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700"
                          >
                            ↔ {r.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quantity stepper */}
                  <div className="flex items-center gap-1 shrink-0">
                    <TouchButton
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 min-h-[32px] min-w-[32px] rounded-full"
                      onClick={() => onDecrement(item.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </TouchButton>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <TouchButton
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 min-h-[32px] min-w-[32px] rounded-full"
                      onClick={() => onIncrement(item.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </TouchButton>
                  </div>

                  {/* Line total */}
                  <span className="shrink-0 w-16 text-right text-sm font-bold">
                    {item.lineTotal.toFixed(2)}
                  </span>
                </div>

                {idx < items.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-3/4 border-b border-dotted border-border" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </ScrollArea>

      {/* Sticky totals */}
      <div className="mt-auto border-t border-dotted pt-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">VAT ({vatRate}%)</span>
          <span>{vatAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-primary">
          <span>TOTAL</span>
          <span>{total.toFixed(2)} SAR</span>
        </div>
      </div>
    </div>
  );
}
