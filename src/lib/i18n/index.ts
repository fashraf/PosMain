import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations, Language } from "./translations";

// RTL languages
export const rtlLanguages: Language[] = ["ar", "ur"];

export const isRTL = (lang: Language): boolean => rtlLanguages.includes(lang);

// Get stored language or default to English
const getStoredLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("pos-language");
    if (stored && (stored === "en" || stored === "ar" || stored === "ur")) {
      return stored as Language;
    }
  }
  return "en";
};

// Flatten nested translations for i18next
const flattenObject = (obj: Record<string, unknown>, prefix = ""): Record<string, string> => {
  return Object.keys(obj).reduce((acc: Record<string, string>, k) => {
    const pre = prefix.length ? `${prefix}.` : "";
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k] as Record<string, unknown>, pre + k));
    } else {
      acc[pre + k] = obj[k] as string;
    }
    return acc;
  }, {});
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: flattenObject(translations.en as unknown as Record<string, unknown>) },
    ar: { translation: flattenObject(translations.ar as unknown as Record<string, unknown>) },
    ur: { translation: flattenObject(translations.ur as unknown as Record<string, unknown>) },
  },
  lng: getStoredLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Update document direction when language changes
i18n.on("languageChanged", (lng: string) => {
  const language = lng as Language;
  document.documentElement.dir = isRTL(language) ? "rtl" : "ltr";
  document.documentElement.lang = language;
  localStorage.setItem("pos-language", language);
});

// Set initial direction
const initialLang = getStoredLanguage();
if (typeof document !== "undefined") {
  document.documentElement.dir = isRTL(initialLang) ? "rtl" : "ltr";
  document.documentElement.lang = initialLang;
}

export default i18n;
export type { Language };
