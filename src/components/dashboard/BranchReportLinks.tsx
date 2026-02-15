import { useNavigate } from "react-router-dom";
import { FileText, TrendingUp, GitCompare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  branchId?: string;
}

export default function BranchReportLinks({ branchId }: Props) {
  const navigate = useNavigate();

  const links = [
    { label: "Daily Summary", icon: FileText, path: "/finance" },
    { label: "Weekly Trend", icon: TrendingUp, path: "/finance/revenue" },
    { label: "Branch Comparison", icon: GitCompare, path: "/finance" },
    { label: "Export PDF/Excel", icon: Download, path: "/finance/revenue" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reports & Export</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Button
              key={link.label}
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => navigate(link.path)}
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
