import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Carrot, Eye, Pencil, AlertTriangle } from "lucide-react";
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
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data for UI prototype
const mockIngredients = [
  {
    id: "1",
    name_en: "Diced Tomatoes",
    name_ar: "طماطم مقطعة",
    name_ur: "کٹے ہوئے ٹماٹر",
    linked_item_code: "STK001",
    linked_item_name: "Tomatoes",
    default_unit: "Kg",
    preparation_type: "raw",
    yield_percentage: 85,
    wastage_percentage: 5,
    calculated_cost: 5.88,
    is_active: true,
  },
  {
    id: "2",
    name_en: "Sliced Onions",
    name_ar: "بصل مقطع",
    name_ur: "کٹی ہوئی پیاز",
    linked_item_code: null,
    linked_item_name: null,
    default_unit: "Kg",
    preparation_type: "raw",
    yield_percentage: 90,
    wastage_percentage: 3,
    calculated_cost: null,
    is_active: true,
  },
  {
    id: "3",
    name_en: "Grilled Chicken",
    name_ar: "دجاج مشوي",
    name_ur: "گرلڈ چکن",
    linked_item_code: "STK003",
    linked_item_name: "Chicken",
    default_unit: "Kg",
    preparation_type: "cooked",
    yield_percentage: 75,
    wastage_percentage: 10,
    calculated_cost: 12.50,
    is_active: true,
  },
];

export default function IngredientMaster() {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [prepTypeFilter, setPrepTypeFilter] = useState("all");
  const [linkedFilter, setLinkedFilter] = useState("all");

  const getIngredientName = (item: typeof mockIngredients[0]) => {
    switch (currentLanguage) {
      case "ar":
        return item.name_ar || item.name_en;
      case "ur":
        return item.name_ur || item.name_en;
      default:
        return item.name_en;
    }
  };

  const filteredIngredients = mockIngredients.filter((item) => {
    const matchesSearch = getIngredientName(item).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrepType = prepTypeFilter === "all" || item.preparation_type === prepTypeFilter;
    const matchesLinked =
      linkedFilter === "all" ||
      (linkedFilter === "linked" && item.linked_item_code) ||
      (linkedFilter === "unlinked" && !item.linked_item_code);
    return matchesSearch && matchesPrepType && matchesLinked;
  });

  const unlinkedCount = mockIngredients.filter((i) => !i.linked_item_code).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Carrot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{t("inventory.ingredientMaster")}</h1>
        </div>
        <Button onClick={() => navigate("/inventory/ingredients/add")}>
          <Plus className="h-4 w-4 me-2" />
          {t("inventory.addIngredient")}
        </Button>
      </div>

      {/* Warning for unlinked ingredients */}
      {unlinkedCount > 0 && (
        <Alert variant="destructive" className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("inventory.unlinkedWarning", { count: unlinkedCount })}
          </AlertDescription>
        </Alert>
      )}

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
        <Select value={prepTypeFilter} onValueChange={setPrepTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("inventory.preparationType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.allBranches")}</SelectItem>
            <SelectItem value="raw">{t("inventory.prepRaw")}</SelectItem>
            <SelectItem value="cooked">{t("inventory.prepCooked")}</SelectItem>
            <SelectItem value="marinated">{t("inventory.prepMarinated")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={linkedFilter} onValueChange={setLinkedFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("inventory.linkedItem")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.allBranches")}</SelectItem>
            <SelectItem value="linked">{t("inventory.linked")}</SelectItem>
            <SelectItem value="unlinked">{t("inventory.unlinked")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredIngredients.length === 0 ? (
        <EmptyState
          icon={Carrot}
          title={t("inventory.noIngredients")}
          description={t("inventory.addFirstIngredient")}
          action={
            <Button onClick={() => navigate("/inventory/ingredients/add")}>
              <Plus className="h-4 w-4 me-2" />
              {t("inventory.addIngredient")}
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("inventory.linkedItem")}</TableHead>
                <TableHead>{t("common.unit")}</TableHead>
                <TableHead>{t("inventory.yieldPercentage")}</TableHead>
                <TableHead>{t("inventory.wastagePercentage")}</TableHead>
                <TableHead>{t("inventory.trueCost")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">{getIngredientName(ingredient)}</TableCell>
                  <TableCell>
                    {ingredient.linked_item_code ? (
                      <span className="text-sm">
                        {ingredient.linked_item_code} - {ingredient.linked_item_name}
                      </span>
                    ) : (
                      <Badge variant="outline" className="text-warning border-warning">
                        <AlertTriangle className="h-3 w-3 me-1" />
                        {t("inventory.noLinkedItem")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{ingredient.default_unit}</TableCell>
                  <TableCell>{ingredient.yield_percentage}%</TableCell>
                  <TableCell>{ingredient.wastage_percentage}%</TableCell>
                  <TableCell>
                    {ingredient.calculated_cost ? (
                      <span className="font-medium">${ingredient.calculated_cost.toFixed(2)}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={ingredient.is_active} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/inventory/ingredients/${ingredient.id}/edit`)}
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

      {/* Pagination */}
      <DataTablePagination
        currentPage={1}
        totalPages={1}
        pageSize={10}
        totalItems={filteredIngredients.length}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    </div>
  );
}
