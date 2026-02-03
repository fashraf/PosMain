import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { AlertCircle, Check } from "lucide-react";

export interface Change {
  field: string;
  oldValue: string | null;
  newValue: string;
}

interface ConfirmChangesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  changes: Change[];
  title?: string;
  isLoading?: boolean;
}

export function ConfirmChangesModal({
  open,
  onOpenChange,
  onConfirm,
  changes,
  title,
  isLoading = false,
}: ConfirmChangesModalProps) {
  const { t } = useLanguage();

  const hasChanges = changes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title || t("common.confirmChanges")}</DialogTitle>
          <DialogDescription>
            {hasChanges
              ? t("common.reviewChanges")
              : t("common.noChanges")}
          </DialogDescription>
        </DialogHeader>

        {hasChanges ? (
          <div className="max-h-[300px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">{t("common.field")}</TableHead>
                  <TableHead className="font-semibold">{t("common.oldValue")}</TableHead>
                  <TableHead className="font-semibold">{t("common.newValue")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changes.map((change, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{change.field}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {change.oldValue || "-"}
                    </TableCell>
                    <TableCell className="text-primary font-medium">
                      {change.newValue}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-3" />
            <p>{t("common.noChanges")}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          {hasChanges && (
            <Button onClick={onConfirm} disabled={isLoading}>
              <Check className="h-4 w-4 me-2" />
              {t("common.confirmAndSave")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
