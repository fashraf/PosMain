import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

const languages: { code: Language; label: string; flag: string; native: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸", native: "English" },
  { code: "ar", label: "Arabic", flag: "🇸🇦", native: "العربية" },
  { code: "ur", label: "Urdu", flag: "🇵🇰", native: "اردو" },
];

export function LanguageCard() {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          {t("profile.language") || "Language"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                currentLanguage === lang.code
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-accent"
              )}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-sm font-medium text-foreground">{lang.native}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
