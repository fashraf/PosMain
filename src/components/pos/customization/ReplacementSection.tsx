import React from "react";
import { ReplacementCard } from "./ReplacementCard";
import type { POSItemReplacement } from "@/lib/pos/types";

interface ReplacementSectionProps {
  groupName: string;
  replacements: POSItemReplacement[];
  selectedId: string | null;
  onSelect: (replacement: POSItemReplacement | null) => void;
}

export function ReplacementSection({
  groupName,
  replacements,
  selectedId,
  onSelect,
}: ReplacementSectionProps) {
  return (
    <div>
      <h3 className="mb-3 font-semibold text-sm text-muted-foreground uppercase">
        Replace {groupName}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {replacements.map((replacement) => (
          <ReplacementCard
            key={replacement.id}
            replacement={replacement}
            isSelected={selectedId === replacement.id}
            onSelect={() =>
              onSelect(selectedId === replacement.id ? null : replacement)
            }
          />
        ))}
      </div>
    </div>
  );
}
