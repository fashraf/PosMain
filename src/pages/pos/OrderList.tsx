import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ClipboardList, ChevronRight, ChevronDown, AlertTriangle, Eye } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { TouchButton } from "@/components/pos/shared";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  OrderStatusBadge, OrderItemsTooltip, OrderDetailDrawer,
  CollectPaymentModal, DeleteOrderModal,
} from "@/components/pos/orders";
import { OrderStatCards } from "@/components/pos/orders/OrderStatCards";
import { ExpandedOrderItems } from "@/components/pos/orders/ExpandedOrderItems";
import { CancelOrderModal } from "@/components/pos/modals/CancelOrderModal";
import {
  usePOSOrders, useUserRole, useOrderStats,
  type OrderFilters, type OrderStatusTab, type DateFilter, type OrderRow,
} from "@/hooks/pos/usePOSOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getTimeAgo, getTimeAgoColor } from "@/lib/pos/timeAgo";

const ORDER_TYPE_LABELS: Record<string, string> = {
  dine_in: "Dine In", takeaway: "Take Away", delivery: "Delivery", self_pickup: "Self Pickup",
};
const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash", card: "Card", both: "Split", pay_later: "Pay Later",
};

const TABS: { key: OrderStatusTab; label: string; unpaid?: boolean }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "unpaid", label: "Unpaid", unpaid: true },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function OrderList() {
  const navigate = useNavigate();
  const { isManager } = useUserRole();

  const [filters, setFilters] = useState<OrderFilters>({
    tab: "all", search: "", dateFilter: "today", orderType: "all",
    paymentMethod: "all", cashier: "all", page: 0,
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const { data: orders, isLoading, shouldBlink, pageSize } = usePOSOrders(filters);
  const { data: stats } = useOrderStats(filters.dateFilter);

  const [drawerOrder, setDrawerOrder] = useState<OrderRow | null>(null);
  const [payOrder, setPayOrder] = useState<OrderRow | null>(null);
  const [cancelOrder, setCancelOrder] = useState<OrderRow | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState<OrderRow | null>(null);

  // Tick every 30s to refresh time-ago
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const updateFilter = <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? (value as number) : 0 }));
  };

  const handleCancel = async (reason: string) => {
    if (!cancelOrder) return;
    setIsCancelling(true);
    try {
      const { error } = await supabase
        .from("pos_orders")
        .update({ payment_status: "cancelled", cancelled_at: new Date().toISOString(), cancel_reason: reason })
        .eq("id", cancelOrder.id);
      if (error) throw error;
      toast({ title: "Cancelled", description: `Order #${cancelOrder.order_number} cancelled.` });
      setCancelOrder(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsCancelling(false);
    }
  };

  const getTabCount = (tab: OrderStatusTab): number => {
    if (!stats) return 0;
    switch (tab) {
      case "all": return stats.total;
      case "active": return stats.inProcess;
      case "unpaid": return stats.paymentPending;
      case "completed": return stats.completed;
      case "cancelled": return stats.cancelledCount;
      default: return 0;
    }
  };

  const list = orders || [];
  const hasNext = list.length === pageSize;

  return (
    <div className="flex flex-col h-full bg-white pos-orders-font">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-slate-600" />
          <h1 className="text-lg font-bold text-slate-800">Orders</h1>
        </div>
        <TouchButton className="rounded-lg h-9 px-4 gap-2 text-sm" onClick={() => navigate("/pos")}>
          <Plus className="h-4 w-4" /> New Order
        </TouchButton>
      </div>

      {/* Stat Cards */}
      <OrderStatCards stats={stats || { total: 0, inProcess: 0, completed: 0, paymentPending: 0, totalSales: 0, cancelledCount: 0 }} isLoading={!stats} />

      {/* Tabs + Filters */}
      <div className="sticky top-[57px] z-20 bg-white border-b border-slate-200 px-5 py-0 flex flex-wrap items-end gap-0">
        {/* Custom tabs */}
        <div className="flex items-end">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => updateFilter("tab", tab.key)}
              className={cn(
                "pos-tab",
                filters.tab === tab.key && "active",
                tab.unpaid && "unpaid-tab"
              )}
            >
              {tab.unpaid && filters.tab !== tab.key && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5 mb-0.5" />
              )}
              {tab.label}
              <span className="ml-1 text-xs opacity-60">({getTabCount(tab.key)})</span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Filters */}
        <div className="flex items-center gap-2 pb-2">
          <div className="relative min-w-[160px] max-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search…"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-8 h-8 rounded-lg text-xs border-slate-200"
            />
          </div>
          <Select value={filters.dateFilter} onValueChange={(v) => updateFilter("dateFilter", v as DateFilter)}>
            <SelectTrigger className="w-[100px] h-8 rounded-lg text-xs border-slate-200"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7">Last 7 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.orderType} onValueChange={(v) => updateFilter("orderType", v)}>
            <SelectTrigger className="w-[100px] h-8 rounded-lg text-xs border-slate-200"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="dine_in">Dine In</SelectItem>
              <SelectItem value="takeaway">Take Away</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="self_pickup">Self Pickup</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.paymentMethod} onValueChange={(v) => updateFilter("paymentMethod", v)}>
            <SelectTrigger className="w-[100px] h-8 rounded-lg text-xs border-slate-200"><SelectValue placeholder="Payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="both">Split</SelectItem>
              <SelectItem value="pay_later">Pay Later</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-5 py-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Loading orders…</div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm gap-2">
            <ClipboardList className="h-8 w-8 opacity-40" /> No orders found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="w-[28px]" />
                <TableHead className="w-[70px] text-xs text-slate-500 font-medium">Order #</TableHead>
                <TableHead className="text-xs text-slate-500 font-medium">Items</TableHead>
                <TableHead className="w-[75px] text-xs text-slate-500 font-medium">Type</TableHead>
                <TableHead className="w-[65px] text-xs text-slate-500 font-medium">Payment</TableHead>
                <TableHead className="w-[70px] text-right text-xs text-slate-500 font-medium">Total</TableHead>
                <TableHead className="w-[55px] text-xs text-slate-500 font-medium">Time</TableHead>
                <TableHead className="w-[75px] text-xs text-slate-500 font-medium">Time Ago</TableHead>
                <TableHead className="w-[65px] text-xs text-slate-500 font-medium">Status</TableHead>
                <TableHead className="w-[60px] text-center text-xs text-slate-500 font-medium">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((order) => {
                const isUnpaid = order.payment_status === "pending";
                const isCancelled = order.payment_status === "cancelled";
                const blinking = shouldBlink(order.id);
                const isExpanded = expandedId === order.id;
                const timeAgo = getTimeAgo(order.created_at, isUnpaid);

                return (
                  <React.Fragment key={order.id}>
                    <TableRow
                      className={cn(
                        "h-[42px] cursor-pointer transition-colors hover:bg-[#F8FAFC] border-slate-100",
                        isUnpaid && "pos-unpaid-row",
                        blinking && "animate-new-order-blink"
                      )}
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    >
                      <TableCell className="px-1">
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-700">
                        #{order.order_number}
                      </TableCell>
                      <TableCell>
                        <OrderItemsTooltip
                          items={order.items}
                          subtotal={order.subtotal}
                          vatAmount={order.vat_amount}
                          total={order.total_amount}
                        />
                      </TableCell>
                      <TableCell className="text-[12px] text-slate-500">
                        {ORDER_TYPE_LABELS[order.order_type] || order.order_type}
                      </TableCell>
                      <TableCell className="text-[12px] capitalize text-slate-500">
                        {order.payment_method ? PAYMENT_LABELS[order.payment_method] || order.payment_method : "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums text-slate-700">
                        {order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-[12px] text-slate-400">
                        {format(new Date(order.created_at), "HH:mm")}
                      </TableCell>
                      <TableCell>
                        <span className={cn("text-[12px] inline-flex items-center gap-1", getTimeAgoColor(timeAgo.level))}>
                          {timeAgo.level === "critical" && <AlertTriangle className="h-3 w-3" />}
                          {timeAgo.text}
                        </span>
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.payment_status} blink={blinking} />
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                          onClick={() => setDrawerOrder(order)}
                        >
                          <Eye className="h-3 w-3" /> View
                        </button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && <ExpandedOrderItems items={order.items} />}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {list.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-2 flex items-center justify-between text-sm">
          <span className="text-slate-400 text-xs">Page {filters.page + 1}</span>
          <div className="flex gap-2">
            <TouchButton variant="outline" size="sm" className="rounded-lg h-8 text-xs border-slate-200"
              disabled={filters.page === 0} onClick={() => updateFilter("page", filters.page - 1)}>
              Previous
            </TouchButton>
            <TouchButton variant="outline" size="sm" className="rounded-lg h-8 text-xs border-slate-200"
              disabled={!hasNext} onClick={() => updateFilter("page", filters.page + 1)}>
              Next
            </TouchButton>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <OrderDetailDrawer
        order={drawerOrder}
        open={!!drawerOrder}
        onOpenChange={(v) => !v && setDrawerOrder(null)}
        onEdit={(o) => navigate("/pos", { state: { editOrderId: o.id } })}
        onCollectPayment={(o) => setPayOrder(o)}
        onCancel={(o) => setCancelOrder(o)}
      />
      {payOrder && (
        <CollectPaymentModal open={!!payOrder} onOpenChange={(v) => !v && setPayOrder(null)}
          orderId={payOrder.id} orderNumber={payOrder.order_number}
          totalAmount={payOrder.total_amount} onSuccess={() => setPayOrder(null)} />
      )}
      <CancelOrderModal open={!!cancelOrder} onOpenChange={(v) => !v && setCancelOrder(null)}
        onConfirm={handleCancel} isSubmitting={isCancelling} />
      {deleteOrder && (
        <DeleteOrderModal open={!!deleteOrder} onOpenChange={(v) => !v && setDeleteOrder(null)}
          orderId={deleteOrder.id} orderNumber={deleteOrder.order_number}
          onSuccess={() => setDeleteOrder(null)} />
      )}
    </div>
  );
}
