import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { StaffListItem } from "./mockDashboardData";

interface Props {
  data: StaffListItem[];
}

export default function CashierDutyTable({ data }: Props) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4" style={{ color: "#2c8cb4" }} />
        <h3 className="text-sm font-semibold" style={{ color: "#2c8cb4" }}>Staff on Duty</h3>
        <span className="ml-auto text-xs text-muted-foreground">{data.length} assigned</span>
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No staff assigned to this branch</p>
      ) : (
        <div className="max-h-[280px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b">
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Emp Code</th>
                <th className="text-right py-2 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s, i) => (
                <tr key={i} className={`border-b last:border-0 hover:bg-muted/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                  <td className="py-2 font-medium text-foreground">{s.name}</td>
                  <td className="py-2 text-muted-foreground">{s.employeeCode}</td>
                  <td className="py-2 text-right">
                    <span
                      className="px-2 py-0.5 rounded-full text-[11px] font-semibold text-white"
                      style={{ backgroundColor: s.isActive ? "#32c080" : "#a09888" }}
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
