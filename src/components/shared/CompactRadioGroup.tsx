import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TooltipInfo } from "./TooltipInfo";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface CompactRadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  tooltip?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function CompactRadioGroup({
  label,
  options,
  value,
  onChange,
  tooltip,
  orientation = "vertical",
  className,
}: CompactRadioGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium">{label}</Label>
          {tooltip && <TooltipInfo content={tooltip} />}
        </div>
      )}
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={cn(
          orientation === "horizontal"
            ? "flex flex-wrap gap-4"
            : "space-y-2"
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-2">
            <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
            <div className="grid gap-0.5">
              <Label htmlFor={option.value} className="text-sm font-normal cursor-pointer">
                {option.label}
              </Label>
              {option.description && (
                <p className="text-xs text-muted-foreground">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
