import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score += 25;
  if (/[A-Z]/.test(pw)) score += 25;
  if (/[0-9]/.test(pw)) score += 25;
  if (/[^A-Za-z0-9]/.test(pw)) score += 25;
  if (score <= 25) return { score, label: "Weak", color: "bg-destructive" };
  if (score <= 50) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 75) return { score, label: "Good", color: "bg-primary" };
  return { score, label: "Strong", color: "bg-green-500" };
}

export function ChangePasswordCard() {
  const { t } = useLanguage();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(newPw);
  const canSubmit = currentPw && newPw.length >= 8 && newPw === confirmPw;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    // TODO: Call reset-password edge function
    setTimeout(() => {
      setLoading(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast({ title: "Password updated", description: "Your password has been changed successfully." });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          {t("auth.changePassword") || "Change Password"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Current Password</label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">New Password</label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPw && (
              <div className="space-y-1">
                <Progress value={strength.score} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{strength.label}</p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Confirm Password</label>
            <Input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="••••••••"
            />
            {confirmPw && confirmPw !== newPw && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={!canSubmit || loading} size="sm">
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
