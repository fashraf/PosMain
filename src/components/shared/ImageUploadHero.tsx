import { useRef, useState } from "react";
import { Camera, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadHeroProps {
  value: string | null;
  onChange: (url: string | null) => void;
  size?: number;
  disabled?: boolean;
  className?: string;
}

export function ImageUploadHero({
  value,
  onChange,
  size = 200,
  disabled = false,
  className,
}: ImageUploadHeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(url);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        onClick={handleClick}
        style={{ width: size, height: size }}
        className={cn(
          "relative rounded-xl overflow-hidden cursor-pointer group",
          "border-2 border-dashed border-muted-foreground/30",
          "bg-muted/30 transition-all duration-200",
          "hover:border-primary/50 hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-8 w-8 text-white" />
            </div>
            {/* Clear button */}
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 end-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8" />
            </div>
            <span className="text-xs font-medium">Click to upload</span>
            <span className="text-[10px] text-muted-foreground/70">PNG, JPG up to 5MB</span>
          </div>
        )}

        {/* Camera overlay button */}
        {!previewUrl && (
          <div className="absolute bottom-3 end-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Camera className="h-4 w-4" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <p className="text-[11px] text-muted-foreground mt-2 text-center">
        Image upload coming soon
      </p>
    </div>
  );
}
