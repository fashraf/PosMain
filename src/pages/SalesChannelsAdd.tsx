import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MultiLanguageInput } from "@/components/shared/MultiLanguageInput";
import { ConfirmChangesModal, type Change } from "@/components/shared/ConfirmChangesModal";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

const iconOptions = ["🏪", "🛵", "📱", "🍽️", "🌐", "📦", "🚗", "🏠"];

export default function SalesChannelsAdd() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    code: "",
    icon: "🏪",
    is_active: true,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
    // Auto-generate code from English name
    if (lang === "en" && !formData.code) {
      const code = value.toUpperCase().replace(/\s+/g, "_").slice(0, 20);
      setFormData((prev) => ({ ...prev, code }));
    }
  };

  const getChanges = (): Change[] => {
    const changes: Change[] = [];
    if (formData.name_en) changes.push({ field: t("common.name") + " (EN)", oldValue: null, newValue: formData.name_en });
    if (formData.name_ar) changes.push({ field: t("common.name") + " (AR)", oldValue: null, newValue: formData.name_ar });
    if (formData.name_ur) changes.push({ field: t("common.name") + " (UR)", oldValue: null, newValue: formData.name_ur });
    if (formData.code) changes.push({ field: t("salesChannels.code"), oldValue: null, newValue: formData.code });
    changes.push({ field: t("salesChannels.icon"), oldValue: null, newValue: formData.icon });
    changes.push({ field: t("common.status"), oldValue: null, newValue: formData.is_active ? t("common.active") : t("common.inactive") });
    return changes;
  };

  const handleSave = () => {
    if (!formData.name_en || !formData.code) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: t("salesChannels.addChannel"),
        description: `${formData.name_en} has been added.`,
      });
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate("/sales-channels");
    }, 500);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/sales-channels")}>
          <BackIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{t("salesChannels.addChannel")}</h1>
      </div>

      {/* Form Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("salesChannels.channelName")}</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiLanguageInput
            label={t("salesChannels.channelName")}
            values={{
              en: formData.name_en,
              ar: formData.name_ar,
              ur: formData.name_ur,
            }}
            onChange={handleNameChange}
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("salesChannels.code")} & {t("salesChannels.icon")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">{t("salesChannels.code")}</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code: e.target.value.toUpperCase().replace(/\s+/g, "_"),
                }))
              }
              placeholder="CHANNEL_CODE"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t("salesChannels.icon")}</Label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <Button
                  key={icon}
                  type="button"
                  variant={formData.icon === icon ? "default" : "outline"}
                  size="icon"
                  className="text-xl"
                  onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                >
                  {icon}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("common.status")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="status">{t("common.status")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formData.is_active ? t("common.active") : t("common.inactive")}
              </span>
              <Switch
                id="status"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 bg-background border-t p-4 z-10",
          "flex items-center gap-3",
          isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4"
        )}
      >
        <div className={cn("flex-1 flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={() => navigate("/sales-channels")} disabled={isSaving}>
            <X className="h-4 w-4 me-2" />
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 me-2" />
            {t("common.save")}
          </Button>
        </div>
      </div>

      <ConfirmChangesModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmSave}
        changes={getChanges()}
        isLoading={isSaving}
      />
    </div>
  );
}
