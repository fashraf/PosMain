import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiLanguageInput } from "@/components/shared/MultiLanguageInput";
import { useLanguage } from "@/hooks/useLanguage";
import { ImageIcon, Upload } from "lucide-react";
import type { Item } from "./ItemTable";

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onSave: (item: Omit<Item, "id"> & { id?: string }) => void;
}

export function ItemDialog({ open, onOpenChange, item, onSave }: ItemDialogProps) {
  const { t } = useLanguage();
  const isEditing = !!item;

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    description_en: null as string | null,
    description_ar: null as string | null,
    description_ur: null as string | null,
    item_type: "edible" as "edible" | "non_edible",
    base_cost: 0,
    is_combo: false,
    image_url: null as string | null,
    is_active: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name_en: item.name_en,
        name_ar: item.name_ar,
        name_ur: item.name_ur,
        description_en: item.description_en,
        description_ar: item.description_ar,
        description_ur: item.description_ur,
        item_type: item.item_type,
        base_cost: item.base_cost,
        is_combo: item.is_combo,
        image_url: item.image_url,
        is_active: item.is_active,
      });
    } else {
      setFormData({
        name_en: "",
        name_ar: "",
        name_ur: "",
        description_en: null,
        description_ar: null,
        description_ur: null,
        item_type: "edible",
        base_cost: 0,
        is_combo: false,
        image_url: null,
        is_active: true,
      });
    }
  }, [item, open]);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const handleDescriptionChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`description_${lang}`]: value || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(item?.id ? { id: item.id } : {}),
      ...formData,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("items.editItem") : t("items.addItem")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <MultiLanguageInput
            label={t("items.itemName")}
            values={{
              en: formData.name_en,
              ar: formData.name_ar,
              ur: formData.name_ur,
            }}
            onChange={handleNameChange}
            required
          />

          <MultiLanguageInput
            label={t("common.description")}
            values={{
              en: formData.description_en || "",
              ar: formData.description_ar || "",
              ur: formData.description_ur || "",
            }}
            onChange={handleDescriptionChange}
            multiline
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("items.itemType")}</Label>
              <Select
                value={formData.item_type}
                onValueChange={(value: "edible" | "non_edible") =>
                  setFormData((prev) => ({ ...prev, item_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edible">{t("items.edible")}</SelectItem>
                  <SelectItem value="non_edible">{t("items.nonEdible")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseCost">{t("items.baseCost")}</Label>
              <Input
                id="baseCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.base_cost}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    base_cost: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Image Upload Placeholder */}
          <div className="space-y-2">
            <Label>{t("items.image")}</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {formData.image_url ? (
                <div className="relative inline-block">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="max-h-32 rounded-md mx-auto"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -end-2"
                    onClick={() => setFormData((prev) => ({ ...prev, image_url: null }))}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                  <p className="text-sm">{t("items.uploadImage")}</p>
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 me-2" />
                    {t("items.uploadImage")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isCombo">{t("items.isCombo")}</Label>
              <Switch
                id="isCombo"
                checked={formData.is_combo}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_combo: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="status">{t("common.status")}</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {formData.is_active ? t("common.active") : t("common.inactive")}
                </span>
                <Switch
                  id="status"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
