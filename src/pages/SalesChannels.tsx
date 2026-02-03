import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SalesChannelTable, type SalesChannel } from "@/components/sales-channels/SalesChannelTable";
import { ViewDetailsModal } from "@/components/shared/ViewDetailsModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Store, Globe, Code } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

// Mock data - will be replaced with API calls
const initialChannels: SalesChannel[] = [
  { id: "1", name_en: "In-Store", name_ar: "في المتجر", name_ur: "اسٹور میں", code: "IN_STORE", icon: "🏪", is_active: true },
  { id: "2", name_en: "Zomato", name_ar: "زوماتو", name_ur: "زوماٹو", code: "ZOMATO", icon: "🛵", is_active: true },
  { id: "3", name_en: "Swiggy", name_ar: "سويجي", name_ur: "سویگی", code: "SWIGGY", icon: "🛵", is_active: true },
  { id: "4", name_en: "Online Website", name_ar: "الموقع الإلكتروني", name_ur: "آن لائن ویب سائٹ", code: "ONLINE", icon: "🌐", is_active: false },
];

export default function SalesChannels() {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [channels, setChannels] = useState<SalesChannel[]>(initialChannels);
  const [deleteChannel, setDeleteChannel] = useState<SalesChannel | null>(null);
  const [viewingChannel, setViewingChannel] = useState<SalesChannel | null>(null);

  const getLocalizedName = (channel: SalesChannel) => {
    const nameKey = `name_${currentLanguage}` as keyof SalesChannel;
    return (channel[nameKey] as string) || channel.name_en;
  };

  const handleAddChannel = () => {
    navigate("/sales-channels/add");
  };

  const handleEditChannel = (channel: SalesChannel) => {
    navigate(`/sales-channels/${channel.id}/edit`);
  };

  const handleDeleteChannel = (channel: SalesChannel) => {
    setDeleteChannel(channel);
  };

  const confirmDelete = () => {
    if (deleteChannel) {
      setChannels((prev) => prev.filter((c) => c.id !== deleteChannel.id));
      toast({
        title: t("salesChannels.deleteChannel"),
        description: `${deleteChannel.name_en} has been deleted.`,
      });
      setDeleteChannel(null);
    }
  };

  const handleToggleStatus = (channel: SalesChannel) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channel.id ? { ...c, is_active: !c.is_active } : c
      )
    );
    toast({
      title: channel.is_active ? t("common.deactivate") : t("common.activate"),
      description: `${channel.name_en} has been ${channel.is_active ? "deactivated" : "activated"}.`,
    });
  };

  const handleViewChannel = (channel: SalesChannel) => {
    setViewingChannel(channel);
  };

  const getViewSections = (channel: SalesChannel) => [
    {
      title: t("branches.basicInfo"),
      fields: [
        { label: t("common.name") + " (EN)", value: channel.name_en, icon: Globe },
        { label: t("common.name") + " (AR)", value: channel.name_ar },
        { label: t("common.name") + " (UR)", value: channel.name_ur },
        { label: t("salesChannels.code"), value: <code className="rounded bg-muted px-2 py-1 text-sm">{channel.code}</code>, icon: Code },
        { label: t("salesChannels.icon"), value: <span className="text-2xl">{channel.icon}</span> },
        { label: t("common.status"), value: <StatusBadge isActive={channel.is_active} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {t("salesChannels.title")}
        </h1>
        <Button onClick={handleAddChannel}>
          <Plus className="h-4 w-4 me-2" />
          {t("salesChannels.addChannel")}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {channels.length === 0 ? (
            <EmptyState
              icon={Store}
              title={t("common.noData")}
              description={t("salesChannels.noChannels")}
              action={
                <Button onClick={handleAddChannel}>
                  <Plus className="h-4 w-4 me-2" />
                  {t("salesChannels.addChannel")}
                </Button>
              }
            />
          ) : (
            <SalesChannelTable
              channels={channels}
              onEdit={handleEditChannel}
              onDelete={handleDeleteChannel}
              onToggleStatus={handleToggleStatus}
              onView={handleViewChannel}
            />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteChannel} onOpenChange={() => setDeleteChannel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("salesChannels.deleteChannel")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("salesChannels.confirmDelete")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {viewingChannel && (
        <ViewDetailsModal
          open={!!viewingChannel}
          onOpenChange={() => setViewingChannel(null)}
          title={getLocalizedName(viewingChannel)}
          sections={getViewSections(viewingChannel)}
        />
      )}
    </div>
  );
}
