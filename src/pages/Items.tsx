import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ItemTable, type Item } from "@/components/items/ItemTable";
import { ViewDetailsModal } from "@/components/shared/ViewDetailsModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge, YesNoBadge, TypeBadge } from "@/components/shared/StatusBadge";
import { GridFilters, type FilterConfig } from "@/components/shared/GridFilters";
import { GridPagination } from "@/components/shared/GridPagination";
import { useToast } from "@/components/ui/use-toast";
import { Plus, ShoppingBag, DollarSign } from "lucide-react";

// Mock data - expanded for pagination demo
const initialItems: Item[] = [
  { id: "1", name_en: "Margherita Pizza", name_ar: "بيتزا مارغريتا", name_ur: "مارگریٹا پیزا", description_en: "Classic pizza with tomato and mozzarella", description_ar: "بيتزا كلاسيكية مع الطماطم والموزاريلا", description_ur: "ٹماٹر اور موزاریلا کے ساتھ کلاسک پیزا", item_type: "edible", base_cost: 12.99, is_combo: false, image_url: null, is_active: true },
  { id: "2", name_en: "Chicken Burger", name_ar: "برجر دجاج", name_ur: "چکن برگر", description_en: "Juicy chicken patty with fresh vegetables", description_ar: "قطعة دجاج عصيرية مع خضروات طازجة", description_ur: "تازہ سبزیوں کے ساتھ رسیلی چکن پیٹی", item_type: "edible", base_cost: 8.99, is_combo: false, image_url: null, is_active: true },
  { id: "3", name_en: "Family Meal Combo", name_ar: "كومبو وجبة عائلية", name_ur: "فیملی میل کومبو", description_en: "2 pizzas, 4 burgers, and drinks", description_ar: "2 بيتزا، 4 برجر، ومشروبات", description_ur: "2 پیزا، 4 برگر، اور مشروبات", item_type: "edible", base_cost: 45.99, is_combo: true, image_url: null, is_active: true },
  { id: "4", name_en: "Paper Napkins", name_ar: "مناديل ورقية", name_ur: "کاغذی نیپکن", description_en: "Pack of 100 napkins", description_ar: "عبوة من 100 منديل", description_ur: "100 نیپکن کا پیک", item_type: "non_edible", base_cost: 2.99, is_combo: false, image_url: null, is_active: false },
  { id: "5", name_en: "Pepperoni Pizza", name_ar: "بيتزا بيبروني", name_ur: "پیپرونی پیزا", description_en: "Pizza with pepperoni and cheese", description_ar: "بيتزا مع بيبروني وجبن", description_ur: "پیپرونی اور پنیر کے ساتھ پیزا", item_type: "edible", base_cost: 14.99, is_combo: false, image_url: null, is_active: true },
  { id: "6", name_en: "Beef Burger", name_ar: "برجر لحم", name_ur: "بیف برگر", description_en: "Premium beef patty with sauce", description_ar: "قطعة لحم فاخرة مع صلصة", description_ur: "سوس کے ساتھ پریمیم بیف پیٹی", item_type: "edible", base_cost: 11.99, is_combo: false, image_url: null, is_active: true },
  { id: "7", name_en: "Caesar Salad", name_ar: "سلطة سيزر", name_ur: "سیزر سلاد", description_en: "Fresh romaine with Caesar dressing", description_ar: "خس طازج مع صلصة سيزر", description_ur: "سیزر ڈریسنگ کے ساتھ تازہ رومین", item_type: "edible", base_cost: 7.99, is_combo: false, image_url: null, is_active: true },
  { id: "8", name_en: "French Fries", name_ar: "بطاطس مقلية", name_ur: "فرینچ فرائز", description_en: "Crispy golden fries", description_ar: "بطاطس مقلية مقرمشة", description_ur: "کرسپی گولڈن فرائز", item_type: "edible", base_cost: 4.99, is_combo: false, image_url: null, is_active: true },
  { id: "9", name_en: "Chocolate Cake", name_ar: "كعكة شوكولاتة", name_ur: "چاکلیٹ کیک", description_en: "Rich chocolate layer cake", description_ar: "كعكة شوكولاتة غنية", description_ur: "امیر چاکلیٹ لیئر کیک", item_type: "edible", base_cost: 6.99, is_combo: false, image_url: null, is_active: true },
  { id: "10", name_en: "Cola Drink", name_ar: "مشروب كولا", name_ur: "کولا ڈرنک", description_en: "Refreshing cola beverage", description_ar: "مشروب كولا منعش", description_ur: "تازگی بخش کولا مشروب", item_type: "edible", base_cost: 2.49, is_combo: false, image_url: null, is_active: true },
  { id: "11", name_en: "BBQ Wings", name_ar: "أجنحة باربكيو", name_ur: "بی بی کیو ونگز", description_en: "Spicy BBQ chicken wings", description_ar: "أجنحة دجاج باربكيو حارة", description_ur: "مسالہ دار بی بی کیو چکن ونگز", item_type: "edible", base_cost: 9.99, is_combo: false, image_url: null, is_active: true },
  { id: "12", name_en: "Garlic Bread", name_ar: "خبز بالثوم", name_ur: "گارلک بریڈ", description_en: "Toasted bread with garlic butter", description_ar: "خبز محمص بزبدة الثوم", description_ur: "لہسن مکھن کے ساتھ ٹوسٹ روٹی", item_type: "edible", base_cost: 3.99, is_combo: false, image_url: null, is_active: true },
  { id: "13", name_en: "Veggie Supreme Pizza", name_ar: "بيتزا الخضار", name_ur: "ویجی سپریم پیزا", description_en: "Loaded with fresh vegetables", description_ar: "محملة بالخضروات الطازجة", description_ur: "تازہ سبزیوں سے بھری ہوئی", item_type: "edible", base_cost: 13.99, is_combo: false, image_url: null, is_active: true },
  { id: "14", name_en: "Fish & Chips", name_ar: "سمك وبطاطس", name_ur: "فش اینڈ چپس", description_en: "Crispy fish with fries", description_ar: "سمك مقرمش مع البطاطس", description_ur: "فرائز کے ساتھ کرسپی مچھلی", item_type: "edible", base_cost: 15.99, is_combo: false, image_url: null, is_active: true },
  { id: "15", name_en: "Chicken Wrap", name_ar: "راب دجاج", name_ur: "چکن ریپ", description_en: "Grilled chicken in tortilla", description_ar: "دجاج مشوي في تورتيلا", description_ur: "ٹورٹیلا میں گرلڈ چکن", item_type: "edible", base_cost: 8.49, is_combo: false, image_url: null, is_active: true },
  { id: "16", name_en: "Mozzarella Sticks", name_ar: "أصابع موزاريلا", name_ur: "موزاریلا سٹکس", description_en: "Fried mozzarella cheese sticks", description_ar: "أصابع جبن موزاريلا مقلية", description_ur: "تلی ہوئی موزاریلا پنیر سٹکس", item_type: "edible", base_cost: 5.99, is_combo: false, image_url: null, is_active: true },
  { id: "17", name_en: "Party Platter", name_ar: "طبق الحفلات", name_ur: "پارٹی پلیٹر", description_en: "Assorted appetizers for sharing", description_ar: "مقبلات متنوعة للمشاركة", description_ur: "بانٹنے کے لیے مختلف ایپیٹائزرز", item_type: "edible", base_cost: 55.99, is_combo: true, image_url: null, is_active: true },
  { id: "18", name_en: "Ice Cream Sundae", name_ar: "صنداي آيس كريم", name_ur: "آئس کریم سنڈے", description_en: "Vanilla ice cream with toppings", description_ar: "آيس كريم فانيلا مع إضافات", description_ur: "ٹاپنگز کے ساتھ ونیلا آئس کریم", item_type: "edible", base_cost: 4.49, is_combo: false, image_url: null, is_active: true },
  { id: "19", name_en: "Plastic Forks", name_ar: "شوك بلاستيكية", name_ur: "پلاسٹک فورکس", description_en: "Pack of 50 disposable forks", description_ar: "عبوة من 50 شوكة للاستخدام مرة واحدة", description_ur: "50 ڈسپوزایبل فورکس کا پیک", item_type: "non_edible", base_cost: 1.99, is_combo: false, image_url: null, is_active: true },
  { id: "20", name_en: "Take-out Boxes", name_ar: "صناديق التوصيل", name_ur: "ٹیک آؤٹ باکسز", description_en: "Eco-friendly packaging boxes", description_ar: "صناديق تغليف صديقة للبيئة", description_ur: "ماحول دوست پیکیجنگ باکسز", item_type: "non_edible", base_cost: 0.49, is_combo: false, image_url: null, is_active: true },
];

const PAGE_SIZE = 15;

export default function Items() {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [items, setItems] = useState<Item[]>(initialItems);
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

  const handleToggleStatus = (item: Item) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_active: !i.is_active } : i))
    );
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
