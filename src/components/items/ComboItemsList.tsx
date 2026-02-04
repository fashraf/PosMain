import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ComboItem {
  name: string;
  quantity: number;
}

interface ComboItemsListProps {
  items: ComboItem[];
}

export function ComboItemsList({ items }: ComboItemsListProps) {
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        {t("items.noComboItems")}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-sm py-1.5 px-2 rounded-md bg-amber-50/50"
        >
          <ArrowRight className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
          <span className="font-medium text-amber-800">
            {item.quantity}x
          </span>
          <span className="text-foreground">{item.name}</span>
        </div>
      ))}
    </div>
  );
}
