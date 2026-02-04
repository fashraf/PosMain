import { useRef, useState, useEffect } from "react";
import { Camera, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadHeroProps {
  value: string | null;
  onChange: (url: string | null) => void;
  onFileChange?: (file: File | null) => void;
  size?: number;
  disabled?: boolean;
  className?: string;
}

export function ImageUploadHero({
  value,
  onChange,
  onFileChange,
  size = 100,
  disabled = false,
  className,
}: ImageUploadHeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);

  // Sync with external value changes
  useEffect(() => {
    if (value !== previewUrl) {
      setPreviewUrl(value);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(url);
      onFileChange?.(file); // Pass file for backend upload
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onChange(null);
    onFileChange?.(null);
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
              <Camera className="h-6 w-6 text-white" />
            </div>
            {/* Clear button */}
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 end-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground p-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium text-center">Click to upload</span>
            <span className="text-[8px] text-muted-foreground/70">PNG, JPG up to 5MB</span>
          </div>
        )}

        {/* Camera overlay button */}
        {!previewUrl && (
          <div className="absolute bottom-2 end-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Camera className="h-3 w-3" />
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

      <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
        {/* TODO: Connect to storage bucket for persistence */}
        Preview only
      </p>
    </div>
  );
}
