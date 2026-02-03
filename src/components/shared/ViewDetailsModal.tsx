import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import { X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Field {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
}

interface Section {
  title: string;
  fields: Field[];
}

interface ViewDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  sections: Section[];
}

export function ViewDetailsModal({
  open,
  onOpenChange,
  title,
  sections,
}: ViewDetailsModalProps) {
  const { t, isRTL } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {sectionIndex > 0 && <Separator className="mb-4" />}
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                {section.title}
              </h4>
              <div className="space-y-3">
                {section.fields.map((field, fieldIndex) => (
                  <div
                    key={fieldIndex}
                    className={cn(
                      "flex items-start gap-3",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    {field.icon && (
                      <field.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{field.label}</p>
                      <div className="text-sm font-medium">{field.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 me-2" />
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
