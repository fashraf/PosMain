import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, DollarSign, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  name_en: string;
  name_ar: string | null;
  name_ur: string | null;
  base_cost: number;
  image_url: string | null;
};

type Channel = {
  id: string;
  name_en: string;
  name_ar: string | null;
  name_ur: string | null;
  code: string;
};

export default function ItemPricing() {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();

  const [items, setItems] = useState<Item[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pricing, setPricing] = useState<Record<string, Record<string, number>>>({});
  const [modifiedCells, setModifiedCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const [itemsRes, channelsRes] = await Promise.all([
        supabase.from("items").select("id, name_en, name_ar, name_ur, base_cost, image_url").eq("is_active", true).order("sort_order"),
        supabase.from("sales_channels").select("id, name_en, name_ar, name_ur, code").eq("is_active", true).order("name_en"),
      ]);

      const fetchedItems = (itemsRes.data || []) as Item[];
      const fetchedChannels = (channelsRes.data || []) as Channel[];

      setItems(fetchedItems);
      setChannels(fetchedChannels);

      // Initialize pricing with base_cost for all channel cells
      const initialPricing: Record<string, Record<string, number>> = {};
      fetchedItems.forEach((item) => {
        initialPricing[item.id] = {};
        fetchedChannels.forEach((ch) => {
          initialPricing[item.id][ch.id] = item.base_cost;
        });
      });
      setPricing(initialPricing);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getLocalizedName = (item: { name_en: string; name_ar?: string | null; name_ur?: string | null }) => {
    if (currentLanguage === "ar" && item.name_ar) return item.name_ar;
    if (currentLanguage === "ur" && item.name_ur) return item.name_ur;
    return item.name_en;
  };

  const handlePriceChange = (itemId: string, channelId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPricing((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [channelId]: numValue },
    }));
    setModifiedCells((prev) => new Set([...prev, `${itemId}-${channelId}`]));
  };

  const handleSaveAll = () => {
    setModifiedCells(new Set());
    toast({ title: t("itemPricing.saveAll"), description: "All prices have been saved successfully." });
  };

  const isDifferentFromBase = (itemId: string, price: number) => {
    const item = items.find((i) => i.id === itemId);
    return item && Math.abs(price - item.base_cost) > 0.01;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0 || channels.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t("itemPricing.title")}</h1>
        <Card>
          <CardContent className="pt-6">
            <EmptyState icon={DollarSign} title={t("common.noData")} description={t("itemPricing.noItems")} />
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
                <div className="flex-shrink-0 w-[200px] p-3 font-semibold">{t("common.name")}</div>
                <div className="flex-shrink-0 w-[100px] p-3 font-semibold text-center">{t("items.baseCost")}</div>
                {channels.map((channel) => (
                  <div key={channel.id} className="flex-shrink-0 w-[120px] p-3 font-semibold text-center">
                    {getLocalizedName(channel)}
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {items.map((item) => (
                <div key={item.id} className="flex border-b hover:bg-muted/30">
                  <div className="flex-shrink-0 w-[200px] p-3 flex items-center gap-2">
                    {item.image_url ? (
                      <img src={item.image_url} alt={getLocalizedName(item)} className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="font-medium truncate">{getLocalizedName(item)}</span>
                  </div>
                  <div className="flex-shrink-0 w-[100px] p-3 flex items-center justify-center text-muted-foreground">
                    ${item.base_cost.toFixed(2)}
                  </div>
                  {channels.map((channel) => {
                    const price = pricing[item.id]?.[channel.id] ?? item.base_cost;
                    const isModified = modifiedCells.has(`${item.id}-${channel.id}`);
                    const isDifferent = isDifferentFromBase(item.id, price);
                    return (
                      <div key={channel.id} className="flex-shrink-0 w-[120px] p-2 flex items-center justify-center">
                        <div className="relative w-full">
                          <span className="absolute start-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => handlePriceChange(item.id, channel.id, e.target.value)}
                            className={cn(
                              "ps-6 text-center h-9",
                              isModified && "ring-2 ring-primary",
                              isDifferent && !isModified && "bg-accent/50"
                            )}
                          />
                          {isDifferent && (
                            <div className="absolute -top-1 -end-1 h-2 w-2 rounded-full bg-warning" title={t("itemPricing.differsFromBase")} />
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
