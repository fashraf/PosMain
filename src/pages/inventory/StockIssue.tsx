import { useState } from "react";
import { SendHorizontal, Plus, Trash2 } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StockIssue() {
  const { t } = useLanguage();
  const [issueType, setIssueType] = useState("manual");
  const [issueTo, setIssueTo] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<Array<{ id: string; name: string; available: number; issueQty: string; unit: string }>>([
    { id: "1", name: "Tomatoes", available: 150, issueQty: "", unit: "Kg" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SendHorizontal className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{t("inventory.stockIssue")}</h1>
      </div>

      {/* Issue Details */}
      <FormSectionCard title={t("inventory.issueDetails")} icon={SendHorizontal}>
        <FormRow columns={2}>
          <FormField label={t("inventory.issueType")}>
            <CompactRadioGroup
              value={issueType}
              onChange={setIssueType}
              options={[
                { value: "manual", label: t("inventory.issueManual") },
                { value: "auto", label: t("inventory.issueAuto") },
                { value: "recipe", label: t("inventory.issueRecipe") },
              ]}
            />
          </FormField>
          <FormField label={t("inventory.issueTo")}>
            <Select value={issueTo} onValueChange={setIssueTo}>
              <SelectTrigger>
                <SelectValue placeholder={t("common.selectItem")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kitchen">{t("inventory.issueToKitchen")}</SelectItem>
                <SelectItem value="bar">{t("inventory.issueToBar")}</SelectItem>
                <SelectItem value="housekeeping">{t("inventory.issueToHousekeeping")}</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>
        <FormRow columns={2} divider>
          <FormField label={t("inventory.issueDate")}>
            <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </FormField>
          <FormField label={t("inventory.referenceNumber")}>
            <Input value="ISS-2026-0001" disabled className="bg-muted" />
          </FormField>
        </FormRow>
      </FormSectionCard>

      {/* Items to Issue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg">{t("inventory.itemsToIssue")}</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 me-2" />
            {t("inventory.addItem")}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("inventory.itemCode")}</TableHead>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("inventory.available")}</TableHead>
                <TableHead>{t("inventory.issueQty")}</TableHead>
                <TableHead>{t("common.unit")}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">STK00{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.available} {item.unit}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="w-24"
                      value={item.issueQty}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].issueQty = e.target.value;
                        setItems(newItems);
                      }}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
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
      </Card>

      {/* Notes & Authorization */}
      <FormSectionCard title={t("inventory.notesAuthorization")}>
        <FormRow columns={2}>
          <FormField label={t("inventory.notes")}>
            <Input placeholder={t("inventory.notesPlaceholder")} />
          </FormField>
          <FormField label={t("inventory.authorizedBy")}>
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
