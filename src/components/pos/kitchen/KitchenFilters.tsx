import { cn } from "@/lib/utils";

export type KDSFilter = "all" | "urgent" | "dine_in" | "delivery" | "takeaway" | "self_pickup";

interface KitchenFiltersProps {
  active: KDSFilter;
  onChange: (filter: KDSFilter) => void;
}

const filters: { value: KDSFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "urgent", label: "🔴 Urgent" },
  { value: "dine_in", label: "Dine-in" },
  { value: "delivery", label: "Delivery" },
  { value: "takeaway", label: "Takeaway" },
  { value: "self_pickup", label: "Self-pickup" },
];

export function KitchenFilters({ active, onChange }: KitchenFiltersProps) {
  return (
    <div className="flex items-center justify-center gap-2 bg-slate-900 px-4 py-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            "rounded-full px-5 py-2 text-[17px] font-medium transition-all",
            "touch-manipulation select-none",
            active === f.value
              ? "bg-white text-slate-900 shadow-md"
              : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
