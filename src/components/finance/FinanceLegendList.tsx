interface LegendItem {
  label: string;
  value: string | number;
  color: string;
}

interface FinanceLegendListProps {
  items: LegendItem[];
}

export function FinanceLegendList({ items }: FinanceLegendListProps) {
  return (
    <div className="space-y-2.5 py-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-muted-foreground">{item.label}</span>
          <span className="flex-1 border-b border-dotted border-muted-foreground/30 mx-1" />
          <span className="text-xs font-semibold text-foreground tabular-nums">
            {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
