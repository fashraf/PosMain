import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ExportButtonsProps {
  onExportCSV: () => void;
  onExportPDF?: () => void;
  label?: string;
}

async function logExport(eventType: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("finance_integration_logs" as any).insert({
      event_type: eventType,
      performed_by: user?.id || null,
      details: { timestamp: new Date().toISOString() },
    });
  } catch {
    // silent fail
  }
}

export function ExportButtons({ onExportCSV, onExportPDF, label }: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1"
        onClick={() => {
          logExport("export_excel");
          onExportCSV();
        }}
      >
        <FileDown className="h-3 w-3" />
        Excel
      </Button>
      {onExportPDF && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1"
          onClick={() => {
            logExport("export_pdf");
            onExportPDF();
          }}
        >
          <FileText className="h-3 w-3" />
          PDF
        </Button>
      )}
    </div>
  );
}

export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => `"${row[h] ?? ""}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
