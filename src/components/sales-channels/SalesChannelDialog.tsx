import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MultiLanguageInput } from "@/components/shared/MultiLanguageInput";
import { useLanguage } from "@/hooks/useLanguage";
import type { SalesChannel } from "./SalesChannelTable";

interface SalesChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: SalesChannel | null;
  onSave: (channel: Omit<SalesChannel, "id"> & { id?: string }) => void;
}

const iconOptions = ["🏪", "🛵", "📱", "🍽️", "🌐", "📦", "🚗", "🏠"];

export function SalesChannelDialog({
  open,
  onOpenChange,
  channel,
  onSave,
}: SalesChannelDialogProps) {
  const { t } = useLanguage();
  const isEditing = !!channel;

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    code: "",
    icon: "🏪",
    is_active: true,
  });

  useEffect(() => {
    if (channel) {
      setFormData({
        name_en: channel.name_en,
        name_ar: channel.name_ar,
        name_ur: channel.name_ur,
        code: channel.code,
        icon: channel.icon || "🏪",
        is_active: channel.is_active,
      });
    } else {
      setFormData({
        name_en: "",
        name_ar: "",
        name_ur: "",
        code: "",
        icon: "🏪",
        is_active: true,
      });
    }
  }, [channel, open]);

  const handleNameChange = (lang: "en" | "ar" | "ur", value: string) => {
    setFormData((prev) => ({ ...prev, [`name_${lang}`]: value }));
    // Auto-generate code from English name if not editing
    if (lang === "en" && !isEditing && !formData.code) {
      const code = value.toUpperCase().replace(/\s+/g, "_").slice(0, 20);
      setFormData((prev) => ({ ...prev, code }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(channel?.id ? { id: channel.id } : {}),
      ...formData,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("salesChannels.editChannel") : t("salesChannels.addChannel")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
