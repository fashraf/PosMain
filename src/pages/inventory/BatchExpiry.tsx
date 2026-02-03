import { useState } from "react";
import { Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/hooks/useLanguage";
import { ExpiryBadge, ExpiryLegend } from "@/components/inventory/ExpiryBadge";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { CompactRadioGroup } from "@/components/shared/CompactRadioGroup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data
const mockBatches = [
  { id: "B-001", item: "Tomatoes", itemCode: "STK001", supplier: "ABC Foods", qty: 50, unit: "Kg", expiryDate: "2026-02-10" },
  { id: "B-002", item: "Milk", itemCode: "STK004", supplier: "Dairy Co", qty: 20, unit: "L", expiryDate: "2026-02-05" },
  { id: "B-003", item: "Flour", itemCode: "STK002", supplier: "Mill Corp", qty: 100, unit: "Kg", expiryDate: "2026-06-01" },
  { id: "B-004", item: "Chicken", itemCode: "STK003", supplier: "Farm Ltd", qty: 5, unit: "Kg", expiryDate: "2026-02-01" },
];

export default function BatchExpiry() {
  const { t } = useLanguage();
  const [viewFilter, setViewFilter] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState<typeof mockBatches[0] | null>(null);

  const filteredBatches = mockBatches.filter((batch) => {
    if (viewFilter === "all") return true;
    const daysRemaining = Math.ceil((new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (viewFilter === "near_expiry") return daysRemaining <= 14 && daysRemaining > 0;
    if (viewFilter === "expired") return daysRemaining <= 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{t("inventory.batchExpiry")}</h1>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">{t("common.view")}:</span>
        <CompactRadioGroup
          value={viewFilter}
          onChange={setViewFilter}
          options={[
            { value: "all", label: t("inventory.viewAll") },
            { value: "near_expiry", label: t("inventory.nearExpiry") },
            { value: "expired", label: t("inventory.expired") },
          ]}
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("inventory.batchId")}</TableHead>
              <TableHead>{t("common.name")}</TableHead>
              <TableHead>{t("inventory.supplier")}</TableHead>
              <TableHead>{t("common.quantity")}</TableHead>
              <TableHead>{t("inventory.expiryDate")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="font-mono text-sm">{batch.id}</TableCell>
                <TableCell className="font-medium">{batch.item}</TableCell>
                <TableCell>{batch.supplier}</TableCell>
                <TableCell>{batch.qty} {batch.unit}</TableCell>
                <TableCell>{batch.expiryDate}</TableCell>
                <TableCell>
                  <ExpiryBadge expiryDate={batch.expiryDate} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedBatch(batch)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <ExpiryLegend />

      {/* Pagination */}
      <DataTablePagination
        currentPage={1}
        totalPages={1}
        pageSize={10}
        totalItems={filteredBatches.length}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />

      {/* Batch Detail Modal */}
      <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("inventory.batchDetails")}: {selectedBatch?.id}</DialogTitle>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("common.name")}:</span>
                  <p className="font-medium">{selectedBatch.item} ({selectedBatch.itemCode})</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("inventory.supplier")}:</span>
                  <p className="font-medium">{selectedBatch.supplier}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("inventory.receivedDate")}:</span>
                  <p className="font-medium">2026-01-15</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("inventory.expiryDate")}:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedBatch.expiryDate}</span>
                    <ExpiryBadge expiryDate={selectedBatch.expiryDate} />
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <span className="text-sm text-muted-foreground">{t("inventory.traceability")}:</span>
                <p className="text-sm mt-1">
                  {selectedBatch.supplier} → {selectedBatch.item} → Diced {selectedBatch.item} → Pizza Margherita
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
