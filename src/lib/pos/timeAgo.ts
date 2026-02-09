export type TimeAgoLevel = "normal" | "warning" | "urgent" | "critical";

export interface TimeAgoResult {
  text: string;
  level: TimeAgoLevel;
}

export function getTimeAgo(createdAt: string, isUnpaid: boolean): TimeAgoResult {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const diffMs = now - created;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return { text: "- 0m", level: "normal" };
  if (diffMin < 15) return { text: `- ${diffMin}m`, level: "normal" };
  if (diffMin < 30) return { text: `- ${diffMin}m`, level: "warning" };
  if (diffMin < 60) return { text: `- ${diffMin}m`, level: isUnpaid ? "urgent" : "warning" };

  const hours = Math.floor(diffMin / 60);
  const remainMin = diffMin % 60;
  const text = remainMin > 0 ? `- ${hours}h ${remainMin}m` : `- ${hours}h`;
  return { text, level: "critical" };
}

export function getTimeAgoColor(level: TimeAgoLevel): string {
  switch (level) {
    case "normal": return "text-slate-400";
    case "warning": return "text-amber-600";
    case "urgent": return "text-orange-600";
    case "critical": return "text-orange-600";
  }
}
