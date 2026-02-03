import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { GridStatusBadge } from "@/components/shared/GridStatusBadge";
import { GridActionButtons } from "@/components/shared/GridActionButtons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/hooks/useLanguage";
import {
  ImageIcon,
  Package,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Item {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  description_en: string | null;
  description_ar: string | null;
  description_ur: string | null;
  item_type: "edible" | "non_edible";
  base_cost: number;
  is_combo: boolean;
  image_url: string | null;
  is_active: boolean;
}

interface SortConfig {
  key: string;
  dir: "asc" | "desc";
}

interface ItemTableProps {
  items: Item[];
  startIndex?: number;
  sortConfig?: SortConfig | null;
  onSort?: (key: string) => void;
  onEdit: (item: Item) => void;
  onToggleStatus: (item: Item) => void;
  onView?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

export function ItemTable({
  items,
  startIndex = 0,
  sortConfig,
  onSort,
  onEdit,
  onToggleStatus,
  onView,
  onDelete,
}: ItemTableProps) {
  const { t, currentLanguage } = useLanguage();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const getLocalizedName = (item: Item) => {
    const nameKey = `name_${currentLanguage}` as keyof Item;
    return (item[nameKey] as string) || item.name_en;
  };

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderSortIcon = (key: string) => {
    if (!onSort) return null;
    const isActive = sortConfig?.key === key;
    return (
      <span className="inline-flex ml-1">
        {isActive && sortConfig?.dir === "asc" ? (
          <ChevronUp size={14} strokeWidth={1.5} className="text-[#8B5CF6]" />
        ) : isActive && sortConfig?.dir === "desc" ? (
          <ChevronDown size={14} strokeWidth={1.5} className="text-[#8B5CF6]" />
        ) : (
          <ChevronDown size={14} strokeWidth={1.5} className="text-[#D1D5DB]" />
        )}
      </span>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-[#F9FAFB]">
            <TableHead className="w-[60px] text-center">#</TableHead>
            <TableHead className="w-[52px]">{t("items.image")}</TableHead>
            <TableHead
              className={cn(
                "min-w-[180px]",
                onSort && "sortable-header",
                sortConfig?.key === "name" && "active"
              )}
              onClick={() => onSort?.("name")}
            >
              {t("common.name")}
              {renderSortIcon("name")}
            </TableHead>
            <TableHead className="w-[100px]">{t("items.itemType")}</TableHead>
            <TableHead
              className={cn(
                "w-[100px] text-right",
                onSort && "sortable-header",
                sortConfig?.key === "cost" && "active"
              )}
              onClick={() => onSort?.("cost")}
            >
              {t("items.baseCost")}
              {renderSortIcon("cost")}
            </TableHead>
            <TableHead className="w-[50px] text-center">
              {t("items.isCombo")}
            </TableHead>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[90px] text-center">
              {t("common.status")}
            </TableHead>
            <TableHead className="w-[100px] text-right">
              {t("common.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <>
              <TableRow key={item.id}>
                {/* Serial Number */}
                <TableCell className="text-center text-[13px] text-[#6B7280]">
                  {startIndex + index + 1}
                </TableCell>

                {/* Image */}
                <TableCell>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={getLocalizedName(item)}
                      className="h-9 w-9 rounded object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded bg-[#F3F4F6] flex items-center justify-center">
                      <ImageIcon size={16} strokeWidth={1.5} className="text-[#9CA3AF]" />
                    </div>
                  )}
                </TableCell>

                {/* Name */}
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium text-[#111827] truncate block max-w-[200px]">
                        {getLocalizedName(item)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs max-w-[300px]">
                      {getLocalizedName(item)}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>

                {/* Type */}
                <TableCell className="text-[13px] text-[#6B7280]">
                  {item.item_type === "edible" ? t("items.edible") : t("items.nonEdible")}
                </TableCell>

                {/* Cost */}
                <TableCell
                  className={cn(
                    "text-right tabular-nums",
                    item.base_cost > 50 && "font-semibold text-[#111827]"
                  )}
                >
                  SAR {item.base_cost.toFixed(2)}
                </TableCell>

                {/* Is Combo */}
                <TableCell className="text-center">
                  {item.is_combo && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className={cn(
                            "p-1 rounded hover:bg-[#F3F0FF] transition-colors",
                            expandedRows.has(item.id) && "bg-[#F3F0FF]"
                          )}
                          aria-expanded={expandedRows.has(item.id)}
                          aria-label={
                            expandedRows.has(item.id)
                              ? t("grid.collapse")
                              : t("grid.expand")
                          }
                        >
                          <Package
                            size={16}
                            strokeWidth={1.5}
                            className={cn(
                              "text-[#6B7280]",
                              expandedRows.has(item.id) && "text-[#8B5CF6]"
                            )}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {expandedRows.has(item.id)
                          ? t("grid.collapse")
                          : t("grid.expand")}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>

                {/* Warning */}
                <TableCell className="text-center">
                  {/* Placeholder for warning icon if needed */}
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={() => onToggleStatus(item)}
                      className="scale-90"
                    />
                    <GridStatusBadge isActive={item.is_active} />
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <GridActionButtons
                    onView={onView ? () => onView(item) : undefined}
                    onEdit={() => onEdit(item)}
                    onDelete={onDelete ? () => onDelete(item) : undefined}
                  />
                </TableCell>
              </TableRow>

              {/* Expanded Row for Combo Items */}
              {item.is_combo && expandedRows.has(item.id) && (
                <TableRow
                  key={`${item.id}-expanded`}
                  className="bg-[#FAFAFA] hover:bg-[#FAFAFA]"
                >
                  <TableCell colSpan={9} className="py-3 px-6">
                    <div className="pl-6 space-y-1.5 text-[13px] text-[#6B7280]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#9CA3AF]">→</span>
                        <span>2x Margherita Pizza</span>
                        <span className="ml-auto">SAR 12.99 each</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#9CA3AF]">→</span>
                        <span>4x Chicken Burger</span>
                        <span className="ml-auto">SAR 8.99 each</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
