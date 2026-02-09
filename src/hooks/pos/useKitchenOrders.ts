import { useEffect, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface KDSOrderItem {
  id: string;
  item_name: string;
  quantity: number;
  customization_json: any;
  is_completed: boolean;
  completed_at: string | null;
  kds_status_id: string | null;
}

export interface KDSOrder {
  id: string;
  order_number: number;
  order_type: string;
  customer_name: string | null;
  customer_mobile: string | null;
  payment_status: string;
  created_at: string;
  items: KDSOrderItem[];
}

export function useKitchenOrders() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["kds-orders"],
    queryFn: async () => {
      // Fetch today's active orders
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data: ordersData, error: ordersError } = await supabase
        .from("pos_orders")
        .select("id, order_number, order_type, customer_name, customer_mobile, payment_status, created_at")
        .in("payment_status", ["pending", "paid"])
        .gte("created_at", todayStart.toISOString())
        .neq("payment_status", "cancelled")
        .order("created_at", { ascending: true });

      if (ordersError) throw ordersError;
      if (!ordersData?.length) return [];

      const orderIds = ordersData.map((o) => o.id);

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from("pos_order_items")
        .select("id, order_id, item_name, quantity, customization_json")
        .in("order_id", orderIds);

      if (itemsError) throw itemsError;

      // Fetch KDS statuses
      const itemIds = (itemsData || []).map((i) => i.id);
      let kdsStatuses: any[] = [];
      if (itemIds.length > 0) {
        const { data: kdsData } = await supabase
          .from("kds_item_status")
          .select("id, order_item_id, is_completed, completed_at")
          .in("order_item_id", itemIds);
        kdsStatuses = kdsData || [];
      }

      // Build map
      const kdsMap = new Map(kdsStatuses.map((s) => [s.order_item_id, s]));

      // Assemble orders
      const result: KDSOrder[] = ordersData.map((order) => {
        const orderItems = (itemsData || [])
          .filter((i) => i.order_id === order.id)
          .map((item) => {
            const kds = kdsMap.get(item.id);
            return {
              id: item.id,
              item_name: item.item_name,
              quantity: item.quantity,
              customization_json: item.customization_json,
              is_completed: kds?.is_completed || false,
              completed_at: kds?.completed_at || null,
              kds_status_id: kds?.id || null,
            };
          });
        return { ...order, items: orderItems };
      });

      // Sort: completed orders sink to bottom, then newest first
      result.sort((a, b) => {
        const aAllDone = a.items.every((i) => i.is_completed);
        const bAllDone = b.items.every((i) => i.is_completed);
        if (aAllDone !== bAllDone) return aAllDone ? 1 : -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return result;
    },
    refetchInterval: 10000,
  });

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("kds-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "pos_orders" }, () => {
        queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "kds_item_status" }, () => {
        queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const markItemComplete = useMutation({
    mutationFn: async (orderItemId: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id || "")
        .single();

      const { error } = await supabase.from("kds_item_status").upsert(
        {
          order_item_id: orderItemId,
          is_completed: true,
          completed_at: new Date().toISOString(),
          completed_by: profile?.id || null,
        },
        { onConflict: "order_item_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
    },
  });

  const undoItemComplete = useMutation({
    mutationFn: async (orderItemId: string) => {
      const { error } = await supabase
        .from("kds_item_status")
        .delete()
        .eq("order_item_id", orderItemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
    },
  });

  const markAllComplete = useMutation({
    mutationFn: async (orderItemIds: string[]) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id || "")
        .single();

      const rows = orderItemIds.map((id) => ({
        order_item_id: id,
        is_completed: true,
        completed_at: new Date().toISOString(),
        completed_by: profile?.id || null,
      }));

      const { error } = await supabase
        .from("kds_item_status")
        .upsert(rows, { onConflict: "order_item_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
    },
  });

  const handleMarkComplete = useCallback(
    (orderItemId: string, itemName: string) => {
      markItemComplete.mutate(orderItemId);
      toast({
        title: `${itemName} marked as done`,
        description: "Tap undo to revert",
        duration: 3000,
      });
    },
    [markItemComplete]
  );

  const handleUndoComplete = useCallback(
    (orderItemId: string, itemName: string) => {
      undoItemComplete.mutate(orderItemId);
      toast({
        title: `${itemName} undone`,
        duration: 2000,
      });
    },
    [undoItemComplete]
  );

  const handleMarkAllComplete = useCallback(
    (orderItemIds: string[], orderNumber: number) => {
      markAllComplete.mutate(orderItemIds);
      toast({
        title: `Order #${orderNumber} — all items done`,
        duration: 3000,
      });
    },
    [markAllComplete]
  );

  return { orders, isLoading, refetch, handleMarkComplete, handleUndoComplete, handleMarkAllComplete };
}
