import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export type OrderStatusTab = "all" | "active" | "unpaid" | "completed" | "cancelled";
export type DateFilter = "today" | "yesterday" | "last7" | "all";

export interface OrderFilters {
  tab: OrderStatusTab;
  search: string;
  dateFilter: DateFilter;
  orderType: string;
  paymentMethod: string;
  cashier: string;
  page: number;
}

export interface OrderRow {
  id: string;
  order_number: number;
  order_type: string;
  payment_method: string | null;
  payment_status: string;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  created_at: string;
  taken_by: string | null;
  cancel_reason: string | null;
  cancelled_at: string | null;
  customer_name: string | null;
  customer_mobile: string | null;
  delivery_address: string | null;
  notes: string | null;
  tendered_amount: number | null;
  change_amount: number | null;
  vat_rate: number;
  cashier_name: string | null;
  items: OrderItemRow[];
}

export interface OrderItemRow {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  customization_json: any;
}

const PAGE_SIZE = 15;

function getDateRange(filter: DateFilter): { from: string; to: string } | null {
  if (filter === "all") return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (filter === "today") {
    return { from: today.toISOString(), to: new Date(today.getTime() + 86400000).toISOString() };
  }
  if (filter === "yesterday") {
    const y = new Date(today.getTime() - 86400000);
    return { from: y.toISOString(), to: today.toISOString() };
  }
  // last7
  const week = new Date(today.getTime() - 7 * 86400000);
  return { from: week.toISOString(), to: new Date(today.getTime() + 86400000).toISOString() };
}

async function fetchOrders(filters: OrderFilters) {
  let query = supabase
    .from("pos_orders")
    .select("*, profiles!pos_orders_taken_by_fkey(full_name), pos_order_items(*)")
    .order("created_at", { ascending: false });

  // Tab filters
  if (filters.tab === "active") {
    query = query.eq("payment_status", "paid");
    // Only today's
    const range = getDateRange("today");
    if (range) query = query.gte("created_at", range.from).lt("created_at", range.to);
  } else if (filters.tab === "unpaid") {
    query = query.eq("payment_status", "pending");
  } else if (filters.tab === "completed") {
    query = query.eq("payment_status", "paid");
  } else if (filters.tab === "cancelled") {
    query = query.eq("payment_status", "cancelled");
  }

  // Date filter (only when not overridden by tab)
  if (filters.tab !== "active") {
    const range = getDateRange(filters.dateFilter);
    if (range) {
      query = query.gte("created_at", range.from).lt("created_at", range.to);
    }
  }

  // Order type
  if (filters.orderType && filters.orderType !== "all") {
    query = query.eq("order_type", filters.orderType);
  }

  // Payment method
  if (filters.paymentMethod && filters.paymentMethod !== "all") {
    if (filters.paymentMethod === "pay_later") {
      query = query.is("payment_method", null);
    } else {
      query = query.eq("payment_method", filters.paymentMethod);
    }
  }

  // Pagination
  const from = filters.page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  // Map to OrderRow
  const orders: OrderRow[] = (data || []).map((row: any) => ({
    id: row.id,
    order_number: row.order_number,
    order_type: row.order_type,
    payment_method: row.payment_method,
    payment_status: row.payment_status,
    subtotal: row.subtotal,
    vat_amount: row.vat_amount,
    total_amount: row.total_amount,
    created_at: row.created_at,
    taken_by: row.taken_by,
    cancel_reason: row.cancel_reason,
    cancelled_at: row.cancelled_at,
    customer_name: row.customer_name,
    customer_mobile: row.customer_mobile,
    delivery_address: row.delivery_address,
    notes: row.notes,
    tendered_amount: row.tendered_amount,
    change_amount: row.change_amount,
    vat_rate: row.vat_rate,
    cashier_name: row.profiles?.full_name || null,
    items: (row.pos_order_items || []).map((item: any) => ({
      id: item.id,
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.line_total,
      customization_json: item.customization_json,
    })),
  }));

  // Client-side search filter (order # or item name)
  let filtered = orders;
  if (filters.search.trim()) {
    const s = filters.search.trim().toLowerCase();
    filtered = orders.filter(
      (o) =>
        String(o.order_number).includes(s) ||
        o.items.some((it) => it.item_name.toLowerCase().includes(s))
    );
  }

  // Cashier filter
  if (filters.cashier && filters.cashier !== "all") {
    filtered = filtered.filter((o) => o.taken_by === filters.cashier);
  }

  return filtered;
}

export function usePOSOrders(filters: OrderFilters) {
  const queryClient = useQueryClient();
  const blinkOrdersRef = useRef<Set<string>>(new Set());

  const result = useQuery({
    queryKey: ["pos-orders", filters],
    queryFn: () => fetchOrders(filters),
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });

  // Realtime subscription for new orders
  useEffect(() => {
    const channel = supabase
      .channel("pos-orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pos_orders" },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new) {
            blinkOrdersRef.current.add(payload.new.id as string);
            // Auto-clear blink after 5 blinks (~7.5s)
            setTimeout(() => {
              blinkOrdersRef.current.delete(payload.new.id as string);
            }, 7500);
          }
          queryClient.invalidateQueries({ queryKey: ["pos-orders"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const shouldBlink = useCallback(
    (orderId: string) => blinkOrdersRef.current.has(orderId),
    []
  );

  return { ...result, shouldBlink, pageSize: PAGE_SIZE, dataUpdatedAt: result.dataUpdatedAt };
}

export interface OrderStats {
  total: number;
  inProcess: number;
  completed: number;
  paymentPending: number;
  totalSales: number;
  cancelledCount: number;
}

export function useOrderStats(dateFilter: DateFilter) {
  return useQuery({
    queryKey: ["pos-order-stats", dateFilter],
    queryFn: async (): Promise<OrderStats> => {
      const range = getDateRange(dateFilter);
      let query = supabase
        .from("pos_orders")
        .select("payment_status, total_amount");
      if (range) {
        query = query.gte("created_at", range.from).lt("created_at", range.to);
      }
      const { data, error } = await query;
      if (error) throw error;
      const rows = data || [];
      const paid = rows.filter((r) => r.payment_status === "paid");
      return {
        total: rows.length,
        inProcess: rows.filter((r) => r.payment_status === "pending").length,
        completed: paid.length,
        paymentPending: rows.filter((r) => r.payment_status === "pending").length,
        totalSales: paid.reduce((sum, r) => sum + (r.total_amount || 0), 0),
        cancelledCount: rows.filter((r) => r.payment_status === "cancelled").length,
      };
    },
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
}

export function useUserRole() {
  const queryResult = useQuery({
    queryKey: ["current-user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      return (data || []).map((r) => r.role);
    },
    staleTime: 60000,
  });
  const roles = queryResult.data || [];
  return {
    roles,
    isManager: roles.includes("manager") || roles.includes("admin"),
    isAdmin: roles.includes("admin"),
    isLoading: queryResult.isLoading,
  };
}
