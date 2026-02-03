import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
}

export function QuantityControl({
  value,
  onChange,
  min = 0.01,
  step = 0.01,
  unit,
  disabled = false,
}: QuantityControlProps) {
  const handleDecrement = () => {
    const newValue = Math.round((value - step) * 100) / 100;
    onChange(Math.max(min, newValue));
  };

  const handleIncrement = () => {
    const newValue = Math.round((value + step) * 100) / 100;
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        className={cn(
          "p-0.5 text-muted-foreground hover:text-primary transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
      >
        <Minus size={16} strokeWidth={1.5} />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          if (!isNaN(val) && val >= min) {
            onChange(Math.round(val * 100) / 100);
          }
        }}
        className="w-14 h-6 text-center border border-border rounded-[4px] text-[13px] bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        min={min}
        step={step}
        disabled={disabled}
      />
      <button
        type="button"
        className={cn(
          "p-0.5 text-muted-foreground hover:text-primary transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleIncrement}
        disabled={disabled}
      >
        <Plus size={16} strokeWidth={1.5} />
      </button>
      {unit && (
        <span className="text-[13px] text-muted-foreground ms-1">{unit}</span>
      )}
    </div>
  );
}
