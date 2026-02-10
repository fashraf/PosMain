import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { ArrowLeft, ArrowRight, Save, X, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BranchesAdd() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Branch name is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from("branches").insert({
        name: name.trim(),
        address: address.trim() || null,
        is_active: isActive,
      });
      if (error) throw error;
      toast({ title: t("common.success"), description: "Branch created successfully" });
      navigate("/branches");
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="p-1 space-y-1.5 pb-14">
      <LoadingOverlay visible={isSaving} />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/branches")}>
          <BackIcon className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-primary" />
          <h1 className="text-lg font-bold text-foreground">{t("branches.addBranch")}</h1>
        </div>
      </div>

      <div className="max-w-lg space-y-1.5">
        <div className="space-y-0.5" data-field="name">
          <Label className="text-xs">Branch Name *</Label>
          <Input
            value={name}
            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({}); }}
            placeholder="e.g., Main Branch"
            className={cn("h-7 text-xs", errors.name && "border-destructive")}
          />
          {errors.name && <p className="text-[10px] text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-0.5">
          <Label className="text-xs">Address</Label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Optional address"
            className="min-h-[50px] text-xs"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Status</Label>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">{isActive ? t("common.active") : t("common.inactive")}</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className={cn(
        "fixed bottom-0 bg-background/95 backdrop-blur-sm border-t p-2 z-30",
        isRTL ? "right-0 left-[16rem]" : "left-[16rem] right-0"
      )}>
        <div className={cn("flex gap-1.5 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={() => navigate("/branches")} disabled={isSaving} className="h-7 text-xs">
            <X className="h-3 w-3 me-1" /> {t("common.cancel")}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-7 text-xs">
            <Save className="h-3 w-3 me-1" /> {isSaving ? t("common.loading") : "Save Branch"}
          </Button>
        </div>
      </div>
    </div>
  );
}
