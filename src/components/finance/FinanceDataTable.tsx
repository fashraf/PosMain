import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FinanceColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
}

interface FinanceDataTableProps<T> {
  columns: FinanceColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function FinanceDataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
}: FinanceDataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "asc" ? av - bv : bv - av;
    }
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  return (
    <div className="premium-grid">
      <table className="w-full">
        <thead className="premium-grid-header">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "premium-grid-cell text-xs font-medium text-muted-foreground uppercase tracking-wide",
                  col.sortable && "sortable-header cursor-pointer select-none",
                  sortKey === col.key && "active",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center"
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && <ArrowUpDown className="h-3 w-3" />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={i}
              className={cn("premium-grid-row", onRowClick && "cursor-pointer")}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "premium-grid-cell",
                    col.align === "right" && "premium-grid-cell-number",
                    col.align === "center" && "text-center"
                  )}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="premium-grid-cell text-center text-muted-foreground py-8">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
