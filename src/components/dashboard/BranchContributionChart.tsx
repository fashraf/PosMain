import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BranchContribution } from "./mockDashboardData";

const TEAL = "#2c8cb4";
const BAR_COLORS = ["#2c8cb4", "#3a9bc3", "#4aaad2", "#64b4e0", "#8ecae6"];

interface Props {
  data: BranchContribution[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-foreground">{d.name}</p>
      <p style={{ color: TEAL }}>SAR {d.revenue.toLocaleString()} ({d.percentage}%)</p>
    </div>
  );
};

export default function BranchContributionChart({ data }: Props) {
  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: TEAL }} />
          Branch Contribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#a09888" tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#a09888" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
