import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface InventoryProgressCardProps {
  currentStock: number;
  maxStock?: number;
  lowStockThreshold: number;
  onCurrentStockChange: (value: number) => void;
  onThresholdChange: (value: number) => void;
}

export function InventoryProgressCard({
  currentStock,
  maxStock = 100,
  lowStockThreshold,
  onCurrentStockChange,
  onThresholdChange,
}: InventoryProgressCardProps) {
  const { t } = useLanguage();
  
  const percentage = Math.min(Math.round((currentStock / maxStock) * 100), 100);

  const getProgressColor = () => {
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      {/* Progress bar with percentage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("items.stockAvailable")}</span>
          <span className={cn("text-lg font-bold", getTextColor())}>
            {percentage}%
          </span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", getProgressColor())}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stock inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t("items.currentStock")}</Label>
          <Input
            type="number"
            min="0"
            value={currentStock}
            onChange={(e) => onCurrentStockChange(parseInt(e.target.value) || 0)}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t("items.lowStockThreshold")}</Label>
          <Input
            type="number"
            min="0"
            value={lowStockThreshold}
            onChange={(e) => onThresholdChange(parseInt(e.target.value) || 0)}
            className="h-9"
          />
        </div>
      </div>
    </div>
  );
}
