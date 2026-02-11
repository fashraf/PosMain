import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, FileText, Layout, QrCode, MessageSquare, Save, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";

import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { ReceiptPreview, PrintTemplateData } from "./ReceiptPreview";
import { PrintTemplateSaveModal } from "./PrintTemplateSaveModal";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const defaultData: PrintTemplateData = {
  name: "",
  show_logo: true,
  logo_url: null,
  logo_position: "center",
  logo_width: 80,
  logo_height: 40,
  show_branch_name: true,
  show_branch_mobile: true,
  show_order_id: true,
  show_order_taken_by: true,
  show_cr_number: false,
  show_vat_number: false,
  cr_number: "",
  vat_number: "",
  telephone: "",
  header_text: "Welcome to Our Restaurant",
  header_alignment: "center",
  show_item_name: true,
  show_qty: true,
  show_price: true,
  show_line_total: true,
  show_total_amount: true,
  show_discount: false,
  show_tax_breakdown: false,
  show_customization: true,
  show_qr: false,
  qr_content: "order_url",
  qr_size: "medium",
  show_amount_above_qr: false,
  show_order_id_near_qr: false,
  show_footer: true,
  footer_text: "Thank you for visiting!",
  footer_alignment: "center",
  restaurant_name_en: "",
  restaurant_name_ar: "",
  restaurant_name_ur: "",
};

/* ── Toggle Card ── */
function ToggleCard({ checked, onChange, id, label }: { checked: boolean; onChange: (v: boolean) => void; id: string; label: string }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all select-none",
        checked
          ? "bg-primary/5 border-primary/40 shadow-sm"
          : "bg-white border-gray-200 hover:border-primary/30 hover:bg-primary/[0.02]"
      )}
    >
      <Checkbox checked={checked} onCheckedChange={onChange} id={id} />
      <span className="text-xs font-medium">{label}</span>
    </label>
  );
}

/* ── Logo Upload Zone ── */
function LogoUploadZone({ value, onFileChange, onClear, isUploading }: { value: string | null; onFileChange: (f: File) => void; onClear: () => void; isUploading: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-start">
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          "relative w-[140px] h-[64px] rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden",
          value ? "border-primary/30 bg-primary/[0.02]" : "border-muted-foreground/25 bg-muted/20 hover:border-primary/40 hover:bg-muted/30",
          isUploading && "opacity-60 pointer-events-none"
        )}
      >
        {value ? (
          <>
            <img src={value} alt="Logo" className="w-full h-full object-contain p-1" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity shadow-sm"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span className="text-[11px] font-medium">Upload Logo</span>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileChange(f); }} />
    </div>
  );
}

interface Props {
  mode: "add" | "edit";
  templateId?: string;
}

