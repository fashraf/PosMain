import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Audit() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Audit Trail</h2>
          <p className="text-muted-foreground text-center text-sm">
            Comprehensive audit logging is coming soon. Track all system actions, user activities, and data changes in one place.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
