import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MultiLanguageInputWithIndicatorsProps {
  label: string;
  values: { en: string; ar: string; ur: string };
  onChange: (lang: "en" | "ar" | "ur", value: string) => void;
  multiline?: boolean;
  singleLine?: boolean;
  required?: boolean;
  placeholder?: string;
}

const LANGUAGES = [
  { code: "en" as const, label: "EN", dir: "ltr" },
  { code: "ar" as const, label: "AR", dir: "rtl" },
  { code: "ur" as const, label: "UR", dir: "rtl" },
];

export function MultiLanguageInputWithIndicators({
  label,
  values,
  onChange,
  multiline = false,
  singleLine = false,
  required = false,
  placeholder,
}: MultiLanguageInputWithIndicatorsProps) {
  const [activeLang, setActiveLang] = useState<"en" | "ar" | "ur">("en");

  // If singleLine is true, always use Input regardless of multiline
  const InputComponent = singleLine ? Input : (multiline ? Textarea : Input);

  return (
    <div className="space-y-1.5">
      {/* Label with language indicators */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </span>
        <div className="flex items-center gap-1">
          {LANGUAGES.map((lang) => {
            const hasContent = values[lang.code]?.trim().length > 0;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setActiveLang(lang.code)}
                className={cn(
                  "px-1.5 py-0.5 text-[12px] font-medium rounded transition-colors",
                  activeLang === lang.code
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted",
                  hasContent ? "text-green-600" : "text-red-500"
                )}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input field */}
      <InputComponent
        value={values[activeLang]}
        onChange={(e) => onChange(activeLang, e.target.value)}
        placeholder={placeholder}
        dir={LANGUAGES.find((l) => l.code === activeLang)?.dir}
        className={cn(
          "h-10",
          !singleLine && multiline && "min-h-[80px] resize-none"
        )}
      />
    </div>
  );
}