import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Ruler, Warehouse, DollarSign, Settings, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
import { AllergenPicker, AllergenType } from "@/components/shared/AllergenPicker";

const categories = [
  { value: "raw", labelKey: "inventory.categoryRaw" },
  { value: "semi_prepared", labelKey: "inventory.categorySemiPrepared" },
  { value: "finished", labelKey: "inventory.categoryFinished" },
  { value: "beverage", labelKey: "inventory.categoryBeverage" },
  { value: "non_food", labelKey: "inventory.categoryNonFood" },
];

const storageTypes = [
  { value: "dry", labelKey: "inventory.storageDry" },
  { value: "chiller", labelKey: "inventory.storageChiller" },
  { value: "freezer", labelKey: "inventory.storageFreezer" },
];

const units = ["Kg", "g", "L", "mL", "Piece", "Box", "Pack", "Dozen"];

export default function ItemMasterAdd() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [itemCode, setItemCode] = useState("STK-AUTO");
  const [names, setNames] = useState({ en: "", ar: "", ur: "" });
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [purchaseUnit, setPurchaseUnit] = useState("");
  const [consumptionUnit, setConsumptionUnit] = useState("");
  const [conversionFactor, setConversionFactor] = useState("1");
  const [baseUnit, setBaseUnit] = useState("");
  const [shelfLifeDays, setShelfLifeDays] = useState("");
  const [storageType, setStorageType] = useState("dry");
  const [minStockLevel, setMinStockLevel] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [maxStockLevel, setMaxStockLevel] = useState("");
  const [costingMethod, setCostingMethod] = useState("fifo");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [isTaxable, setIsTaxable] = useState(true);
  const [isActive, setIsActive] = useState(true);
  // Advanced
  const [barcode, setBarcode] = useState("");
  const [isHaccpCritical, setIsHaccpCritical] = useState(false);
  const [allergens, setAllergens] = useState<AllergenType[]>([]);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setNames((prev) => ({ ...prev, [lang]: value }));
  };

  const handleSave = async () => {
    if (!names.en || !category || !baseUnit || !costPrice) {
      toast({
        title: t("common.error"),
        description: t("common.fillRequired"),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    // TODO: API call to save item
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);

    toast({
      title: t("common.success"),
      description: t("inventory.itemCreated"),
    });
    navigate("/inventory/items");
  };

  const sections = [
    {
      title: t("branches.basicInfo"),
      children: (
        <FormSectionCard title={t("branches.basicInfo")} icon={FileText}>
          <FormRow columns={2}>
            <FormField label={t("inventory.itemCode")}>
              <Input value={itemCode} onChange={(e) => setItemCode(e.target.value)} />
            </FormField>
            <FormField label={t("inventory.itemName")} required>
              <CompactMultiLanguageInput
                label={t("inventory.itemName")}
                values={names}
                onChange={handleNameChange}
              />
            </FormField>
          </FormRow>
          <FormRow columns={2} divider>
            <FormField label={t("inventory.category")} required>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.selectItem")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {t(cat.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label={t("inventory.subCategory")}>
              <Input
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder={t("inventory.subCategoryPlaceholder")}
              />
            </FormField>
          </FormRow>
        </FormSectionCard>
      ),
    },
    {
      title: t("inventory.unitsConversion"),
      children: (
        <FormSectionCard title={t("inventory.unitsConversion")} icon={Ruler}>
          <FormRow columns={3}>
            <FormField label={t("inventory.purchaseUnit")}>
              <Select value={purchaseUnit} onValueChange={setPurchaseUnit}>
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
            <FormField label={t("inventory.consumptionUnit")}>
              <Select value={consumptionUnit} onValueChange={setConsumptionUnit}>
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
            <FormField label={t("inventory.conversionFactor")} tooltip={t("tooltips.conversionFactor")}>
              <Input
                value={conversionFactor}
                onChange={(e) => setConversionFactor(e.target.value)}
                placeholder="1 Box = 12 Pieces"
              />
            </FormField>
          </FormRow>
          <FormRow columns={2} divider>
            <FormField label={t("inventory.baseUnit")} required>
              <Select value={baseUnit} onValueChange={setBaseUnit}>
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
            <FormField label={t("inventory.shelfLife")}>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={shelfLifeDays}
                  onChange={(e) => setShelfLifeDays(e.target.value)}
                  placeholder="30"
                />
                <span className="text-sm text-muted-foreground">{t("inventory.days")}</span>
              </div>
            </FormField>
          </FormRow>
        </FormSectionCard>
      ),
    },
    {
      title: t("inventory.storageStockLevels"),
      children: (
        <FormSectionCard title={t("inventory.storageStockLevels")} icon={Warehouse}>
          <FormRow columns={4}>
            <FormField label={t("inventory.storageType")}>
              <Select value={storageType} onValueChange={setStorageType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {storageTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {t(type.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label={t("inventory.minStockLevel")} tooltip={t("tooltips.minStock")}>
              <Input
                type="number"
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(e.target.value)}
                placeholder="10"
              />
            </FormField>
            <FormField label={t("inventory.reorderLevel")} tooltip={t("tooltips.reorderLevel")}>
              <Input
                type="number"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
                placeholder="25"
              />
            </FormField>
            <FormField label={t("inventory.maxStockLevel")}>
              <Input
                type="number"
                value={maxStockLevel}
                onChange={(e) => setMaxStockLevel(e.target.value)}
                placeholder="100"
              />
            </FormField>
          </FormRow>
          <FormRow divider>
            <FormField label={t("inventory.costingMethod")} tooltip={t("tooltips.costingMethod")}>
              <CompactRadioGroup
                value={costingMethod}
                onChange={setCostingMethod}
                options={[
                  { value: "fifo", label: t("inventory.costingFifo") },
                  { value: "weighted_avg", label: t("inventory.costingWeightedAvg") },
                ]}
              />
            </FormField>
          </FormRow>
        </FormSectionCard>
      ),
    },
    {
      title: t("inventory.pricingTax"),
      children: (
        <FormSectionCard title={t("inventory.pricingTax")} icon={DollarSign}>
          <FormRow columns={2}>
            <FormField label={t("inventory.costPrice")} required>
              <Input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0.00"
              />
            </FormField>
            <FormField label={t("inventory.sellingPrice")}>
              <Input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0.00"
              />
            </FormField>
          </FormRow>
          <FormRow divider>
            <FormField label={t("inventory.taxStatus")}>
              <CompactRadioGroup
                value={isTaxable ? "taxable" : "non_taxable"}
                onChange={(v) => setIsTaxable(v === "taxable")}
                options={[
                  { value: "taxable", label: t("inventory.taxable") },
                  { value: "non_taxable", label: t("inventory.nonTaxable") },
                ]}
              />
            </FormField>
          </FormRow>
        </FormSectionCard>
      ),
    },
    {
      title: t("inventory.advancedOptions"),
      children: (
        <CollapsibleSection title={t("inventory.advancedOptions")} defaultOpen={false}>
          <FormRow columns={2}>
            <FormField label={t("inventory.barcode")}>
              <Input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Barcode/QR Code" />
            </FormField>
            <FormField label={t("inventory.haccpCritical")} tooltip={t("tooltips.haccpCritical")}>
              <div className="flex items-center gap-2 pt-1">
                <Checkbox checked={isHaccpCritical} onCheckedChange={(v) => setIsHaccpCritical(v as boolean)} />
                <span className="text-sm">{t("inventory.haccpCriticalItem")}</span>
              </div>
            </FormField>
          </FormRow>
          <FormRow divider>
            <FormField label={t("items.allergens")}>
              <AllergenPicker value={allergens} onChange={setAllergens} />
            </FormField>
          </FormRow>
        </CollapsibleSection>
      ),
    },
    {
      title: t("common.status"),
      children: (
        <FormSectionCard title={t("common.status")} icon={Activity}>
          <FormField label={t("common.status")}>
            <CompactRadioGroup
              value={isActive ? "active" : "inactive"}
              onChange={(v) => setIsActive(v === "active")}
              options={[
                { value: "active", label: t("common.active") },
                { value: "inactive", label: t("common.inactive") },
              ]}
            />
          </FormField>
        </FormSectionCard>
      ),
    },
  ];

  return (
    <PageFormLayout
      title={t("inventory.addStockItem")}
      sections={sections}
      onCancel={() => navigate("/inventory/items")}
      onSave={handleSave}
      isSaving={isSaving}
      backPath="/inventory/items"
    />
  );
}