export function PrintTemplateFormPage({ mode, templateId }: Props) {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [data, setData] = useState<PrintTemplateData>({ ...defaultData });
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [logoUploading, setLogoUploading] = useState(false);

  // Load template for edit
  useEffect(() => {
    if (mode !== "edit" || !templateId) return;
    supabase.from("print_templates").select("*").eq("id", templateId).single().then(({ data: row, error }) => {
      if (error || !row) { toast.error("Template not found"); navigate("/maintenance/print-templates"); return; }
      setData({
        name: row.name,
        show_logo: row.show_logo,
        logo_url: row.logo_url,
        logo_position: row.logo_position as any,
        logo_width: (row as any).logo_width ?? 80,
        logo_height: (row as any).logo_height ?? 40,
        show_branch_name: row.show_branch_name,
        show_branch_mobile: row.show_branch_mobile,
        show_order_id: row.show_order_id,
        show_order_taken_by: row.show_order_taken_by,
        show_cr_number: row.show_cr_number,
        show_vat_number: row.show_vat_number,
        cr_number: (row as any).cr_number ?? "",
        vat_number: (row as any).vat_number ?? "",
        telephone: (row as any).telephone ?? "",
        header_text: row.header_text || "",
        header_alignment: row.header_alignment as any,
        show_item_name: row.show_item_name,
        show_qty: row.show_qty,
        show_price: row.show_price,
        show_line_total: row.show_line_total,
        show_total_amount: row.show_total_amount,
        show_discount: row.show_discount,
        show_tax_breakdown: row.show_tax_breakdown,
        show_customization: (row as any).show_customization ?? true,
        show_qr: row.show_qr,
        qr_content: row.qr_content,
        qr_size: row.qr_size as any,
        show_amount_above_qr: row.show_amount_above_qr,
        show_order_id_near_qr: row.show_order_id_near_qr,
        show_footer: row.show_footer,
        footer_text: row.footer_text || "",
        footer_alignment: row.footer_alignment as any,
        restaurant_name_en: (row as any).restaurant_name_en ?? "",
        restaurant_name_ar: (row as any).restaurant_name_ar ?? "",
        restaurant_name_ur: (row as any).restaurant_name_ur ?? "",
      });
      setIsActive(row.is_active);
      setLoading(false);
    });
  }, [mode, templateId]);

  const set = <K extends keyof PrintTemplateData>(key: K, val: PrintTemplateData[K]) => {
    setData((prev) => ({ ...prev, [key]: val }));
    if (errors[key as string]) setErrors((prev) => ({ ...prev, [key as string]: false }));
  };

  const handleLogoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5 MB"); return; }
    setLogoUploading(true);
    const path = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { data: uploaded, error } = await supabase.storage.from("print-logos").upload(path, file, { cacheControl: "3600" });
    setLogoUploading(false);
    if (error) { toast.error("Logo upload failed"); return; }
    const { data: urlData } = supabase.storage.from("print-logos").getPublicUrl(uploaded.path);
    set("logo_url", urlData.publicUrl);
  };

  const validateAndOpenModal = () => {
    const newErrors: Record<string, boolean> = {};
    if (!data.name.trim()) newErrors.name = true;
    if (!data.restaurant_name_en.trim()) newErrors.restaurant_name = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      toast.error(firstKey === "name" ? "Template name is required" : "Restaurant name is required");
      const el = document.querySelector<HTMLInputElement>(`[data-field="${firstKey}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el?.focus(), 300);
      return;
    }
    setShowSaveModal(true);
  };

  const handleSave = async () => {
    setShowSaveModal(false);
    setSaving(true);
    const payload: any = {
      name: data.name, is_active: isActive,
      show_logo: data.show_logo, logo_url: data.logo_url, logo_position: data.logo_position,
      logo_width: data.logo_width, logo_height: data.logo_height,
      show_branch_name: data.show_branch_name, show_branch_mobile: data.show_branch_mobile,
      show_order_id: data.show_order_id, show_order_taken_by: data.show_order_taken_by,
      show_cr_number: data.show_cr_number, show_vat_number: data.show_vat_number,
      cr_number: data.cr_number, vat_number: data.vat_number, telephone: data.telephone,
      header_text: data.header_text, header_alignment: data.header_alignment,
      show_item_name: data.show_item_name, show_qty: data.show_qty, show_price: data.show_price,
      show_line_total: data.show_line_total, show_total_amount: data.show_total_amount,
      show_discount: data.show_discount, show_tax_breakdown: data.show_tax_breakdown,
      show_customization: data.show_customization,
      show_qr: data.show_qr, qr_content: data.qr_content, qr_size: data.qr_size,
      show_amount_above_qr: data.show_amount_above_qr, show_order_id_near_qr: data.show_order_id_near_qr,
      show_footer: data.show_footer, footer_text: data.footer_text, footer_alignment: data.footer_alignment,
      restaurant_name_en: data.restaurant_name_en, restaurant_name_ar: "", restaurant_name_ur: "",
    };
    try {
      if (mode === "add") {
        const { error } = await supabase.from("print_templates").insert(payload);
        if (error) throw error;
        toast.success("Template created");
      } else {
        const { error } = await supabase.from("print_templates").update(payload).eq("id", templateId!);
        if (error) throw error;
        toast.success("Template updated");
      }
      navigate("/maintenance/print-templates");
    } catch (err: any) {
      if (err?.code === "23505") toast.error("A template with this name already exists");
      else toast.error(err?.message || "Save failed");
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingOverlay visible={true} message="Loading template..." />;

  return (
    <div className="pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/maintenance/print-templates")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{mode === "add" ? "New Print Template" : "Edit Print Template"}</h1>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* LEFT: Form */}
        <div className="col-span-8 space-y-4">
          {/* Template Name - standalone top row */}
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-10 space-y-1">
              <Label className="text-xs font-semibold">Template Name *</Label>
              <Input
                data-field="name"
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Default Receipt"
                className={cn("h-9 text-[13px]", errors.name && "border-red-500 focus-visible:ring-red-500")}
              />
            </div>
            <div className="col-span-2 flex items-center gap-2 pb-0.5">
              <Label className="text-xs font-semibold">Active</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          {/* Template Info */}
          <DashedSectionCard title="Template Info" icon={Printer}>
            <div className="grid grid-cols-2 gap-3 p-1">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Restaurant Name *</Label>
                <Input
                  data-field="restaurant_name"
                  value={data.restaurant_name_en}
                  onChange={(e) => set("restaurant_name_en", e.target.value)}
                  placeholder="Enter Restaurant Name"
                  className={cn("h-9 text-[13px]", errors.restaurant_name && "border-red-500 focus-visible:ring-red-500")}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Tel #</Label>
                <Input value={data.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="+966 12 345 6789" className="h-9 text-[13px]" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">CR #</Label>
                <Input value={data.cr_number} onChange={(e) => set("cr_number", e.target.value)} placeholder="Enter CR Number" className="h-9 text-[13px]" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">VAT #</Label>
                <Input value={data.vat_number} onChange={(e) => set("vat_number", e.target.value)} placeholder="Enter VAT Number" className="h-9 text-[13px]" />
              </div>
            </div>
          </DashedSectionCard>

          {/* Header Section */}
          <DashedSectionCard title="Header" icon={FileText}>
            <div className="space-y-3 p-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <ToggleCard checked={data.show_logo} onChange={(c) => set("show_logo", c)} id="show_logo" label="Show Logo" />
                  {data.show_logo && (
                    <div className="space-y-2 pl-2">
                      <div className="flex items-start gap-4">
                        <LogoUploadZone
                          value={data.logo_url}
                          onFileChange={handleLogoUpload}
                          onClear={() => set("logo_url", null)}
                          isUploading={logoUploading}
                        />
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold">Position</Label>
                          <div className="flex gap-1">
                            {(["left", "center", "right"] as const).map((pos) => (
                              <Button key={pos} size="sm" variant={data.logo_position === pos ? "default" : "outline"} className="h-7 px-3 text-[11px] capitalize" onClick={() => set("logo_position", pos)}>
                                {pos}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-semibold">W (px)</Label>
                          <Input type="number" value={data.logo_width} onChange={(e) => set("logo_width", Number(e.target.value) || 80)} className="h-8 w-16 text-[12px]" min={20} max={200} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-semibold">H (px)</Label>
                          <Input type="number" value={data.logo_height} onChange={(e) => set("logo_height", Number(e.target.value) || 40)} className="h-8 w-16 text-[12px]" min={20} max={200} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    ["show_branch_name", "Restaurant Name"],
                    ["show_branch_mobile", "Branch Mobile"],
                    ["show_order_id", "Order ID"],
                    ["show_order_taken_by", "Order Taken By"],
                    ["show_cr_number", "CR Number"],
                    ["show_vat_number", "VAT Number"],
                  ] as const).map(([key, label]) => (
                    <ToggleCard key={key} checked={data[key]} onChange={(c) => set(key, c)} id={key} label={label} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Header Text</Label>
                  <Input value={data.header_text} onChange={(e) => set("header_text", e.target.value)} placeholder="Welcome message" className="h-9 text-[13px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Alignment</Label>
                  <Select value={data.header_alignment} onValueChange={(v) => set("header_alignment", v as any)}>
                    <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </DashedSectionCard>

          {/* Body Section */}
          <DashedSectionCard title="Body" icon={Layout}>
            <div className="grid grid-cols-4 gap-2 p-1">
              {([
                ["show_item_name", "Item Name"],
                ["show_qty", "Qty"],
                ["show_price", "Price"],
                ["show_line_total", "Line Total"],
                ["show_total_amount", "Total Amount"],
                ["show_discount", "Discount"],
                ["show_tax_breakdown", "Tax Breakdown"],
                ["show_customization", "Customization (+/-)"],
              ] as const).map(([key, label]) => (
                <ToggleCard key={key} checked={data[key]} onChange={(c) => set(key, c)} id={key} label={label} />
              ))}
            </div>
          </DashedSectionCard>

          {/* QR Section */}
          <DashedSectionCard title="QR / Special" icon={QrCode}>
            <div className="space-y-3 p-1">
              <ToggleCard checked={data.show_qr} onChange={(c) => set("show_qr", c)} id="show_qr" label="Generate QR Code" />
              {data.show_qr && (
                <div className="pl-2 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">QR Content</Label>
                      <Select value={data.qr_content} onValueChange={(v) => set("qr_content", v)}>
                        <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order_url">Order URL</SelectItem>
                          <SelectItem value="order_id">Order ID</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">QR Size</Label>
                      <Select value={data.qr_size} onValueChange={(v) => set("qr_size", v as any)}>
                        <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleCard checked={data.show_amount_above_qr} onChange={(c) => set("show_amount_above_qr", c)} id="amt_qr" label="Amount Above QR" />
                    <ToggleCard checked={data.show_order_id_near_qr} onChange={(c) => set("show_order_id_near_qr", c)} id="id_qr" label="Order ID Near QR" />
                  </div>
                </div>
              )}
            </div>
          </DashedSectionCard>

          {/* Footer Section */}
          <DashedSectionCard title="Footer" icon={MessageSquare}>
            <div className="space-y-3 p-1">
              <ToggleCard checked={data.show_footer} onChange={(c) => set("show_footer", c)} id="show_footer" label="Show Footer" />
              {data.show_footer && (
                <div className="grid grid-cols-2 gap-3 pl-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Footer Text</Label>
                    <Input value={data.footer_text} onChange={(e) => set("footer_text", e.target.value)} placeholder="Thank you message" className="h-9 text-[13px]" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Alignment</Label>
                    <Select value={data.footer_alignment} onValueChange={(v) => set("footer_alignment", v as any)}>
                      <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </DashedSectionCard>
        </div>

        {/* RIGHT: Preview */}
        <div className="col-span-4">
          <ReceiptPreview data={data} />
        </div>
      </div>

      {/* Sticky Footer */}
      <div className={cn(
        "fixed bottom-0 bg-background border-t p-4 z-30 flex items-center gap-3",
        isRTL ? "flex-row-reverse right-[16rem] left-0" : "left-[16rem] right-0"
      )}>
        <div className={cn("flex-1 flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={() => navigate("/maintenance/print-templates")} disabled={saving}>
            <X className="h-4 w-4 me-2" /> Cancel
          </Button>
          <Button onClick={validateAndOpenModal} disabled={saving}>
            <Save className="h-4 w-4 me-2" /> {saving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      <PrintTemplateSaveModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onConfirm={handleSave}
        data={data}
      />
    </div>
  );
}
