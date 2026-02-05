import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ItemTable, type Item } from "@/components/items/ItemTable";
import { ViewDetailsModal } from "@/components/shared/ViewDetailsModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge, YesNoBadge, TypeBadge } from "@/components/shared/StatusBadge";
import { GridFilters, type FilterConfig } from "@/components/shared/GridFilters";
import { GridPagination } from "@/components/shared/GridPagination";
import { useToast } from "@/components/ui/use-toast";
import { Plus, ShoppingBag, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 15;

export default function Items() {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch items from database
  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ["items-master"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        name_en: item.name_en,
        name_ar: item.name_ar,
        name_ur: item.name_ur,
        description_en: item.description_en,
        description_ar: item.description_ar,
        description_ur: item.description_ur,
        item_type: item.item_type || "edible",
        base_cost: Number(item.base_cost),
        is_combo: item.is_combo,
        image_url: item.image_url,
        is_active: item.is_active,
      })) as Item[];
    },
  });

  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "all",
    type: "all",
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const getLocalizedName = (item: Item) => {
    const nameKey = `name_${currentLanguage}` as keyof Item;
    return (item[nameKey] as string) || item.name_en;
  };

  const getLocalizedDescription = (item: Item) => {
    const descKey = `description_${currentLanguage}` as keyof Item;
    return (item[descKey] as string) || item.description_en || "";
  };

  // Filter definitions
  const filters: FilterConfig[] = [
    {
      key: "status",
      label: t("common.status"),
      options: [
        { value: "all", label: t("grid.allStatuses") },
        { value: "active", label: t("common.active") },
        { value: "inactive", label: t("common.inactive") },
      ],
    },
    {
      key: "type",
      label: t("common.type"),
      options: [
        { value: "all", label: t("grid.allTypes") },
        { value: "edible", label: t("items.edible") },
        { value: "non_edible", label: t("items.nonEdible") },
        { value: "combo", label: t("itemMapping.combo") },
      ],
    },
  ];

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status filter
      if (filterValues.status === "active" && !item.is_active) return false;
      if (filterValues.status === "inactive" && item.is_active) return false;

      // Type filter
      if (filterValues.type === "edible" && item.item_type !== "edible") return false;
      if (filterValues.type === "non_edible" && item.item_type !== "non_edible") return false;
      if (filterValues.type === "combo" && !item.is_combo) return false;

      // Search filter
      if (searchQuery) {
        const name = getLocalizedName(item).toLowerCase();
        if (!name.includes(searchQuery.toLowerCase())) return false;
      }

      return true;
    });
  }, [items, filterValues, searchQuery, currentLanguage]);

  // Sort items
  const sortedItems = useMemo(() => {
    if (!sortConfig) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortConfig.key) {
        case "name":
          aVal = getLocalizedName(a).toLowerCase();
          bVal = getLocalizedName(b).toLowerCase();
          break;
        case "cost":
          aVal = a.base_cost;
          bVal = b.base_cost;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortConfig.dir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortConfig, currentLanguage]);

  // Paginate items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedItems.slice(start, start + PAGE_SIZE);
  }, [sortedItems, currentPage]);

  const totalPages = Math.ceil(sortedItems.length / PAGE_SIZE);

  // Reset to page 1 when filters change
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  const handleAddItem = () => {
    navigate("/items/add");
  };

  const handleEditItem = (item: Item) => {
    navigate(`/items/${item.id}/edit`);
  };

  const handleToggleStatus = async (item: Item) => {
    const { error } = await supabase
      .from("items")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    refetch();
    toast({
      title: item.is_active ? t("common.deactivate") : t("common.activate"),
      description: `${item.name_en} has been ${item.is_active ? "deactivated" : "activated"}.`,
    });
  };

  const handleViewItem = (item: Item) => {
    setViewingItem(item);
  };

  const getViewSections = (item: Item) => [
    {
      title: t("branches.basicInfo"),
      fields: [
        { label: t("common.name") + " (EN)", value: item.name_en, icon: ShoppingBag },
        { label: t("common.name") + " (AR)", value: item.name_ar },
        { label: t("common.name") + " (UR)", value: item.name_ur },
        { label: t("common.description"), value: getLocalizedDescription(item) || "-" },
        { label: t("common.status"), value: <StatusBadge isActive={item.is_active} /> },
      ],
    },
    {
      title: t("items.itemType"),
      fields: [
        {
          label: t("items.itemType"),
          value: (
            <TypeBadge
              type={item.item_type === "edible" ? t("items.edible") : t("items.nonEdible")}
              variant={item.item_type === "edible" ? "default" : "secondary"}
            />
          ),
        },
        { label: t("items.isCombo"), value: <YesNoBadge value={item.is_combo} /> },
      ],
    },
    {
      title: t("common.price"),
      fields: [
        { label: t("items.baseCost"), value: `SAR ${item.base_cost.toFixed(2)}`, icon: DollarSign },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <GridFilters
        title={t("items.title")}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        searchPlaceholder={t("common.search") + "..."}
        searchValue={searchQuery}
        onSearch={handleSearch}
        actionButton={
          <Button onClick={handleAddItem} className="h-9">
            <Plus size={16} strokeWidth={1.5} className="me-1.5" />
            {t("items.addItem")}
          </Button>
        }
      />

      {/* Table */}
      <div className="border border-[#E5E7EB] rounded-md overflow-hidden bg-white">
        {paginatedItems.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={t("common.noData")}
            description={searchQuery ? t("grid.noResults") : t("items.noItems")}
            action={
              !searchQuery && (
                <Button onClick={handleAddItem}>
                  <Plus className="h-4 w-4 me-2" />
                  {t("items.addItem")}
                </Button>
              )
            }
          />
        ) : (
          <ItemTable
            items={paginatedItems}
            startIndex={(currentPage - 1) * PAGE_SIZE}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={handleEditItem}
            onToggleStatus={handleToggleStatus}
            onView={handleViewItem}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <GridPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedItems.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}

      {viewingItem && (
        <ViewDetailsModal
          open={!!viewingItem}
          onOpenChange={() => setViewingItem(null)}
          title={getLocalizedName(viewingItem)}
          sections={getViewSections(viewingItem)}
        />
      )}
    </div>
  );
}
