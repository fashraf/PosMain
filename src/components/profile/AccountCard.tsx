import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { format } from "date-fns";

export function AccountCard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const joinDate = user?.created_at ? format(new Date(user.created_at), "MMM dd, yyyy") : "—";
  const lastLogin = user?.last_sign_in_at ? format(new Date(user.last_sign_in_at), "MMM dd, yyyy HH:mm") : "—";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {t("profile.account") || "Account Overview"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{displayName}</h3>
            <p className="text-sm text-muted-foreground">{displayEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="font-medium text-foreground">{joinDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Last Login</p>
              <p className="font-medium text-foreground">{lastLogin}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
