import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Package, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/hooks/useLanguage";
import { StockLevelBadge, StockLevelLegend } from "@/components/inventory/StockLevelIndicator";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { DataTablePagination } from "@/components/shared/DataTablePagination";

// Mock data for UI prototype
const mockItems = [
  {
    id: "1",
    item_code: "STK001",
    name_en: "Tomatoes",
    name_ar: "طماطم",
    name_ur: "ٹماٹر",
    category: "raw",
    base_unit: "Kg",
    current_stock: 150,
    min_stock_level: 10,
    reorder_level: 25,
    is_active: true,
  },
  {
    id: "2",
    item_code: "STK002",
    name_en: "Flour",
    name_ar: "طحين",
    name_ur: "آٹا",
    category: "raw",
    base_unit: "Kg",
    current_stock: 25,
    min_stock_level: 20,
    reorder_level: 50,
    is_active: true,
  },
  {
    id: "3",
    item_code: "STK003",
    name_en: "Chicken",
    name_ar: "دجاج",
    name_ur: "مرغی",
    category: "raw",
    base_unit: "Kg",
    current_stock: 5,
    min_stock_level: 10,
    reorder_level: 20,
    is_active: true,
  },
];

export default function ItemMaster() {
  const { t, currentLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getItemName = (item: typeof mockItems[0]) => {
    switch (currentLanguage) {
      case "ar":
        return item.name_ar || item.name_en;
      case "ur":
        return item.name_ur || item.name_en;
      default:
        return item.name_en;
    }
  };

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getItemName(item).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && item.is_active) ||
      (statusFilter === "inactive" && !item.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{t("inventory.itemMaster")}</h1>
        </div>
        <Button onClick={() => navigate("/inventory/items/add")}>
          <Plus className="h-4 w-4 me-2" />
          {t("inventory.addStockItem")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("inventory.category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.allBranches")}</SelectItem>
            <SelectItem value="raw">{t("inventory.categoryRaw")}</SelectItem>
            <SelectItem value="semi_prepared">{t("inventory.categorySemiPrepared")}</SelectItem>
            <SelectItem value="finished">{t("inventory.categoryFinished")}</SelectItem>
            <SelectItem value="beverage">{t("inventory.categoryBeverage")}</SelectItem>
            <SelectItem value="non_food">{t("inventory.categoryNonFood")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("common.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.allBranches")}</SelectItem>
            <SelectItem value="active">{t("common.active")}</SelectItem>
            <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t("inventory.noStockItems")}
          description={t("inventory.addFirstStockItem")}
          action={
            <Button onClick={() => navigate("/inventory/items/add")}>
              <Plus className="h-4 w-4 me-2" />
              {t("inventory.addStockItem")}
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("inventory.itemCode")}</TableHead>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("inventory.category")}</TableHead>
                <TableHead>{t("common.unit")}</TableHead>
                <TableHead>{t("inventory.currentStock")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.item_code}</TableCell>
                  <TableCell className="font-medium">{getItemName(item)}</TableCell>
                  <TableCell className="capitalize">{item.category.replace("_", " ")}</TableCell>
                  <TableCell>{item.base_unit}</TableCell>
                  <TableCell>
                    <StockLevelBadge
                      current={item.current_stock}
                      min={item.min_stock_level}
                      reorder={item.reorder_level}
                      unit={item.base_unit}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={item.is_active} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/inventory/items/${item.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Legend */}
      <StockLevelLegend />

      {/* Pagination */}
      <DataTablePagination
        currentPage={1}
        totalPages={1}
        pageSize={10}
        totalItems={filteredItems.length}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    </div>
  );
}
