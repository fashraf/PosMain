import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TouchButtonProps extends ButtonProps {
  children: React.ReactNode;
}

/**
 * Touch-optimized button with minimum 48x48px touch target
 * Used throughout POS for consistent touch experience
 */
export const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "min-h-[48px] min-w-[48px]",
          "touch-manipulation",
          "active:scale-95 transition-transform duration-100",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

TouchButton.displayName = "TouchButton";
