import { useState, useEffect } from "react";
import { Clock, RefreshCw, BadgeDollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DASH_TEAL = "#2c8cb4";
const ALL_BRANCHES = "__all__";

function getStatus(hour: number) {
  if (hour >= 12 && hour < 15) return { label: "Peak Lunch", color: "#dc8c3c" };
  if (hour >= 18 && hour < 21) return { label: "Peak Dinner", color: "#dc8c3c" };
  return { label: "Normal", color: "#32c080" };
}

interface Branch {
  id: string;
  name: string;
}

interface Props {
  branches: Branch[];
  selectedBranchId: string | null;
  onBranchChange: (id: string) => void;
  isFetching?: boolean;
}

export default function DashboardHeader({ branches, selectedBranchId, onBranchChange, isFetching }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const status = getStatus(now.getHours());
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const isAll = selectedBranchId === ALL_BRANCHES;
  const branchName = isAll ? "All Branches" : (branches.find((b) => b.id === selectedBranchId)?.name || "Select Branch");

  return (
    <div
      className="rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3"
      style={{ background: `linear-gradient(135deg, ${DASH_TEAL}14, ${DASH_TEAL}08)`, border: `1px solid ${DASH_TEAL}30` }}
    >
      <div className="flex items-center gap-3">
        <Select value={selectedBranchId || ""} onValueChange={onBranchChange}>
          <SelectTrigger className="w-[220px] h-9 text-sm font-semibold" style={{ borderColor: `${DASH_TEAL}40` }}>
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_BRANCHES}>All Branches</SelectItem>
            {branches.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <h1 className="text-base font-bold tracking-tight hidden sm:block" style={{ color: DASH_TEAL }}>
          {branchName} — Dashboard
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        {isFetching && <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {dateStr} &middot; {timeStr}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <BadgeDollarSign className="h-3.5 w-3.5" />
          SAR
        </span>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: status.color }}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}
