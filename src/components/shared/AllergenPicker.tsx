import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TooltipInfo } from "./TooltipInfo";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { Wheat, Milk, Egg, Fish, Nut, Leaf } from "lucide-react";

const ALLERGENS = [
  { id: "nuts", icon: Nut },
  { id: "dairy", icon: Milk },
  { id: "gluten", icon: Wheat },
  { id: "eggs", icon: Egg },
  { id: "soy", icon: Leaf },
  { id: "shellfish", icon: Fish },
  { id: "wheat", icon: Wheat },
] as const;

export type AllergenType = typeof ALLERGENS[number]["id"];

interface AllergenPickerProps {
  label?: string;
  value: AllergenType[];
  onChange: (value: AllergenType[]) => void;
  tooltip?: string;
  className?: string;
}

export function AllergenPicker({
  label,
  value,
  onChange,
  tooltip,
  className,
}: AllergenPickerProps) {
  const { t } = useLanguage();

  const handleChange = (allergenId: AllergenType, checked: boolean) => {
    if (checked) {
      onChange([...value, allergenId]);
    } else {
      onChange(value.filter((id) => id !== allergenId));
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium">{label}</Label>
          {tooltip && <TooltipInfo content={tooltip} />}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {ALLERGENS.map((allergen) => {
          const isSelected = value.includes(allergen.id);
          const Icon = allergen.icon;
          return (
            <button
              key={allergen.id}
              type="button"
              onClick={() => handleChange(allergen.id, !isSelected)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t(`items.${allergen.id}` as any)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
