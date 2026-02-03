import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ViewDetailsModal } from "@/components/shared/ViewDetailsModal";
import { Plus, Search, Eye, Edit, Tag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  time_slots: string[];
  order_types: string[];
  aggregators: string[];
  sort_order: number;
  is_active: boolean;
}

// Mock data
const mockCategories: Category[] = [
  {
    id: "1",
    name_en: "Breakfast",
    name_ar: "إفطار",
    name_ur: "ناشتہ",
    time_slots: ["breakfast"],
    order_types: ["dine_in", "takeaway"],
    aggregators: [],
    sort_order: 1,
    is_active: true,
  },
  {
    id: "2",
    name_en: "Lunch Specials",
    name_ar: "عروض الغداء",
    name_ur: "دوپہر کے خاص پکوان",
    time_slots: ["lunch"],
    order_types: ["dine_in", "takeaway", "delivery"],
    aggregators: ["uber_eats", "talabat"],
    sort_order: 2,
    is_active: true,
  },
  {
    id: "3",
    name_en: "Dinner",
    name_ar: "عشاء",
    name_ur: "رات کا کھانا",
    time_slots: ["dinner"],
    order_types: ["dine_in", "takeaway", "delivery"],
    aggregators: ["uber_eats", "talabat", "jahez"],
    sort_order: 3,
    is_active: true,
  },
  {
    id: "4",
    name_en: "All Day Menu",
    name_ar: "قائمة طوال اليوم",
    name_ur: "سارے دن کا مینو",
    time_slots: ["breakfast", "lunch", "dinner"],
    order_types: ["dine_in", "takeaway"],
    aggregators: [],
    sort_order: 4,
    is_active: false,
  },
];

export default function Categories() {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState(mockCategories);
  const [viewCategory, setViewCategory] = useState<Category | null>(null);

  const getLocalizedName = (category: Category) => {
    const nameKey = `name_${currentLanguage}` as keyof Category;
    return (category[nameKey] as string) || category.name_en;
  };

  const filteredCategories = categories.filter((category) => {
    const name = getLocalizedName(category).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const handleToggleStatus = (category: Category) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === category.id ? { ...c, is_active: !c.is_active } : c
      )
    );
  };

  const getTimeSlotBadges = (slots: string[]) => {
    const slotLabels: Record<string, string> = {
      breakfast: t("categories.breakfast"),
      lunch: t("categories.lunch"),
      dinner: t("categories.dinner"),
    };
    return slots.map((slot) => (
      <Badge key={slot} variant="outline" className="text-xs">
        {slotLabels[slot]}
      </Badge>
    ));
  };

  const getOrderTypeBadges = (types: string[]) => {
    const typeLabels: Record<string, string> = {
      dine_in: t("branches.dineIn"),
      takeaway: t("branches.takeaway"),
      delivery: t("branches.delivery"),
    };
    return types.slice(0, 2).map((type) => (
      <Badge key={type} variant="secondary" className="text-xs">
        {typeLabels[type]}
      </Badge>
    ));
  };

  const getViewSections = (category: Category) => [
    {
      title: t("branches.basicInfo"),
      fields: [
        { label: t("common.name") + " (EN)", value: category.name_en },
        { label: t("common.name") + " (AR)", value: category.name_ar },
        { label: t("common.name") + " (UR)", value: category.name_ur },
        { label: t("categories.sortOrder"), value: category.sort_order.toString() },
        { label: t("common.status"), value: <StatusBadge isActive={category.is_active} /> },
      ],
    },
    {
      title: t("categories.timeAvailability"),
      fields: [
        { 
          label: t("categories.availableFor"), 
          value: <div className="flex flex-wrap gap-1">{getTimeSlotBadges(category.time_slots)}</div>
        },
      ],
    },
    {
      title: t("categories.menuAvailability"),
      fields: [
        { 
          label: t("categories.availableForOrderTypes"), 
          value: <div className="flex flex-wrap gap-1">{getOrderTypeBadges(category.order_types)}</div>
        },
        ...(category.aggregators.length > 0 ? [{
          label: t("categories.availableForAggregators"),
          value: <div className="flex flex-wrap gap-1">
            {category.aggregators.map(agg => (
              <Badge key={agg} variant="outline" className="text-xs">
                {t(`branches.${agg === "uber_eats" ? "uberEats" : agg}` as any)}
              </Badge>
            ))}
          </div>
        }] : []),
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t("categories.title")}</h1>
        <Button onClick={() => navigate("/categories/add")} size="sm">
          <Plus className="h-4 w-4 me-1" />
          {t("categories.addCategory")}
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-9"
          />
        </div>
      </div>

      {/* Table or Empty State */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title={t("categories.noCategories")}
          action={
            <Button onClick={() => navigate("/categories/add")}>
              <Plus className="h-4 w-4 me-2" />
              {t("categories.addCategory")}
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">{t("common.name")}</TableHead>
                <TableHead className="font-semibold">{t("categories.timeAvailability")}</TableHead>
                <TableHead className="font-semibold">{t("branches.orderTypes")}</TableHead>
                <TableHead className="font-semibold">{t("categories.sortOrder")}</TableHead>
                <TableHead className="font-semibold">{t("common.status")}</TableHead>
                <TableHead className="font-semibold text-end">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{getLocalizedName(category)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getTimeSlotBadges(category.time_slots)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getOrderTypeBadges(category.order_types)}
                      {category.order_types.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{category.order_types.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{category.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={category.is_active}
                        onCheckedChange={() => handleToggleStatus(category)}
                      />
                      <StatusBadge isActive={category.is_active} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewCategory(category)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/categories/${category.id}/edit`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Details Modal */}
      <ViewDetailsModal
        open={!!viewCategory}
        onOpenChange={(open) => !open && setViewCategory(null)}
        title={viewCategory ? getLocalizedName(viewCategory) : ""}
        sections={viewCategory ? getViewSections(viewCategory) : []}
      />
    </div>
  );
}
