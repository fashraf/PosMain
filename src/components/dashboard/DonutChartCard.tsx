import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import type { DonutSegment } from "./mockDashboardData";

interface Props {
  title: string;
  data: DonutSegment[];
  centerLabel?: string;
}

export default function DonutChartCard({ title, data, centerLabel }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <h3 className="text-sm font-semibold mb-3" style={{ color: "#2c8cb4" }}>{title}</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">No data</div>
      ) : (
        <>
          <div className="relative h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={75}
                  dataKey="value"
                  animationDuration={800}
                  stroke="none"
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value, ""]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {centerLabel && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-bold text-foreground">{centerLabel}</span>
              </div>
            )}
          </div>
          <div className="mt-2 space-y-1">
            {data.map((d) => {
              const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
              return (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground truncate">{d.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}
