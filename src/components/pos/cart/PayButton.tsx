import React from "react";
import { TouchButton } from "@/components/pos/shared";

interface PayButtonProps {
  total: number;
  disabled?: boolean;
  onClick: () => void;
}

export function PayButton({ total, disabled, onClick }: PayButtonProps) {
  return (
    <div className="border-t bg-background p-4">
      <TouchButton
        onClick={onClick}
        disabled={disabled}
        className="h-14 w-full text-base font-semibold"
      >
        PAY {total.toFixed(2)}
      </TouchButton>
    </div>
  );
}
