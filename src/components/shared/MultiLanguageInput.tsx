import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";

interface MultiLanguageInputProps {
  label: string;
  values: {
    en: string;
    ar: string;
    ur: string;
  };
  onChange: (lang: "en" | "ar" | "ur", value: string) => void;
  multiline?: boolean;
  required?: boolean;
}

export function MultiLanguageInput({
  label,
  values,
  onChange,
  multiline = false,
  required = false,
}: MultiLanguageInputProps) {
  const { isRTL } = useLanguage();
  
  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ms-1">*</span>}
      </Label>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
          <TabsTrigger value="ur">اردو</TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="mt-2">
          <InputComponent
            value={values.en}
            onChange={(e) => onChange("en", e.target.value)}
            placeholder={`${label} (English)`}
            dir="ltr"
            className="text-left"
          />
        </TabsContent>
        <TabsContent value="ar" className="mt-2">
          <InputComponent
            value={values.ar}
            onChange={(e) => onChange("ar", e.target.value)}
            placeholder={`${label} (العربية)`}
            dir="rtl"
            className="text-right"
          />
        </TabsContent>
        <TabsContent value="ur" className="mt-2">
          <InputComponent
            value={values.ur}
            onChange={(e) => onChange("ur", e.target.value)}
            placeholder={`${label} (اردو)`}
            dir="rtl"
            className="text-right"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
