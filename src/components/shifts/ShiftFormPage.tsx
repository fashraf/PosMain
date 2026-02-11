import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Settings, Tag, Save, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DashedSectionCard } from "@/components/shared/DashedSectionCard";
import { ConfirmActionModal } from "@/components/shared/ConfirmActionModal";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const ALL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface ShiftFormData {
  name: string;
  is_active: boolean;
  effective_from: Date | undefined;
  effective_to: Date | undefined;
  days_of_week: string[];
  start_time: string;
  end_time: string;
  allow_overnight: boolean;
  allow_early_clock_in: boolean;
  early_tolerance_minutes: number;
  allow_late_clock_out: boolean;
  force_close_after_hours: number | null;
  require_fingerprint: boolean;
}

interface ShiftFormPageProps {
  mode: "add" | "edit";
  initialData?: Partial<ShiftFormData> & { id?: string };
  isLoading?: boolean;
}

const defaultForm: ShiftFormData = {
  name: "",
  is_active: true,
  effective_from: undefined,
  effective_to: undefined,
  days_of_week: [],
  start_time: "",
  end_time: "",
  allow_overnight: false,
  allow_early_clock_in: false,
  early_tolerance_minutes: 15,
  allow_late_clock_out: false,
  force_close_after_hours: null,
  require_fingerprint: false,
};

