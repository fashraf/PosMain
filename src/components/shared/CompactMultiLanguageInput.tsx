import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CompactMultiLanguageInputProps {
  label: string;
  values: {
    en: string;
    ar: string;
    ur: string;
  };
  onChange: (lang: "en" | "ar" | "ur", value: string) => void;
  multiline?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export function CompactMultiLanguageInput({
  label,
  values,
  onChange,
  multiline = false,
  required = false,
  className,
  placeholder,
}: CompactMultiLanguageInputProps) {
  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ms-1">*</span>}
      </Label>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="h-7 p-0.5 w-auto">
          <TabsTrigger value="en" className="text-xs px-2 py-1 h-6">EN</TabsTrigger>
          <TabsTrigger value="ar" className="text-xs px-2 py-1 h-6">AR</TabsTrigger>
          <TabsTrigger value="ur" className="text-xs px-2 py-1 h-6">UR</TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="mt-1.5">
          <InputComponent
            value={values.en}
            onChange={(e) => onChange("en", e.target.value)}
            placeholder={placeholder || `${label} (English)`}
            dir="ltr"
            className={cn("text-left", multiline && "min-h-[60px]")}
          />
        </TabsContent>
        <TabsContent value="ar" className="mt-1.5">
          <InputComponent
            value={values.ar}
            onChange={(e) => onChange("ar", e.target.value)}
            placeholder={placeholder || `${label} (العربية)`}
            dir="rtl"
            className={cn("text-right", multiline && "min-h-[60px]")}
          />
        </TabsContent>
        <TabsContent value="ur" className="mt-1.5">
          <InputComponent
            value={values.ur}
            onChange={(e) => onChange("ur", e.target.value)}
            placeholder={placeholder || `${label} (اردو)`}
            dir="rtl"
            className={cn("text-right", multiline && "min-h-[60px]")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
