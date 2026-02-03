import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ItemPricing() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("itemPricing.title")}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("itemPricing.priceMatrix")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Item pricing matrix coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
