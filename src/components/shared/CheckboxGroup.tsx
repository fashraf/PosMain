import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TooltipInfo } from "./TooltipInfo";
import { cn } from "@/lib/utils";

interface CheckboxOption {
  id: string;
  label: string;
  tooltip?: string;
}

interface CheckboxGroupProps {
  label?: string;
  options: CheckboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  tooltip?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CheckboxGroup({
  label,
  options,
  value,
  onChange,
  tooltip,
  columns = 3,
  className,
}: CheckboxGroupProps) {
  const handleChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionId]);
    } else {
      onChange(value.filter((id) => id !== optionId));
    }
  };

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium">{label}</Label>
          {tooltip && <TooltipInfo content={tooltip} />}
        </div>
      )}
      <div className={cn("grid gap-2", gridCols[columns])}>
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <Checkbox
              id={option.id}
              checked={value.includes(option.id)}
              onCheckedChange={(checked) => handleChange(option.id, !!checked)}
            />
            <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
              {option.label}
            </Label>
            {option.tooltip && <TooltipInfo content={option.tooltip} />}
          </div>
        ))}
      </div>
    </div>
  );
}
