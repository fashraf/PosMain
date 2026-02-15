export interface TopSellingItem {
  name: string;
  quantity: number;
  revenue: number;
}

interface Props {
  data: TopSellingItem[];
}

export default function TopSellingItemsCard({ data }: Props) {
  const maxRevenue = data.length > 0 ? data[0].revenue : 1;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Top Selling Items</h3>
      <div className="space-y-2.5">
        {data.length === 0 && (
          <p className="text-xs text-muted-foreground py-4 text-center">No item data available</p>
        )}
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{
                background: i < 3 ? "hsl(199 52% 44% / 0.12)" : "hsl(240 4% 93%)",
                color: i < 3 ? "hsl(199 52% 44%)" : "hsl(240 4% 46%)",
              }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-semibold text-foreground truncate">{item.name}</span>
                <span className="text-[11px] font-bold text-foreground ml-2 shrink-0">
                  SAR {item.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "hsl(240 4% 93%)" }}>
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${Math.round((item.revenue / maxRevenue) * 100)}%`,
                      background: i < 3
                        ? "linear-gradient(90deg, hsl(258 60% 63%), hsl(193 80% 70%))"
                        : "hsl(199 52% 44% / 0.4)",
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {item.quantity} sold
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
