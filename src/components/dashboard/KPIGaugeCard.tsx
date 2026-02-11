import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { KPIData } from "./mockDashboardData";

interface Props {
  data: KPIData;
}

export default function KPIGaugeCard({ data }: Props) {
  const chartData = [
    { value: 100, fill: "#e5e7eb" },
    { value: data.percentage, fill: data.color },
  ];

  return (
    <Card className="p-4 hover:shadow-md transition-shadow border-border">
      <div className="flex items-start gap-3">
        {/* Gauge ring */}
        <div className="w-16 h-16 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="70%" outerRadius="100%"
              startAngle={90} endAngle={-270}
              data={chartData}
              barSize={6}
            >
              <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "#f3f4f6" }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">{data.label}</p>
          <p className="text-xl font-bold text-foreground mt-0.5">{data.value}</p>
          <div className="flex items-center gap-1 mt-1">
            {data.trendDirection === "up" ? (
              <ArrowUp className="h-3 w-3" style={{ color: "#32c080" }} />
            ) : (
              <ArrowDown className="h-3 w-3" style={{ color: "#dc8c3c" }} />
            )}
            <span className="text-[11px]" style={{ color: data.trendDirection === "up" ? "#32c080" : "#dc8c3c" }}>
              {data.trend}
            </span>
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: "#a09888" }}>{data.targetLabel}</p>
        </div>
      </div>
    </Card>
  );
}
