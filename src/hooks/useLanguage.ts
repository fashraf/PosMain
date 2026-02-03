import { useTranslation } from "react-i18next";
import { Language, isRTL } from "@/lib/i18n";

export type { Language };

export function useLanguage() {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;
  const direction = isRTL(currentLanguage) ? "rtl" : "ltr";

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  return {
    t,
    currentLanguage,
    direction,
    isRTL: isRTL(currentLanguage),
    changeLanguage,
  };
}