export function ShiftFormPage({ mode, initialData, isLoading = false }: ShiftFormPageProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [form, setForm] = useState<ShiftFormData>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        is_active: initialData.is_active ?? true,
        effective_from: initialData.effective_from,
        effective_to: initialData.effective_to,
        days_of_week: initialData.days_of_week || [],
        start_time: initialData.start_time || "",
        end_time: initialData.end_time || "",
        allow_overnight: initialData.allow_overnight ?? false,
        allow_early_clock_in: initialData.allow_early_clock_in ?? false,
        early_tolerance_minutes: initialData.early_tolerance_minutes ?? 15,
        allow_late_clock_out: initialData.allow_late_clock_out ?? false,
        force_close_after_hours: initialData.force_close_after_hours ?? null,
        require_fingerprint: initialData.require_fingerprint ?? false,
      });
    }
  }, [initialData]);

  const duration = useMemo(() => {
    if (!form.start_time || !form.end_time) return null;
    const [sh, sm] = form.start_time.split(":").map(Number);
    const [eh, em] = form.end_time.split(":").map(Number);
    let mins = (eh * 60 + em) - (sh * 60 + sm);
    if (mins <= 0) mins += 24 * 60;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return { h, m, total: mins };
  }, [form.start_time, form.end_time]);

  const needsOvernight = useMemo(() => {
    if (!form.start_time || !form.end_time) return false;
    const [sh, sm] = form.start_time.split(":").map(Number);
    const [eh, em] = form.end_time.split(":").map(Number);
    return (eh * 60 + em) < (sh * 60 + sm);
  }, [form.start_time, form.end_time]);

  const toggleDay = (day: string) => {
    setForm(f => ({
      ...f,
      days_of_week: f.days_of_week.includes(day)
        ? f.days_of_week.filter(d => d !== day)
        : [...f.days_of_week, day],
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Shift name is required";
    if (!form.effective_from) errs.effective_from = "From date is required";
    if (!form.effective_to) errs.effective_to = "To date is required";
    if (form.effective_from && form.effective_to && form.effective_from > form.effective_to)
      errs.effective_to = "To date must be after from date";
    if (form.days_of_week.length === 0) errs.days_of_week = "Select at least one day";
    if (!form.start_time) errs.start_time = "Start time is required";
    if (!form.end_time) errs.end_time = "End time is required";
    if (needsOvernight && !form.allow_overnight) errs.overnight = "Enable overnight shift or adjust times";
    if (duration && duration.total <= 0) errs.duration = "Duration must be greater than 0";
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable = el.querySelector("input, select, button") as HTMLElement;
        focusable?.focus();
      }
    }
    return Object.keys(errs).length === 0;
  };

  const isFormValid = useMemo(() => {
    return (
      form.name.trim() !== "" &&
      form.effective_from !== undefined &&
      form.effective_to !== undefined &&
      form.effective_from <= form.effective_to &&
      form.days_of_week.length > 0 &&
      form.start_time !== "" &&
      form.end_time !== "" &&
      (!needsOvernight || form.allow_overnight) &&
      (duration ? duration.total > 0 : false)
    );
  }, [form, needsOvernight, duration]);

  const handleSaveClick = () => {
    if (validate()) setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    setConfirmOpen(false);
    setIsSaving(true);

    const payload = {
      name: form.name.trim(),
      is_active: form.is_active,
      effective_from: form.effective_from ? format(form.effective_from, "yyyy-MM-dd") : "",
      effective_to: form.effective_to ? format(form.effective_to, "yyyy-MM-dd") : "",
      days_of_week: form.days_of_week,
      start_time: form.start_time,
      end_time: form.end_time,
      allow_overnight: form.allow_overnight,
      allow_early_clock_in: form.allow_early_clock_in,
      early_tolerance_minutes: form.early_tolerance_minutes,
      allow_late_clock_out: form.allow_late_clock_out,
      force_close_after_hours: form.force_close_after_hours,
      require_fingerprint: form.require_fingerprint,
    };

    let error;
    if (mode === "edit" && initialData?.id) {
      ({ error } = await supabase.from("shifts").update(payload).eq("id", initialData.id));
    } else {
      ({ error } = await supabase.from("shifts").insert(payload));
    }

    setIsSaving(false);
    if (error) {
      if (error.message.includes("unique_shift_definition")) {
        setErrors({ name: "A shift with the same name, time, and date range already exists" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Success", description: mode === "edit" ? "Shift updated successfully" : "Shift created successfully" });
      navigate("/maintenance/shifts");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><LoadingOverlay visible /></div>;
  }

  return (
    <div className="space-y-4 pb-24">
      <LoadingOverlay visible={isSaving} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/maintenance/shifts" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-sm text-muted-foreground">← Back to Shift List</p>
            <h1 className="text-xl font-bold">{mode === "edit" ? "Edit Shift" : "Create Shift"}</h1>
          </div>
        </div>
      </div>

      {/* Section 1: Shift Information */}
      <DashedSectionCard title="Shift Information" icon={Tag} id="shift-info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
          <div data-field="name" className="space-y-1.5">
            <Label className="text-sm font-medium">Shift Name <span className="text-destructive">*</span></Label>
            <Input
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(e2 => ({ ...e2, name: "" })); }}
              placeholder="e.g., Weekend Evening Shift"
              className={cn("h-10", errors.name && "border-destructive")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="flex items-center justify-between pt-6">
            <Label className="text-sm font-medium">Status</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{form.is_active ? "Active" : "Inactive"}</span>
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
            </div>
          </div>
        </div>
      </DashedSectionCard>

      {/* Section 2+3: Effective Period & Shift Timing side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashedSectionCard title="Effective Period" icon={Calendar} id="effective-period">
          <div className="p-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div data-field="effective_from" className="space-y-1.5">
                <Label className="text-sm font-medium">From Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-10", !form.effective_from && "text-muted-foreground", errors.effective_from && "border-destructive")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {form.effective_from ? format(form.effective_from, "dd/MM/yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <CalendarComponent mode="single" selected={form.effective_from} onSelect={d => { setForm(f => ({ ...f, effective_from: d })); setErrors(e => ({ ...e, effective_from: "" })); }} initialFocus />
                  </PopoverContent>
                </Popover>
                {errors.effective_from && <p className="text-xs text-destructive">{errors.effective_from}</p>}
              </div>
              <div data-field="effective_to" className="space-y-1.5">
                <Label className="text-sm font-medium">To Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-10", !form.effective_to && "text-muted-foreground", errors.effective_to && "border-destructive")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {form.effective_to ? format(form.effective_to, "dd/MM/yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <CalendarComponent mode="single" selected={form.effective_to} onSelect={d => { setForm(f => ({ ...f, effective_to: d })); setErrors(e => ({ ...e, effective_to: "" })); }} initialFocus />
                  </PopoverContent>
                </Popover>
                {errors.effective_to && <p className="text-xs text-destructive">{errors.effective_to}</p>}
              </div>
            </div>
            <div data-field="days_of_week" className="space-y-2">
              <Label className="text-sm font-medium">Applies On <span className="text-destructive">*</span></Label>
              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "px-3 py-2 rounded-full text-xs font-medium border transition-colors min-h-[40px] min-w-[48px]",
                      form.days_of_week.includes(day)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" className="text-xs h-7" onClick={() => setForm(f => ({ ...f, days_of_week: [...ALL_DAYS] }))}>Select All</Button>
                <Button type="button" variant="ghost" size="sm" className="text-xs h-7" onClick={() => setForm(f => ({ ...f, days_of_week: [] }))}>Clear</Button>
              </div>
              {errors.days_of_week && <p className="text-xs text-destructive">{errors.days_of_week}</p>}
            </div>
          </div>
        </DashedSectionCard>

        <DashedSectionCard title="Shift Timing" icon={Clock} id="shift-timing">
          <div className="p-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div data-field="start_time" className="space-y-1.5">
                <Label className="text-sm font-medium">Start Time <span className="text-destructive">*</span></Label>
                <Input
                  type="time"
                  value={form.start_time}
                  onChange={e => { setForm(f => ({ ...f, start_time: e.target.value })); setErrors(er => ({ ...er, start_time: "" })); }}
                  className={cn("h-10", errors.start_time && "border-destructive")}
                />
                {errors.start_time && <p className="text-xs text-destructive">{errors.start_time}</p>}
              </div>
              <div data-field="end_time" className="space-y-1.5">
                <Label className="text-sm font-medium">End Time <span className="text-destructive">*</span></Label>
                <Input
                  type="time"
                  value={form.end_time}
                  onChange={e => { setForm(f => ({ ...f, end_time: e.target.value })); setErrors(er => ({ ...er, end_time: "" })); }}
                  className={cn("h-10", errors.end_time && "border-destructive")}
                />
                {errors.end_time && <p className="text-xs text-destructive">{errors.end_time}</p>}
              </div>
            </div>

            {/* Duration badge */}
            {duration && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs px-3 py-1">
                  Duration: {duration.h}h {duration.m.toString().padStart(2, "0")}min
                </Badge>
              </div>
            )}

            {/* Overnight warning */}
            {needsOvernight && !form.allow_overnight && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted text-foreground">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="text-xs flex-1">End time is earlier than start time. Enable overnight shift?</span>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setForm(f => ({ ...f, allow_overnight: true }))}>
                  Enable
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Allow Overnight Shift</Label>
              <Switch
                checked={form.allow_overnight}
                onCheckedChange={v => setForm(f => ({ ...f, allow_overnight: v }))}
              />
            </div>
            {form.allow_overnight && (
              <p className="text-xs text-muted-foreground">End time moves to next day</p>
            )}
          </div>
        </DashedSectionCard>
      </div>

      {/* Section 4: Operational Rules */}
      <DashedSectionCard title="Operational Rules" icon={Settings} id="operational-rules">
        <div className="p-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Early Clock-In */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Allow Early Clock-In</Label>
                <Switch
                  checked={form.allow_early_clock_in}
                  onCheckedChange={v => setForm(f => ({ ...f, allow_early_clock_in: v }))}
                />
              </div>
              {form.allow_early_clock_in && (
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">Tolerance:</Label>
                  <Input
                    type="number"
                    min={0}
                    max={120}
                    value={form.early_tolerance_minutes}
                    onChange={e => setForm(f => ({ ...f, early_tolerance_minutes: parseInt(e.target.value) || 0 }))}
                    className="h-8 w-20 text-xs"
                  />
                  <span className="text-xs text-muted-foreground">min</span>
                </div>
              )}
            </div>

            {/* Late Clock-Out */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Allow Late Clock-Out</Label>
              <Switch
                checked={form.allow_late_clock_out}
                onCheckedChange={v => setForm(f => ({ ...f, allow_late_clock_out: v }))}
              />
            </div>

            {/* Force Close */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Force Close After</Label>
                <Switch
                  checked={form.force_close_after_hours !== null}
                  onCheckedChange={v => setForm(f => ({ ...f, force_close_after_hours: v ? 12 : null }))}
                />
              </div>
              {form.force_close_after_hours !== null && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={24}
                    value={form.force_close_after_hours}
                    onChange={e => setForm(f => ({ ...f, force_close_after_hours: parseInt(e.target.value) || 1 }))}
                    className="h-8 w-20 text-xs"
                  />
                  <span className="text-xs text-muted-foreground">hours</span>
                </div>
              )}
            </div>

            {/* Fingerprint */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Require Fingerprint for Clock-In</Label>
              <Switch
                checked={form.require_fingerprint}
                onCheckedChange={v => setForm(f => ({ ...f, require_fingerprint: v }))}
              />
            </div>
          </div>
        </div>
      </DashedSectionCard>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-[16rem] right-0 z-30 border-t bg-background px-6 py-3 flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/maintenance/shifts")} className="min-h-[48px] min-w-[100px]">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSaveClick} disabled={!isFormValid} className="min-h-[48px] min-w-[120px]">
          <Save className="h-4 w-4 mr-2" />
          Save Shift
        </Button>
      </div>

      <ConfirmActionModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmSave}
        title={mode === "edit" ? "Update Shift?" : "Create Shift?"}
        message={`Are you sure you want to ${mode === "edit" ? "update" : "create"} the shift "${form.name}"?`}
        confirmLabel={mode === "edit" ? "Update" : "Create"}
      />
    </div>
  );
}
