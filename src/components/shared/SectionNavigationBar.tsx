import { LucideIcon, Check, Circle, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export interface SectionNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isComplete: boolean;
}

interface SectionNavigationBarProps {
  sections: SectionNavItem[];
  activeSection?: string;
  onNavigate: (sectionId: string) => void;
  onBack?: () => void;
  backLabel?: string;
}

export function SectionNavigationBar({
  sections,
  activeSection,
  onNavigate,
  onBack,
  backLabel = "BACK",
}: SectionNavigationBarProps) {
  const { isRTL } = useLanguage();
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
      <div className="flex items-center gap-2 p-2 overflow-x-auto scrollbar-thin">
        {/* Section pills */}
        <div className="flex items-center gap-2 flex-1">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onNavigate(section.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
                "border transition-all duration-200 whitespace-nowrap",
                "hover:shadow-sm",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted/50 border-border hover:bg-muted hover:border-muted-foreground/30"
              )}
            >
              <section.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="font-medium">{section.label}</span>
              {section.isComplete ? (
                <Check className={cn(
                  "h-3.5 w-3.5",
                  activeSection === section.id ? "text-primary-foreground" : "text-accent-foreground"
                )} strokeWidth={2} />
              ) : (
                <Circle className={cn(
                  "h-3.5 w-3.5",
                  activeSection === section.id ? "text-primary-foreground/60" : "text-muted-foreground/40"
                )} strokeWidth={1.5} />
              )}
            </button>
          ))}
        </div>

        {/* Back button on right */}
        {onBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 shrink-0"
          >
            <BackIcon className="h-4 w-4" />
            <span className="font-medium">{backLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
