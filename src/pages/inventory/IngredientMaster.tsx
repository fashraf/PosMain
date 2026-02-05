import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Carrot, Eye, Pencil, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

export default function IngredientMaster() {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch ingredients from database
  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ["ingredients-master-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ingredients")
        .select("*, units(symbol, name_en)")
        .order("name_en");
      if (error) throw error;
      return data || [];
    },
  });

  const getIngredientName = (item: typeof ingredients[0]) => {
    switch (currentLanguage) {
      case "ar":
        return item.name_ar || item.name_en;
      case "ur":
        return item.name_ur || item.name_en;
      default:
        return item.name_en;
    }
  };

  const filteredIngredients = ingredients.filter((item) => {
    const matchesSearch = getIngredientName(item).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && item.is_active) ||
      (statusFilter === "inactive" && !item.is_active);
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
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
                <TableHead>#</TableHead>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("common.unit")}</TableHead>
                <TableHead>{t("ingredients.costPerUnit")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.map((ingredient, index) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{getIngredientName(ingredient)}</TableCell>
                  <TableCell>{ingredient.units?.symbol || "—"}</TableCell>
                  <TableCell>SAR {Number(ingredient.cost_per_unit).toFixed(2)}</TableCell>
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
