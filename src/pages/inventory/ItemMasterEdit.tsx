import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

// Mock data
const mockItem = {
  id: "1",
  item_code: "STK001",
  name_en: "Tomatoes",
  name_ar: "طماطم",
  name_ur: "ٹماٹر",
  category: "raw",
  sub_category: "Vegetables",
  purchase_unit: "Box",
  consumption_unit: "Kg",
  conversion_factor: "12",
  base_unit: "Kg",
  shelf_life_days: "30",
  storage_type: "chiller",
  min_stock_level: "10",
  reorder_level: "25",
  max_stock_level: "100",
  costing_method: "fifo",
  cost_price: "5.00",
  selling_price: "7.50",
  is_taxable: true,
  is_active: true,
  barcode: "",
  is_haccp_critical: false,
  allergens: [],
};

export default function ItemMasterEdit() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [itemCode, setItemCode] = useState("");
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

  useEffect(() => {
    // Load item data (mock)
    setItemCode(mockItem.item_code);
    setNames({ en: mockItem.name_en, ar: mockItem.name_ar, ur: mockItem.name_ur });
    setCategory(mockItem.category);
    setSubCategory(mockItem.sub_category);
    setPurchaseUnit(mockItem.purchase_unit);
    setConsumptionUnit(mockItem.consumption_unit);
    setConversionFactor(mockItem.conversion_factor);
    setBaseUnit(mockItem.base_unit);
    setShelfLifeDays(mockItem.shelf_life_days);
    setStorageType(mockItem.storage_type);
    setMinStockLevel(mockItem.min_stock_level);
    setReorderLevel(mockItem.reorder_level);
    setMaxStockLevel(mockItem.max_stock_level);
    setCostingMethod(mockItem.costing_method);
    setCostPrice(mockItem.cost_price);
    setSellingPrice(mockItem.selling_price);
    setIsTaxable(mockItem.is_taxable);
    setIsActive(mockItem.is_active);
    setBarcode(mockItem.barcode);
    setIsHaccpCritical(mockItem.is_haccp_critical);
    setAllergens(mockItem.allergens);
  }, [id]);

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
    // TODO: API call to update item
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);

    toast({
      title: t("common.success"),
      description: t("inventory.itemUpdated"),
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
      title={t("inventory.editStockItem")}
      sections={sections}
      onCancel={() => navigate("/inventory/items")}
      onSave={handleSave}
      isSaving={isSaving}
      backPath="/inventory/items"
    />
  );
}
