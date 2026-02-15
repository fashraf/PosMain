import { cn } from "@/lib/utils";

interface PLRow {
  label: string;
  amount: number;
  isBold?: boolean;
  isSubtract?: boolean;
  isResult?: boolean;
}

interface FinancePLCardProps {
  rows: PLRow[];
  currency?: string;
}

export function FinancePLCard({ rows, currency = "SAR" }: FinancePLCardProps) {
  const fmt = (n: number) => `${currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-card border-2 border-dashed border-border rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 text-center font-medium text-sm" style={{ background: "linear-gradient(to right, #e5e7eb, white 40%, white 60%, #e5e7eb)" }}>
        Profit & Loss Summary
      </div>
      <div className="divide-y divide-border">
        {rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-between px-4 py-2",
              row.isResult && "bg-muted/50",
              row.isBold && "font-semibold"
            )}
          >
            <span className={cn("text-sm", row.isSubtract && "pl-4 text-muted-foreground")}>
              {row.isSubtract && "– "}{row.label}
            </span>
            <span className={cn(
              "text-sm tabular-nums font-medium",
              row.amount >= 0 ? "text-emerald-600" : "text-destructive"
            )}>
              {fmt(row.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
