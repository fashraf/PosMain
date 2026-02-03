import { useState } from "react";
import { ArrowRightLeft, Plus, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { FormSectionCard } from "@/components/shared/FormSectionCard";
import { FormField } from "@/components/shared/FormField";
import { FormRow } from "@/components/shared/FormRow";
import { CompactRadioGroup } from "@/components/shared/CompactRadioGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StockTransfer() {
  const { t } = useLanguage();
  const [transferType, setTransferType] = useState("internal");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split("T")[0]);

  const items = [
    { id: "1", name: "Tomatoes", batch: "B-001", available: 50, transferQty: "20", unit: "Kg", status: "pending" },
    { id: "2", name: "Flour", batch: "B-002", available: 25, transferQty: "10", unit: "Kg", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ArrowRightLeft className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{t("inventory.stockTransfer")}</h1>
      </div>

      {/* Transfer Details */}
      <FormSectionCard title={t("inventory.transferDetails")} icon={ArrowRightLeft}>
        <FormRow columns={2}>
          <FormField label={t("inventory.fromLocation")}>
            <Select value={fromLocation} onValueChange={setFromLocation}>
              <SelectTrigger>
                <SelectValue placeholder={t("common.selectItem")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main_store">Main Store</SelectItem>
                <SelectItem value="kitchen_store">Kitchen Store</SelectItem>
                <SelectItem value="bar_store">Bar Store</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label={t("inventory.toLocation")}>
            <Select value={toLocation} onValueChange={setToLocation}>
              <SelectTrigger>
                <SelectValue placeholder={t("common.selectItem")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main_store">Main Store</SelectItem>
                <SelectItem value="kitchen_store">Kitchen Store</SelectItem>
                <SelectItem value="bar_store">Bar Store</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>
        <FormRow columns={2} divider>
          <FormField label={t("inventory.transferType")}>
            <CompactRadioGroup
              value={transferType}
              onChange={setTransferType}
              options={[
                { value: "internal", label: t("inventory.transferInternal") },
                { value: "inter_branch", label: t("inventory.transferInterBranch") },
              ]}
            />
          </FormField>
          <FormField label={t("inventory.transferDate")}>
            <Input type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
          </FormField>
        </FormRow>
        <FormRow divider>
          <FormField label={t("inventory.referenceNumber")}>
            <Input value="TRF-2026-0001" disabled className="bg-muted w-48" />
          </FormField>
        </FormRow>
      </FormSectionCard>

      {/* Items to Transfer */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg">{t("inventory.itemsToTransfer")}</CardTitle>
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
                <TableHead>{t("inventory.batchId")}</TableHead>
                <TableHead>{t("inventory.available")}</TableHead>
                <TableHead>{t("inventory.transferQty")}</TableHead>
                <TableHead>{t("inventory.transferStatus")}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-sm">{item.batch}</TableCell>
                  <TableCell>{item.available} {item.unit}</TableCell>
                  <TableCell>
                    <Input type="number" className="w-24" value={item.transferQty} placeholder="0" />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-warning border-warning">
                      ● {t("inventory.statusPending")}
                    </Badge>
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
      </Card>

      {/* Status Flow */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
        <span className="font-medium">● {t("inventory.statusPending")}</span>
        <span>→</span>
        <span>🚚 {t("inventory.statusInTransit")}</span>
        <span>→</span>
        <span>✅ {t("inventory.statusReceived")}</span>
        <span>→</span>
        <span>📋 {t("inventory.statusCompleted")}</span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">{t("common.cancel")}</Button>
        <Button>{t("common.save")}</Button>
      </div>
    </div>
  );
}
