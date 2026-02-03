import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface LiveCostSummaryProps {
  comboPrice: number;
  costPrice: number;
  sellingPrice: number;
  profit: number;
}

export function LiveCostSummary({
  comboPrice,
  costPrice,
  sellingPrice,
  profit,
}: LiveCostSummaryProps) {
  const { t } = useLanguage();

  const getProfitColor = () => {
    if (profit > 0) return "text-success";
    if (profit < 0) return "text-destructive";
    return "text-warning";
  };

  return (
    <div className="flex items-center gap-4 h-8 px-2 bg-muted border border-border rounded-[6px] text-[13px]">
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">{t("itemMapping.comboPrice")}:</span>
        <span className="font-medium">SAR {comboPrice.toFixed(2)}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">{t("itemMapping.costPrice")}:</span>
        <span className="font-medium">SAR {costPrice.toFixed(2)}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">{t("itemMapping.sellingPrice")}:</span>
        <span className="font-medium">SAR {sellingPrice.toFixed(2)}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">{t("itemMapping.profit")}:</span>
        <span className={cn("font-bold", getProfitColor())}>
          SAR {profit.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
