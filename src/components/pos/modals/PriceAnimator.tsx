import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PriceAnimatorProps {
  value: number;
  prefix?: string;
  className?: string;
}

export function PriceAnimator({ value, prefix = "", className }: PriceAnimatorProps) {
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlash(true);
      prevValue.current = value;
      const timer = setTimeout(() => setFlash(false), 400);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={cn(
        "tabular-nums font-bold transition-colors duration-300",
        flash && "text-primary",
        className
      )}
    >
      {prefix}{value.toFixed(2)}
    </span>
  );
}
