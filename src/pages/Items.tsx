import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemTable, type Item } from "@/components/items/ItemTable";
import { ItemDialog } from "@/components/items/ItemDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, ShoppingBag } from "lucide-react";

// Mock data
const initialItems: Item[] = [
  {
    id: "1",
    name_en: "Margherita Pizza",
    name_ar: "بيتزا مارغريتا",
    name_ur: "مارگریٹا پیزا",
    description_en: "Classic pizza with tomato and mozzarella",
    description_ar: "بيتزا كلاسيكية مع الطماطم والموزاريلا",
    description_ur: "ٹماٹر اور موزاریلا کے ساتھ کلاسک پیزا",
    item_type: "edible",
    base_cost: 12.99,
    is_combo: false,
    image_url: null,
    is_active: true,
  },
  {
    id: "2",
    name_en: "Chicken Burger",
    name_ar: "برجر دجاج",
    name_ur: "چکن برگر",
    description_en: "Juicy chicken patty with fresh vegetables",
    description_ar: "قطعة دجاج عصيرية مع خضروات طازجة",
    description_ur: "تازہ سبزیوں کے ساتھ رسیلی چکن پیٹی",
    item_type: "edible",
    base_cost: 8.99,
    is_combo: false,
    image_url: null,
    is_active: true,
  },
  {
    id: "3",
    name_en: "Family Meal Combo",
    name_ar: "كومبو وجبة عائلية",
    name_ur: "فیملی میل کومبو",
    description_en: "2 pizzas, 4 burgers, and drinks",
    description_ar: "2 بيتزا، 4 برجر، ومشروبات",
    description_ur: "2 پیزا، 4 برگر، اور مشروبات",
    item_type: "edible",
    base_cost: 45.99,
    is_combo: true,
    image_url: null,
    is_active: true,
  },
  {
    id: "4",
    name_en: "Paper Napkins",
    name_ar: "مناديل ورقية",
    name_ur: "کاغذی نیپکن",
    description_en: "Pack of 100 napkins",
    description_ar: "عبوة من 100 منديل",
    description_ur: "100 نیپکن کا پیک",
    item_type: "non_edible",
    base_cost: 2.99,
    is_combo: false,
    image_url: null,
    is_active: true,
  },
];

export default function Items() {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();

  const [items, setItems] = useState<Item[]>(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const nameKey = `name_${currentLanguage}` as keyof Item;
      const name = (item[nameKey] as string) || item.name_en;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [items, searchQuery, currentLanguage]);

  const handleAddItem = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setDialogOpen(true);
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

  const handleSaveItem = (itemData: Omit<Item, "id"> & { id?: string }) => {
    if (itemData.id) {
      setItems((prev) =>
        prev.map((i) => (i.id === itemData.id ? { ...i, ...itemData } as Item : i))
      );
      toast({
        title: t("items.editItem"),
        description: `${itemData.name_en} has been updated.`,
      });
    } else {
      const newItem: Item = {
        ...itemData,
        id: Date.now().toString(),
      };
      setItems((prev) => [...prev, newItem]);
      toast({
        title: t("items.addItem"),
        description: `${itemData.name_en} has been added.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("items.title")}</h1>
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4 me-2" />
          {t("items.addItem")}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredItems.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title={t("common.noData")}
              description={searchQuery ? "No items match your search." : t("items.noItems")}
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
              items={filteredItems}
              onEdit={handleEditItem}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </CardContent>
      </Card>

      <ItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSave={handleSaveItem}
      />
    </div>
  );
}
