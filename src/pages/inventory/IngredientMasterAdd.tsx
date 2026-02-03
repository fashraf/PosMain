import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carrot, Link2, Calculator, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { PageFormLayout } from "@/components/shared/PageFormLayout";
import { FormSectionCard } from "@/components/shared/FormSectionCard";
import { FormField } from "@/components/shared/FormField";
import { FormRow } from "@/components/shared/FormRow";
import { CompactMultiLanguageInput } from "@/components/shared/CompactMultiLanguageInput";
import { CompactRadioGroup } from "@/components/shared/CompactRadioGroup";
import { InventoryItemPicker } from "@/components/inventory/InventoryItemPicker";
import { YieldCalculator, TrueCostDisplay } from "@/components/inventory/YieldCalculator";

const units = ["Kg", "g", "L", "mL", "Piece"];

// Mock inventory items for picker
const mockInventoryItems = [
  {
    id: "1",
    item_code: "STK001",
    name_en: "Tomatoes",
    name_ar: "طماطم",
    name_ur: "ٹماٹر",
    current_stock: 150,
    min_stock_level: 10,
    reorder_level: 25,
    base_unit: "Kg",
    cost_price: 5.0,
  },
  {
    id: "2",
    item_code: "STK002",
    name_en: "Flour",
    name_ar: "طحين",
    name_ur: "آٹا",
    current_stock: 25,
    min_stock_level: 20,
    reorder_level: 50,
    base_unit: "Kg",
    cost_price: 2.0,
  },
];

export default function IngredientMasterAdd() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [names, setNames] = useState({ en: "", ar: "", ur: "" });
  const [linkedItemId, setLinkedItemId] = useState("");
  const [defaultUnit, setDefaultUnit] = useState("");
  const [preparationType, setPreparationType] = useState("raw");
  const [yieldPercentage, setYieldPercentage] = useState("100");
  const [wastagePercentage, setWastagePercentage] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setNames((prev) => ({ ...prev, [lang]: value }));
  };

  const linkedItem = mockInventoryItems.find((i) => i.id === linkedItemId);
  const baseCost = linkedItem?.cost_price || 0;
  const yieldNum = parseFloat(yieldPercentage) || 100;
  const wastageNum = parseFloat(wastagePercentage) || 0;

  const handleSave = async () => {
    if (!names.en || !defaultUnit) {
      toast({
        title: t("common.error"),
        description: t("common.fillRequired"),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);

    toast({
      title: t("common.success"),
      description: t("inventory.ingredientCreated"),
    });
    navigate("/inventory/ingredients");
  };

  const sections = [
    {
      title: t("branches.basicInfo"),
      children: (
        <FormSectionCard title={t("branches.basicInfo")} icon={Carrot}>
          <FormRow columns={2}>
            <FormField label={t("inventory.ingredientName")} required>
              <CompactMultiLanguageInput
                label={t("inventory.ingredientName")}
                values={names}
                onChange={handleNameChange}
              />
            </FormField>
            <FormField label={t("inventory.linkedItem")} tooltip={t("tooltips.linkedItem")}>
              <InventoryItemPicker
                value={linkedItemId}
                onChange={setLinkedItemId}
                items={mockInventoryItems}
                showStock
              />
            </FormField>
          </FormRow>
          <FormRow columns={2} divider>
            <FormField label={t("common.unit")} required>
              <Select value={defaultUnit} onValueChange={setDefaultUnit}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.selectItem")} />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label={t("inventory.preparationType")}>
              <CompactRadioGroup
                value={preparationType}
                onChange={setPreparationType}
                options={[
                  { value: "raw", label: t("inventory.prepRaw") },
                  { value: "cooked", label: t("inventory.prepCooked") },
                  { value: "marinated", label: t("inventory.prepMarinated") },
                ]}
              />
            </FormField>
          </FormRow>
        </FormSectionCard>
      ),
    },
    {
      title: t("inventory.yieldWastage"),
      children: (
        <FormSectionCard title={t("inventory.yieldWastage")} icon={Calculator}>
          <FormRow columns={2}>
            <FormField label={t("inventory.yieldPercentage")} tooltip={t("tooltips.yield")}>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={yieldPercentage}
                  onChange={(e) => setYieldPercentage(e.target.value)}
                  placeholder="85"
                  min="0"
                  max="100"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </FormField>
            <FormField label={t("inventory.wastagePercentage")} tooltip={t("tooltips.wastage")}>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={wastagePercentage}
                  onChange={(e) => setWastagePercentage(e.target.value)}
                  placeholder="5"
                  min="0"
                  max="100"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </FormField>
          </FormRow>
          <FormRow divider>
            <FormField label={t("inventory.usableQuantity")}>
              <YieldCalculator
                baseQty={100}
                yieldPercent={yieldNum}
                wastagePercent={wastageNum}
                unit={defaultUnit || "g"}
              />
            </FormField>
          </FormRow>
        </FormSectionCard>
      ),
    },
    {
      title: t("inventory.costCalculation"),
      children: (
        <FormSectionCard title={t("inventory.costCalculation")} icon={DollarSign}>
          {linkedItem ? (
            <TrueCostDisplay
              baseCost={baseCost}
              yieldPercent={yieldNum}
              wastagePercent={wastageNum}
              currency="$"
              unit={defaultUnit || "Kg"}
            />
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {t("inventory.linkItemForCost")}
            </p>
          )}
        </FormSectionCard>
      ),
    },
  ];

  return (
    <PageFormLayout
      title={t("inventory.addIngredient")}
      sections={sections}
      onCancel={() => navigate("/inventory/ingredients")}
      onSave={handleSave}
      isSaving={isSaving}
      backPath="/inventory/ingredients"
    />
  );
}
