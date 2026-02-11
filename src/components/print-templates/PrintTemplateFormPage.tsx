import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, FileText, Layout, QrCode, MessageSquare, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { ImageUploadHero } from "@/components/shared/ImageUploadHero";
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
  show_branch_name: true,
  show_branch_mobile: true,
  show_order_id: true,
  show_order_taken_by: true,
  show_cr_number: false,
  show_vat_number: false,
  header_text: "Welcome to Our Restaurant",
  header_alignment: "center",
  show_item_name: true,
  show_qty: true,
  show_price: true,
  show_line_total: true,
  show_total_amount: true,
  show_discount: false,
  show_tax_breakdown: false,
  show_qr: false,
  qr_content: "order_url",
  qr_size: "medium",
  show_amount_above_qr: false,
  show_order_id_near_qr: false,
  show_footer: true,
  footer_text: "Thank you for visiting!",
  footer_alignment: "center",
};

interface Props {
  mode: "add" | "edit";
  templateId?: string;
}

export function PrintTemplateFormPage({ mode, templateId }: Props) {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [data, setData] = useState<PrintTemplateData>({ ...defaultData });
  const [branchId, setBranchId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [branches, setBranches] = useState<{ id: string; label: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Load branches
  useEffect(() => {
    supabase.from("branches").select("id, name").eq("is_active", true).then(({ data: rows }) => {
      if (rows) setBranches(rows.map((r) => ({ id: r.id, label: r.name })));
    });
  }, []);

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
        show_branch_name: row.show_branch_name,
        show_branch_mobile: row.show_branch_mobile,
        show_order_id: row.show_order_id,
        show_order_taken_by: row.show_order_taken_by,
        show_cr_number: row.show_cr_number,
        show_vat_number: row.show_vat_number,
        header_text: row.header_text || "",
        header_alignment: row.header_alignment as any,
        show_item_name: row.show_item_name,
        show_qty: row.show_qty,
        show_price: row.show_price,
        show_line_total: row.show_line_total,
        show_total_amount: row.show_total_amount,
        show_discount: row.show_discount,
        show_tax_breakdown: row.show_tax_breakdown,
        show_qr: row.show_qr,
        qr_content: row.qr_content,
        qr_size: row.qr_size as any,
        show_amount_above_qr: row.show_amount_above_qr,
        show_order_id_near_qr: row.show_order_id_near_qr,
        show_footer: row.show_footer,
        footer_text: row.footer_text || "",
        footer_alignment: row.footer_alignment as any,
      });
      setBranchId(row.branch_id);
      setIsActive(row.is_active);
      setLoading(false);
    });
  }, [mode, templateId]);

  const set = <K extends keyof PrintTemplateData>(key: K, val: PrintTemplateData[K]) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const handleLogoUpload = async (file: File | null) => {
    if (!file) { set("logo_url", null); return; }
    const path = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { data: uploaded, error } = await supabase.storage.from("print-logos").upload(path, file, { cacheControl: "3600" });
    if (error) { toast.error("Logo upload failed"); return; }
    const { data: urlData } = supabase.storage.from("print-logos").getPublicUrl(uploaded.path);
    set("logo_url", urlData.publicUrl);
  };

  const handleSave = async () => {
    setShowSaveModal(false);
    if (!data.name.trim()) { toast.error("Template name is required"); return; }
    if (!branchId) { toast.error("Branch is required"); return; }
    setSaving(true);
    const payload = { ...data, branch_id: branchId, is_active: isActive };
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
      if (err?.code === "23505") toast.error("A template with this name already exists for this branch");
      else toast.error(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const selectedBranch = branches.find((b) => b.id === branchId);

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
          {/* Template Info */}
          <DashedSectionCard title="Template Info" icon={Printer}>
            <div className="grid grid-cols-3 gap-3 p-1">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Template Name *</Label>
                <Input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Default Receipt" className="h-9 text-[13px]" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Branch *</Label>
                <SearchableSelect value={branchId} onChange={setBranchId} options={branches} placeholder="Select branch" className="h-9 text-[13px]" />
              </div>
              <div className="flex items-end gap-2 pb-0.5">
                <Label className="text-xs font-semibold">Active</Label>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>
          </DashedSectionCard>

          {/* Header Section */}
          <DashedSectionCard title="Header" icon={FileText}>
            <div className="space-y-3 p-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={data.show_logo} onCheckedChange={(c) => set("show_logo", !!c)} id="show_logo" />
                    <Label htmlFor="show_logo" className="text-xs">Show Logo</Label>
                  </div>
                  {data.show_logo && (
                    <div className="flex items-start gap-4 pl-6">
                      <ImageUploadHero value={data.logo_url} onChange={(url) => set("logo_url", url)} onFileChange={handleLogoUpload} size={64} />
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
                  )}
                </div>
                <div className="space-y-2">
                  {([
                    ["show_branch_name", "Branch Name"],
                    ["show_branch_mobile", "Branch Mobile"],
                    ["show_order_id", "Order ID"],
                    ["show_order_taken_by", "Order Taken By"],
                    ["show_cr_number", "CR Number"],
                    ["show_vat_number", "VAT Number"],
                  ] as const).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-3">
                      <Checkbox checked={data[key]} onCheckedChange={(c) => set(key, !!c)} id={key} />
                      <Label htmlFor={key} className="text-xs">{label}</Label>
                    </div>
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
            <div className="flex flex-wrap gap-x-6 gap-y-2 p-1">
              {([
                ["show_item_name", "Item Name"],
                ["show_qty", "Qty"],
                ["show_price", "Price"],
                ["show_line_total", "Line Total"],
                ["show_total_amount", "Total Amount"],
                ["show_discount", "Discount"],
                ["show_tax_breakdown", "Tax Breakdown"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox checked={data[key]} onCheckedChange={(c) => set(key, !!c)} id={key} />
                  <Label htmlFor={key} className="text-xs">{label}</Label>
                </div>
              ))}
            </div>
          </DashedSectionCard>

          {/* QR Section */}
          <DashedSectionCard title="QR / Special" icon={QrCode}>
            <div className="space-y-3 p-1">
              <div className="flex items-center gap-3">
                <Checkbox checked={data.show_qr} onCheckedChange={(c) => set("show_qr", !!c)} id="show_qr" />
                <Label htmlFor="show_qr" className="text-xs font-semibold">Generate QR Code</Label>
              </div>
              {data.show_qr && (
                <div className="pl-6 space-y-3">
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
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={data.show_amount_above_qr} onCheckedChange={(c) => set("show_amount_above_qr", !!c)} id="amt_qr" />
                      <Label htmlFor="amt_qr" className="text-xs">Amount Above QR</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={data.show_order_id_near_qr} onCheckedChange={(c) => set("show_order_id_near_qr", !!c)} id="id_qr" />
                      <Label htmlFor="id_qr" className="text-xs">Order ID Near QR</Label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DashedSectionCard>

          {/* Footer Section */}
          <DashedSectionCard title="Footer" icon={MessageSquare}>
            <div className="space-y-3 p-1">
              <div className="flex items-center gap-3">
                <Checkbox checked={data.show_footer} onCheckedChange={(c) => set("show_footer", !!c)} id="show_footer" />
                <Label htmlFor="show_footer" className="text-xs font-semibold">Show Footer</Label>
              </div>
              {data.show_footer && (
                <div className="grid grid-cols-2 gap-3 pl-6">
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
        "fixed bottom-0 inset-x-0 bg-background border-t p-4 z-30 flex items-center gap-3",
        isRTL ? "flex-row-reverse pe-[16rem] ps-4" : "ps-[16rem] pe-4"
      )}>
        <div className={cn("flex-1 flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={() => navigate("/maintenance/print-templates")} disabled={saving}>
            <X className="h-4 w-4 me-2" /> Cancel
          </Button>
          <Button onClick={() => setShowSaveModal(true)} disabled={saving}>
            <Save className="h-4 w-4 me-2" /> {saving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      <PrintTemplateSaveModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onConfirm={handleSave}
        data={data}
        branchName={selectedBranch?.label || ""}
      />
    </div>
  );
}
