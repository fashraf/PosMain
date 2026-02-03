import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StatusBadge, YesNoBadge, TypeBadge } from "@/components/shared/StatusBadge";
import { useLanguage } from "@/hooks/useLanguage";
import { Edit, ImageIcon, Eye } from "lucide-react";

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

interface ItemTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onToggleStatus: (item: Item) => void;
  onView?: (item: Item) => void;
}

export function ItemTable({ items, onEdit, onToggleStatus, onView }: ItemTableProps) {
  const { t, currentLanguage } = useLanguage();

  const getLocalizedName = (item: Item) => {
    const nameKey = `name_${currentLanguage}` as keyof Item;
    return (item[nameKey] as string) || item.name_en;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold w-[60px]">{t("items.image")}</TableHead>
            <TableHead className="font-semibold">{t("common.name")}</TableHead>
            <TableHead className="font-semibold">{t("items.itemType")}</TableHead>
            <TableHead className="font-semibold">{t("items.baseCost")}</TableHead>
            <TableHead className="font-semibold">{t("items.isCombo")}</TableHead>
            <TableHead className="font-semibold">{t("common.status")}</TableHead>
            <TableHead className="font-semibold text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={getLocalizedName(item)}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{getLocalizedName(item)}</TableCell>
              <TableCell>
                <TypeBadge
                  type={item.item_type === "edible" ? t("items.edible") : t("items.nonEdible")}
                  variant={item.item_type === "edible" ? "default" : "secondary"}
                />
              </TableCell>
              <TableCell>${item.base_cost.toFixed(2)}</TableCell>
              <TableCell>
                <YesNoBadge value={item.is_combo} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={() => onToggleStatus(item)}
                  />
                  <StatusBadge isActive={item.is_active} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  {onView && (
                    <Button variant="ghost" size="icon" onClick={() => onView(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
