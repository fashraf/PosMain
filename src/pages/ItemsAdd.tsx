import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiLanguageInput } from "@/components/shared/MultiLanguageInput";
import { ConfirmChangesModal, type Change } from "@/components/shared/ConfirmChangesModal";
import { ArrowLeft, ArrowRight, Save, X, ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ItemsAdd() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    description_en: "",
    description_ar: "",
    description_ur: "",
    item_type: "edible" as "edible" | "non_edible",
    base_cost: 0,
    is_combo: false,
    image_url: null as string | null,
    is_active: true,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
  };

  const handleDescriptionChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`description_${lang}`]: value }));
  };

  const getChanges = (): Change[] => {
    const changes: Change[] = [];
    if (formData.name_en) changes.push({ field: t("common.name") + " (EN)", oldValue: null, newValue: formData.name_en });
    if (formData.name_ar) changes.push({ field: t("common.name") + " (AR)", oldValue: null, newValue: formData.name_ar });
    if (formData.name_ur) changes.push({ field: t("common.name") + " (UR)", oldValue: null, newValue: formData.name_ur });
    changes.push({ field: t("items.itemType"), oldValue: null, newValue: formData.item_type === "edible" ? t("items.edible") : t("items.nonEdible") });
    changes.push({ field: t("items.baseCost"), oldValue: null, newValue: `$${formData.base_cost.toFixed(2)}` });
    changes.push({ field: t("items.isCombo"), oldValue: null, newValue: formData.is_combo ? t("common.yes") : t("common.no") });
    changes.push({ field: t("common.status"), oldValue: null, newValue: formData.is_active ? t("common.active") : t("common.inactive") });
    return changes;
  };

  const handleSave = () => {
    if (!formData.name_en) {
      toast({ title: "Validation Error", description: "Please fill in required fields.", variant: "destructive" });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast({ title: t("items.addItem"), description: `${formData.name_en} has been added.` });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/items");
    }, 500);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/items")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{t("items.addItem")}</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("branches.basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MultiLanguageInput
            label={t("items.itemName")}
            values={{ en: formData.name_en, ar: formData.name_ar, ur: formData.name_ur }}
            onChange={handleNameChange}
            required
          />

          <div className="space-y-2">
            <Label>{t("common.description")} (EN)</Label>
            <Textarea
              value={formData.description_en}
              onChange={(e) => handleDescriptionChange("en", e.target.value)}
              placeholder="Enter description..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("items.itemType")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  setFormData((prev) => ({ ...prev, base_cost: parseFloat(e.target.value) || 0 }))
                }
              />
            </div>
          </div>

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
        </CardContent>
      </Card>

      {/* Image */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("items.image")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 flex flex-col items-center justify-center gap-4">
            {formData.image_url ? (
              <img src={formData.image_url} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
            ) : (
              <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <Button variant="outline" disabled>
              <Upload className="h-4 w-4 me-2" />
              {t("items.uploadImage")}
            </Button>
            <p className="text-sm text-muted-foreground">Image upload coming soon</p>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("common.status")}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 bg-background border-t p-4 z-10",
          "flex items-center gap-3",
          isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4"
        )}
      >
        <div className={cn("flex-1 flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={() => navigate("/items")} disabled={isSaving}>
            <X className="h-4 w-4 me-2" />
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 me-2" />
            {t("common.save")}
          </Button>
        </div>
      </div>

      <ConfirmChangesModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        changes={getChanges()}
        isLoading={isSaving}
      />
    </div>
  );
}
