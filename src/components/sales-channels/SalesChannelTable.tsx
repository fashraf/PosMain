import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { Edit, Trash2, Eye } from "lucide-react";

export interface SalesChannel {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  code: string;
  icon: string | null;
  is_active: boolean;
}

interface SalesChannelTableProps {
  channels: SalesChannel[];
  onEdit: (channel: SalesChannel) => void;
  onDelete: (channel: SalesChannel) => void;
  onToggleStatus: (channel: SalesChannel) => void;
  onView?: (channel: SalesChannel) => void;
}

export function SalesChannelTable({
  channels,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}: SalesChannelTableProps) {
  const { t, currentLanguage } = useLanguage();

  const getLocalizedName = (channel: SalesChannel) => {
    const nameKey = `name_${currentLanguage}` as keyof SalesChannel;
    return (channel[nameKey] as string) || channel.name_en;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">{t("common.name")}</TableHead>
            <TableHead className="font-semibold">{t("salesChannels.code")}</TableHead>
            <TableHead className="font-semibold">{t("common.status")}</TableHead>
            <TableHead className="font-semibold text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channels.map((channel) => (
            <TableRow key={channel.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {channel.icon && <span className="text-lg">{channel.icon}</span>}
                  {getLocalizedName(channel)}
                </div>
              </TableCell>
              <TableCell>
                <code className="rounded bg-muted px-2 py-1 text-sm">
                  {channel.code}
                </code>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={channel.is_active}
                    onCheckedChange={() => onToggleStatus(channel)}
                  />
                  <StatusBadge isActive={channel.is_active} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(channel)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(channel)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(channel)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
