import { useRef, useState, useEffect } from "react";
import { Camera, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
  const [isUploading, setIsUploading] = useState(false);

  // Sync with external value changes
  useEffect(() => {
    if (value !== previewUrl) {
      setPreviewUrl(value);
    }
  }, [value]);

  const uploadToStorage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${timestamp}_${sanitizedName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('item-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Show immediate preview with blob URL
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
      
      // Upload to storage
      const permanentUrl = await uploadToStorage(file);
      
      if (permanentUrl) {
        // Replace blob URL with permanent URL
        setPreviewUrl(permanentUrl);
        onChange(permanentUrl);
        onFileChange?.(file);
      } else {
        // Upload failed, keep blob preview but notify parent
        onChange(blobUrl);
        onFileChange?.(file);
      }
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
    if (!disabled && !isUploading) {
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
          (disabled || isUploading) && "opacity-50 cursor-not-allowed"
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
            <div className={cn(
              "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
              isUploading && "opacity-100"
            )}>
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </div>
            {/* Clear button */}
            {!disabled && !isUploading && (
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
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium text-center">Click to upload</span>
                <span className="text-[8px] text-muted-foreground/70">PNG, JPG up to 5MB</span>
              </>
            )}
          </div>
        )}

        {/* Camera overlay button */}
        {!previewUrl && !isUploading && (
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
        disabled={disabled || isUploading}
      />

      <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
        {isUploading ? "Uploading..." : "Auto-saved to storage"}
      </p>
    </div>
  );
}
