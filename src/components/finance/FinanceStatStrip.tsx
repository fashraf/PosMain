interface StatItem {
  label: string;
  value: string;
  description?: string;
  color?: string;
}

interface FinanceStatStripProps {
  stats: StatItem[];
}

export function FinanceStatStrip({ stats }: FinanceStatStripProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
          <div className="text-2xl font-bold mt-1" style={{ color: s.color || "hsl(var(--foreground))" }}>
            {s.value}
          </div>
          {s.description && <p className="text-[11px] text-muted-foreground mt-1">{s.description}</p>}
        </div>
      ))}
    </div>
  );
}
