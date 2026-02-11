import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Plus, Store, Globe, Code } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function SalesChannels() {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [channels, setChannels] = useState<SalesChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteChannel, setDeleteChannel] = useState<SalesChannel | null>(null);
  const [viewingChannel, setViewingChannel] = useState<SalesChannel | null>(null);

  const fetchChannels = async () => {
    const { data, error } = await supabase
      .from("sales_channels")
      .select("*")
      .order("name_en");
    if (!error && data) {
      setChannels(data as any);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchChannels(); }, []);

  const getLocalizedName = (channel: SalesChannel) => {
    const nameKey = `name_${currentLanguage}` as keyof SalesChannel;
    return (channel[nameKey] as string) || channel.name_en;
  };

  const handleAddChannel = () => navigate("/maintenance/sales-channels/add");
  const handleEditChannel = (channel: SalesChannel) => navigate(`/maintenance/sales-channels/${channel.id}/edit`);
  const handleDeleteChannel = (channel: SalesChannel) => setDeleteChannel(channel);

  const confirmDelete = async () => {
    if (!deleteChannel) return;
    const { error } = await supabase.from("sales_channels").delete().eq("id", deleteChannel.id);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      setChannels((prev) => prev.filter((c) => c.id !== deleteChannel.id));
      toast({ title: t("salesChannels.deleteChannel"), description: `${deleteChannel.name_en} has been deleted.` });
    }
    setDeleteChannel(null);
  };

  const handleToggleStatus = async (channel: SalesChannel) => {
    const newStatus = !channel.is_active;
    const { error } = await supabase.from("sales_channels").update({ is_active: newStatus }).eq("id", channel.id);
    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
      return;
    }
    setChannels((prev) => prev.map((c) => c.id === channel.id ? { ...c, is_active: newStatus } : c));
    toast({
      title: channel.is_active ? t("common.deactivate") : t("common.activate"),
      description: `${channel.name_en} has been ${channel.is_active ? "deactivated" : "activated"}.`,
    });
  };

  const handleViewChannel = (channel: SalesChannel) => setViewingChannel(channel);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("salesChannels.title")}</h1>
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
            <AlertDialogDescription>{t("salesChannels.confirmDelete")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t("common.delete")}</AlertDialogAction>
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
