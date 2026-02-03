import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const languages: { code: Language; label: string; flag: string; nativeLabel: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸", nativeLabel: "English" },
  { code: "ar", label: "Arabic", flag: "🇸🇦", nativeLabel: "العربية" },
  { code: "ur", label: "Urdu", flag: "🇵🇰", nativeLabel: "اردو" },
];

export default function Settings() {
  const { t, currentLanguage, changeLanguage, isRTL } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("nav.settings")}</h1>
      </div>
      
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("languages.title")}</CardTitle>
          <CardDescription>
            {t("settings.languageDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid gap-4 sm:grid-cols-3",
            isRTL && "direction-rtl"
          )}>
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage === lang.code ? "default" : "outline"}
                className={cn(
                  "h-auto py-6 flex flex-col gap-2 relative",
                  currentLanguage === lang.code && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => changeLanguage(lang.code)}
              >
                {currentLanguage === lang.code && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <span className="text-3xl">{lang.flag}</span>
                <span className="font-semibold">{lang.nativeLabel}</span>
                <span className="text-xs opacity-70">{lang.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
