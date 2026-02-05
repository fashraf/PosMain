import React from "react";
import { User } from "lucide-react";

interface OrderTakenByProps {
  userName: string;
}

export function OrderTakenBy({ userName }: OrderTakenByProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
        Order Taken By
      </h3>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
        <User className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{userName}</span>
      </div>
    </div>
  );
}
