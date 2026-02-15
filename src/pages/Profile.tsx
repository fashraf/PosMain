import { useLanguage } from "@/hooks/useLanguage";
import { AccountCard } from "@/components/profile/AccountCard";
import { RoleCard } from "@/components/profile/RoleCard";
import { ChangePasswordCard } from "@/components/profile/ChangePasswordCard";
import { ActivitiesCard } from "@/components/profile/ActivitiesCard";
import { DarkModeCard } from "@/components/profile/DarkModeCard";
import { AlertsCard } from "@/components/profile/AlertsCard";
import { QuickLinksCard } from "@/components/profile/QuickLinksCard";
import { LanguageCard } from "@/components/profile/LanguageCard";

export default function Profile() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">{t("nav.myProfile") || "My Profile"}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountCard />
        <RoleCard />
      </div>

      <div id="password">
        <ChangePasswordCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitiesCard />
        <AlertsCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DarkModeCard />
        <div id="language">
          <LanguageCard />
        </div>
      </div>

      <QuickLinksCard />
    </div>
  );
}
