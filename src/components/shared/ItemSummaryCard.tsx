import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { FileText, Tag, DollarSign, Carrot, Package } from "lucide-react";

interface ItemSummaryCardProps {
  name: string;
  category: string;
  baseCost: number;
  ingredientCount: number;
  itemCount: number;
  isCombo: boolean;
}

export function ItemSummaryCard({
  name,
  category,
  baseCost,
  ingredientCount,
  itemCount,
  isCombo,
}: ItemSummaryCardProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-3 bg-muted/20">
      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5" />
        Quick Summary
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
              <FileText className="h-2.5 w-2.5 text-primary" />
            </span>
            Name:
          </span>
          <span className="font-medium truncate max-w-[120px]">{name || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-green-500/10 flex items-center justify-center">
              <Tag className="h-2.5 w-2.5 text-green-600" />
            </span>
            Category:
          </span>
          <span className="font-medium">{category || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="h-2.5 w-2.5 text-blue-600" />
            </span>
            Price:
          </span>
          <span className="font-medium text-primary">SAR {baseCost.toFixed(2)}</span>
        </div>
        <div className="border-t border-dashed pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-orange-500/10 flex items-center justify-center">
                <Carrot className="h-2.5 w-2.5 text-orange-600" />
              </span>
              Ingredients:
            </span>
            <span className={cn(
              "font-medium px-2 py-0.5 rounded-full text-xs",
              ingredientCount > 0 
                ? "bg-green-100 text-green-700" 
                : "bg-muted text-muted-foreground"
            )}>
              {ingredientCount}
            </span>
          </div>
          {isCombo && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-amber-500/10 flex items-center justify-center">
                  <Package className="h-2.5 w-2.5 text-amber-600" />
                </span>
                Items:
              </span>
              <span className={cn(
                "font-medium px-2 py-0.5 rounded-full text-xs",
                itemCount > 0 
                  ? "bg-green-100 text-green-700" 
                  : "bg-muted text-muted-foreground"
              )}>
                {itemCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
