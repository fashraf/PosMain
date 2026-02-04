import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Eye, Pencil } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export interface MaintenanceColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface MaintenanceTableProps<T extends { id: string; is_active?: boolean }> {
  data: T[];
  columns: MaintenanceColumn<T>[];
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  showSerialNumber?: boolean;
  currentPage?: number;
  pageSize?: number;
}

export function MaintenanceTable<T extends { id: string; is_active?: boolean }>({
  data,
  columns,
  onEdit,
  onView,
  onToggleStatus,
  isLoading = false,
  emptyMessage,
  showSerialNumber = true,
  currentPage = 1,
  pageSize = 15,
}: MaintenanceTableProps<T>) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-[13px]">{emptyMessage || t("maintenance.noData")}</p>
        <p className="text-[12px] mt-1">{t("maintenance.addFirst")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-input overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB]">
            {showSerialNumber && (
              <TableHead className="w-12 text-center text-[13px] font-semibold">#</TableHead>
            )}
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className={cn("text-[13px] font-semibold", col.className)}
              >
                {col.header}
              </TableHead>
            ))}
            {(onToggleStatus || onEdit || onView) && (
              <TableHead className="w-32 text-[13px] font-semibold text-center">
                {t("common.actions")}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const serialNumber = (currentPage - 1) * pageSize + index + 1;
            return (
              <TableRow
                key={item.id}
                className={cn(
                  "h-[42px]",
                  index % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]",
                  "hover:bg-[#F3F0FF] transition-colors"
                )}
              >
                {showSerialNumber && (
                  <TableCell className="text-center text-[13px] text-muted-foreground">
                    {serialNumber}
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    className={cn("text-[13px]", col.className)}
                  >
                    {col.render
                      ? col.render(item, index)
                      : String((item as Record<string, unknown>)[col.key as string] ?? "")}
                  </TableCell>
                ))}
                {(onToggleStatus || onEdit || onView) && (
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {onToggleStatus && (
                        <Switch
                          checked={item.is_active ?? false}
                          onCheckedChange={() => onToggleStatus(item)}
                          className="scale-75"
                        />
                      )}
                      {onView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onView(item)}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(item)}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
