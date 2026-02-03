import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Ingredients() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("ingredients.title")}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("ingredients.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ingredients management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
