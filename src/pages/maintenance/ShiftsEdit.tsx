import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShiftFormPage } from "@/components/shifts/ShiftFormPage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ShiftsEdit() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data, error } = await supabase.from("shifts").select("*").eq("id", id).single();
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else if (data) {
        setInitialData({
          id: data.id,
          name: data.name,
          is_active: data.is_active,
          effective_from: new Date(data.effective_from),
          effective_to: new Date(data.effective_to),
          days_of_week: data.days_of_week,
          start_time: data.start_time?.slice(0, 5) || "",
          end_time: data.end_time?.slice(0, 5) || "",
          allow_overnight: data.allow_overnight,
          allow_early_clock_in: data.allow_early_clock_in,
          early_tolerance_minutes: data.early_tolerance_minutes,
          allow_late_clock_out: data.allow_late_clock_out,
          force_close_after_hours: data.force_close_after_hours,
          require_fingerprint: data.require_fingerprint,
        });
      }
      setIsLoading(false);
    };
    fetch();
  }, [id]);

  return <ShiftFormPage mode="edit" initialData={initialData} isLoading={isLoading} />;
}
