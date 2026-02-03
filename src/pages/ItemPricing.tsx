import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { Save, DollarSign, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - items
const mockItems = [
  { id: "1", name_en: "Margherita Pizza", name_ar: "بيتزا مارغريتا", name_ur: "مارگریٹا پیزا", base_cost: 12.99, image_url: null },
  { id: "2", name_en: "Chicken Burger", name_ar: "برجر دجاج", name_ur: "چکن برگر", base_cost: 8.99, image_url: null },
  { id: "3", name_en: "Family Meal Combo", name_ar: "كومبو وجبة عائلية", name_ur: "فیملی میل کومبو", base_cost: 45.99, image_url: null },
  { id: "4", name_en: "Paper Napkins", name_ar: "مناديل ورقية", name_ur: "کاغذی نیپکن", base_cost: 2.99, image_url: null },
];

// Mock data - sales channels
const mockChannels = [
  { id: "1", name_en: "In-Store", name_ar: "في المتجر", name_ur: "اسٹور میں", code: "IN_STORE" },
  { id: "2", name_en: "Zomato", name_ar: "زوماتو", name_ur: "زوماٹو", code: "ZOMATO" },
  { id: "3", name_en: "Swiggy", name_ar: "سويجي", name_ur: "سویگی", code: "SWIGGY" },
  { id: "4", name_en: "Online Website", name_ar: "الموقع الإلكتروني", name_ur: "آن لائن ویب سائٹ", code: "ONLINE" },
];

// Initial pricing data
const initialPricing: Record<string, Record<string, number>> = {
  "1": { "1": 12.99, "2": 14.99, "3": 14.99, "4": 13.99 },
  "2": { "1": 8.99, "2": 10.99, "3": 10.99, "4": 9.99 },
  "3": { "1": 45.99, "2": 52.99, "3": 52.99, "4": 48.99 },
  "4": { "1": 2.99, "2": 2.99, "3": 2.99, "4": 2.99 },
};

export default function ItemPricing() {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();

  const [pricing, setPricing] = useState<Record<string, Record<string, number>>>(initialPricing);
  const [modifiedCells, setModifiedCells] = useState<Set<string>>(new Set());

  const getLocalizedName = (item: { name_en: string; name_ar: string; name_ur: string }) => {
    const key = `name_${currentLanguage}` as keyof typeof item;
    return item[key] || item.name_en;
  };

  const handlePriceChange = (itemId: string, channelId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPricing((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [channelId]: numValue,
      },
    }));
    setModifiedCells((prev) => new Set([...prev, `${itemId}-${channelId}`]));
  };

  const handleSaveAll = () => {
    setModifiedCells(new Set());
    toast({
      title: t("itemPricing.saveAll"),
      description: "All prices have been saved successfully.",
    });
  };

  const isDifferentFromBase = (itemId: string, price: number) => {
    const item = mockItems.find((i) => i.id === itemId);
    return item && Math.abs(price - item.base_cost) > 0.01;
  };

  if (mockItems.length === 0 || mockChannels.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t("itemPricing.title")}</h1>
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={DollarSign}
              title={t("common.noData")}
              description={t("itemPricing.noItems")}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("itemPricing.title")}</h1>
        {modifiedCells.size > 0 && (
          <Button onClick={handleSaveAll}>
            <Save className="h-4 w-4 me-2" />
            {t("itemPricing.saveAll")} ({modifiedCells.size})
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("itemPricing.priceMatrix")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="min-w-[600px]">
              {/* Header Row */}
              <div className="flex border-b bg-muted/50">
                <div className="flex-shrink-0 w-[200px] p-3 font-semibold">
                  {t("common.name")}
                </div>
                <div className="flex-shrink-0 w-[100px] p-3 font-semibold text-center">
                  {t("items.baseCost")}
                </div>
                {mockChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex-shrink-0 w-[120px] p-3 font-semibold text-center"
                  >
                    {getLocalizedName(channel)}
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {mockItems.map((item) => (
                <div key={item.id} className="flex border-b hover:bg-muted/30">
                  {/* Item Name */}
                  <div className="flex-shrink-0 w-[200px] p-3 flex items-center gap-2">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={getLocalizedName(item)}
                        className="h-8 w-8 rounded object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="font-medium truncate">{getLocalizedName(item)}</span>
                  </div>

                  {/* Base Cost */}
                  <div className="flex-shrink-0 w-[100px] p-3 flex items-center justify-center text-muted-foreground">
                    ${item.base_cost.toFixed(2)}
                  </div>

                  {/* Channel Prices */}
                  {mockChannels.map((channel) => {
                    const price = pricing[item.id]?.[channel.id] ?? item.base_cost;
                    const isModified = modifiedCells.has(`${item.id}-${channel.id}`);
                    const isDifferent = isDifferentFromBase(item.id, price);

                    return (
                      <div
                        key={channel.id}
                        className="flex-shrink-0 w-[120px] p-2 flex items-center justify-center"
                      >
                        <div className="relative w-full">
                          <span className="absolute start-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            $
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) =>
                              handlePriceChange(item.id, channel.id, e.target.value)
                            }
                            className={cn(
                              "ps-6 text-center h-9",
                              isModified && "ring-2 ring-primary",
                              isDifferent && !isModified && "bg-accent/50"
                            )}
                          />
                          {isDifferent && (
                            <div
                              className="absolute -top-1 -end-1 h-2 w-2 rounded-full bg-warning"
                              title={t("itemPricing.differsFromBase")}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-warning" />
              <span>{t("itemPricing.differsFromBase")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border-2 border-primary" />
              <span>Modified</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
