import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ItemImageProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

/**
 * Item image component with lazy loading and placeholder
 * - 40x40 default size
 * - Shows placeholder icon if no image
 * - Lazy loading for performance
 */
export function ItemImage({ src, alt, size = "md", className }: ItemImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const showPlaceholder = !src || hasError;

  return (
    <div
      className={cn(
        sizeClasses[size],
        "relative flex-shrink-0 overflow-hidden rounded-lg bg-muted",
        className
      )}
    >
      {showPlaceholder ? (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageIcon className="h-4 w-4 text-muted-foreground animate-pulse" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "h-full w-full object-cover",
              !isLoaded && "opacity-0"
            )}
          />
        </>
      )}
    </div>
  );
}
