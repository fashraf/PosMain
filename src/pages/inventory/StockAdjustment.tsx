import { useState } from "react";
import { Sliders, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/hooks/useLanguage";
import { FormSectionCard } from "@/components/shared/FormSectionCard";
import { FormField } from "@/components/shared/FormField";
import { FormRow } from "@/components/shared/FormRow";
import { CompactRadioGroup } from "@/components/shared/CompactRadioGroup";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StockAdjustment() {
  const { t } = useLanguage();
  const [adjustmentDate, setAdjustmentDate] = useState(new Date().toISOString().split("T")[0]);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [notes, setNotes] = useState("");

  const items = [
    { id: "1", name: "Tomatoes", currentStock: 150, newStock: "145", variance: -5, valueImpact: -25 },
    { id: "2", name: "Flour", currentStock: 25, newStock: "27", variance: 2, valueImpact: 10 },
  ];

  const totalImpact = items.reduce((sum, item) => sum + item.valueImpact, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Sliders className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{t("inventory.stockAdjustment")}</h1>
      </div>

      {/* Adjustment Details */}
      <FormSectionCard title={t("inventory.adjustmentDetails")} icon={Sliders}>
        <FormRow columns={2}>
          <FormField label={t("inventory.adjustmentDate")}>
            <Input type="date" value={adjustmentDate} onChange={(e) => setAdjustmentDate(e.target.value)} />
          </FormField>
          <FormField label={t("inventory.referenceNumber")}>
            <Input value="ADJ-2026-0001" disabled className="bg-muted" />
          </FormField>
        </FormRow>
        <FormRow divider>
          <FormField label={t("inventory.adjustmentReason")} required tooltip={t("tooltips.adjustmentReason")}>
            <CompactRadioGroup
              value={adjustmentReason}
              onChange={setAdjustmentReason}
              options={[
                { value: "physical_count", label: t("inventory.reasonPhysicalCount") },
                { value: "damage", label: t("inventory.reasonDamage") },
                { value: "spoilage", label: t("inventory.reasonSpoilage") },
                { value: "theft", label: t("inventory.reasonTheft") },
                { value: "other", label: t("inventory.reasonOther") },
              ]}
            />
          </FormField>
        </FormRow>
      </FormSectionCard>

      {/* Items to Adjust */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg">{t("inventory.itemsToAdjust")}</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 me-2" />
            {t("inventory.addItem")}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("inventory.currentStock")}</TableHead>
                <TableHead>{t("inventory.newStock")}</TableHead>
                <TableHead>{t("inventory.variance")}</TableHead>
                <TableHead>{t("inventory.valueImpact")}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.currentStock} Kg</TableCell>
                  <TableCell>
                    <Input type="number" className="w-24" value={item.newStock} placeholder="0" />
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-medium",
                      item.variance > 0 ? "text-success" : item.variance < 0 ? "text-destructive" : ""
                    )}>
                      {item.variance > 0 ? "+" : ""}{item.variance} Kg
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-medium",
                      item.valueImpact > 0 ? "text-success" : item.valueImpact < 0 ? "text-destructive" : ""
                    )}>
                      {item.valueImpact > 0 ? "+" : ""}${item.valueImpact.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-end py-3 border-t bg-muted/30">
          <div className="text-sm">
            <span className="text-muted-foreground">{t("inventory.totalImpact")}: </span>
            <span className={cn(
              "font-bold",
              totalImpact > 0 ? "text-success" : totalImpact < 0 ? "text-destructive" : ""
            )}>
              {totalImpact > 0 ? "+" : ""}${totalImpact.toFixed(2)}
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* Approval */}
      <FormSectionCard title={t("inventory.approval")}>
        <FormRow columns={3}>
          <FormField label={t("inventory.adjustedBy")}>
            <Input value="Current User" disabled className="bg-muted" />
          </FormField>
          <FormField label={t("inventory.approvedBy")}>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t("common.selectItem")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager1">John Manager</SelectItem>
                <SelectItem value="manager2">Jane Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label={t("inventory.notes")}>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("inventory.notesPlaceholder")} />
          </FormField>
        </FormRow>
      </FormSectionCard>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">{t("common.cancel")}</Button>
        <Button>{t("common.save")}</Button>
      </div>
    </div>
  );
}
