import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowRight } from "lucide-react";

interface YieldCalculatorProps {
  baseQty: number;
  yieldPercent: number;
  wastagePercent: number;
  unit?: string;
  className?: string;
}

export function YieldCalculator({
  baseQty,
  yieldPercent,
  wastagePercent,
  unit = "g",
  className,
}: YieldCalculatorProps) {
  const { t, isRTL } = useLanguage();

  // Calculate step by step
  const afterYield = baseQty * (yieldPercent / 100);
  const usableQty = afterYield * (1 - wastagePercent / 100);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm bg-muted/50 rounded-md px-3 py-2",
        isRTL && "flex-row-reverse",
        className
      )}
    >
      <span className="font-medium">
        {baseQty}
        {unit}
      </span>
      <span className="text-muted-foreground">{t("inventory.raw")}</span>
      
      <ArrowRight className="h-3 w-3 text-muted-foreground" />
      
      <span className="font-medium">
        {afterYield.toFixed(1)}
        {unit}
      </span>
      <span className="text-muted-foreground">({yieldPercent}%)</span>
      
      <ArrowRight className="h-3 w-3 text-muted-foreground" />
      
      <span className="font-medium text-primary">
        {usableQty.toFixed(2)}
        {unit}
      </span>
      <span className="text-muted-foreground">{t("inventory.usable")}</span>
    </div>
  );
}

// Compact inline version
export function YieldCalculatorInline({
  baseQty,
  yieldPercent,
  wastagePercent,
  unit = "g",
}: YieldCalculatorProps) {
  const usableQty = baseQty * (yieldPercent / 100) * (1 - wastagePercent / 100);

  return (
    <span className="text-sm">
      <span className="text-muted-foreground">{baseQty}{unit}</span>
      {" → "}
      <span className="font-medium text-primary">{usableQty.toFixed(2)}{unit}</span>
    </span>
  );
}

// Cost calculator based on yield
interface TrueCostProps {
  baseCost: number;
  yieldPercent: number;
  wastagePercent: number;
  currency?: string;
  unit?: string;
}

export function TrueCostDisplay({
  baseCost,
  yieldPercent,
  wastagePercent,
  currency = "$",
  unit = "Kg",
}: TrueCostProps) {
  const { t } = useLanguage();
  
  // True cost increases as yield decreases
  const effectiveYield = (yieldPercent / 100) * (1 - wastagePercent / 100);
  const trueCost = effectiveYield > 0 ? baseCost / effectiveYield : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("inventory.baseCost")}:</span>
        <span>
          {currency}
          {baseCost.toFixed(2)} / {unit}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-muted-foreground">{t("inventory.trueCost")}:</span>
        <span className="text-primary">
          {currency}
          {trueCost.toFixed(2)} / {unit}
        </span>
      </div>
    </div>
  );
}
