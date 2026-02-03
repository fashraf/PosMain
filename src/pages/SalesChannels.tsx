import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SalesChannelDialog } from "@/components/sales-channels/SalesChannelDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Store } from "lucide-react";

// Mock data - will be replaced with API calls
const initialChannels: SalesChannel[] = [
  {
    id: "1",
    name_en: "In-Store",
    name_ar: "في المتجر",
    name_ur: "اسٹور میں",
    code: "IN_STORE",
    icon: "🏪",
    is_active: true,
  },
  {
    id: "2",
    name_en: "Zomato",
    name_ar: "زوماتو",
    name_ur: "زوماٹو",
    code: "ZOMATO",
    icon: "🛵",
    is_active: true,
  },
  {
    id: "3",
    name_en: "Swiggy",
    name_ar: "سويجي",
    name_ur: "سویگی",
    code: "SWIGGY",
    icon: "🛵",
    is_active: true,
  },
  {
    id: "4",
    name_en: "Online Website",
    name_ar: "الموقع الإلكتروني",
    name_ur: "آن لائن ویب سائٹ",
    code: "ONLINE",
    icon: "🌐",
    is_active: false,
  },
];

export default function SalesChannels() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [channels, setChannels] = useState<SalesChannel[]>(initialChannels);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<SalesChannel | null>(null);
  const [deleteChannel, setDeleteChannel] = useState<SalesChannel | null>(null);

  const handleAddChannel = () => {
    setEditingChannel(null);
    setDialogOpen(true);
  };

  const handleEditChannel = (channel: SalesChannel) => {
    setEditingChannel(channel);
    setDialogOpen(true);
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

  const handleSaveChannel = (channelData: Omit<SalesChannel, "id"> & { id?: string }) => {
    if (channelData.id) {
      // Update existing
      setChannels((prev) =>
        prev.map((c) =>
          c.id === channelData.id ? { ...c, ...channelData } as SalesChannel : c
        )
      );
      toast({
        title: t("salesChannels.editChannel"),
        description: `${channelData.name_en} has been updated.`,
      });
    } else {
      // Add new
      const newChannel: SalesChannel = {
        ...channelData,
        id: Date.now().toString(),
      };
      setChannels((prev) => [...prev, newChannel]);
      toast({
        title: t("salesChannels.addChannel"),
        description: `${channelData.name_en} has been added.`,
      });
    }
  };

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
            />
          )}
        </CardContent>
      </Card>

      <SalesChannelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        channel={editingChannel}
        onSave={handleSaveChannel}
      />

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
    </div>
  );
}
