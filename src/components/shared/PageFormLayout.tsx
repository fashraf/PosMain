import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSection {
  title: string;
  description?: string;
  children: ReactNode;
}

interface PageFormLayoutProps {
  title: string;
  sections: FormSection[];
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  backPath?: string;
}

export function PageFormLayout({
  title,
  sections,
  onCancel,
  onSave,
  isSaving = false,
  backPath,
}: PageFormLayoutProps) {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              {section.description && (
                <p className="text-sm text-muted-foreground">{section.description}</p>
              )}
            </CardHeader>
            <CardContent>{section.children}</CardContent>
          </Card>
        ))}
      </div>

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 bg-background border-t p-4 z-10",
          "flex items-center gap-3",
          isRTL ? "flex-row-reverse pe-[var(--sidebar-width)] ps-4" : "ps-[var(--sidebar-width)] pe-4"
        )}
        style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
      >
        <div className={cn("flex-1 flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            <X className="h-4 w-4 me-2" />
            {t("common.cancel")}
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            <Save className="h-4 w-4 me-2" />
            {isSaving ? t("common.loading") : t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
