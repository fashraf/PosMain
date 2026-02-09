import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Banknote, XCircle, Trash2, AlertTriangle, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { TouchButton } from "@/components/pos/shared";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  OrderStatusBadge,
  OrderItemsTooltip,
  OrderDetailDrawer,
  CollectPaymentModal,
  DeleteOrderModal,
} from "@/components/pos/orders";
import { CancelOrderModal } from "@/components/pos/modals/CancelOrderModal";
import {
  usePOSOrders,
  useUserRole,
  type OrderFilters,
  type OrderStatusTab,
  type DateFilter,
  type OrderRow,
} from "@/hooks/pos/usePOSOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ORDER_TYPE_LABELS: Record<string, string> = {
  dine_in: "Dine In",
  takeaway: "Take Away",
  delivery: "Delivery",
  self_pickup: "Self Pickup",
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  both: "Split",
  pay_later: "Pay Later",
};

export default function OrderList() {
  const navigate = useNavigate();
  const { isManager } = useUserRole();

  const [filters, setFilters] = useState<OrderFilters>({
    tab: "all",
    search: "",
    dateFilter: "today",
    orderType: "all",
    paymentMethod: "all",
    cashier: "all",
    page: 0,
  });

  const { data: orders, isLoading, shouldBlink, pageSize } = usePOSOrders(filters);

  // Drawer
  const [drawerOrder, setDrawerOrder] = useState<OrderRow | null>(null);
  // Collect Payment
  const [payOrder, setPayOrder] = useState<OrderRow | null>(null);
  // Cancel
  const [cancelOrder, setCancelOrder] = useState<OrderRow | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  // Delete
  const [deleteOrder, setDeleteOrder] = useState<OrderRow | null>(null);

  const updateFilter = <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? (value as number) : 0 }));
  };

  const handleCancel = async (reason: string) => {
    if (!cancelOrder) return;
    setIsCancelling(true);
    try {
      const { error } = await supabase
        .from("pos_orders")
        .update({
          payment_status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancel_reason: reason,
        })
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

  const list = orders || [];
  const hasNext = list.length === pageSize;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Orders</h1>
        </div>
        <TouchButton
          className="rounded-xl h-10 px-4 gap-2"
          onClick={() => navigate("/pos")}
        >
          <Plus className="h-4 w-4" />
          New Order
        </TouchButton>
      </div>

      {/* Status Tabs */}
      <div className="sticky top-[57px] z-20 bg-background border-b border-border px-5 py-2">
        <Tabs
          value={filters.tab}
          onValueChange={(v) => updateFilter("tab", v as OrderStatusTab)}
        >
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="unpaid" className="gap-1">
              Unpaid
              <AlertTriangle className="h-3 w-3 text-destructive" />
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[105px] z-20 bg-background border-b border-border px-5 py-2 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order # or item…"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9 h-9 rounded-lg text-sm"
          />
        </div>

        <Select value={filters.dateFilter} onValueChange={(v) => updateFilter("dateFilter", v as DateFilter)}>
          <SelectTrigger className="w-[130px] h-9 rounded-lg text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="last7">Last 7 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.orderType} onValueChange={(v) => updateFilter("orderType", v)}>
          <SelectTrigger className="w-[130px] h-9 rounded-lg text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="dine_in">Dine In</SelectItem>
            <SelectItem value="takeaway">Take Away</SelectItem>
            <SelectItem value="delivery">Delivery</SelectItem>
            <SelectItem value="self_pickup">Self Pickup</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.paymentMethod} onValueChange={(v) => updateFilter("paymentMethod", v)}>
          <SelectTrigger className="w-[130px] h-9 rounded-lg text-sm">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="both">Split</SelectItem>
            <SelectItem value="pay_later">Pay Later</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-5 py-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
            Loading orders…
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
            <ClipboardList className="h-8 w-8 opacity-40" />
            No orders found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px]">Order #</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="w-[90px]">Type</TableHead>
                <TableHead className="w-[80px]">Payment</TableHead>
                <TableHead className="w-[90px] text-right">Total</TableHead>
                <TableHead className="w-[70px]">Time</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[120px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((order) => {
                const isUnpaid = order.payment_status === "pending";
                const isCancelled = order.payment_status === "cancelled";
                const blinking = shouldBlink(order.id);

                return (
                  <TableRow
                    key={order.id}
                    className={cn(
                      isUnpaid && "animate-pulse-red",
                      blinking && "animate-new-order-blink"
                    )}
                  >
                    <TableCell>
                      <button
                        className="text-primary font-semibold hover:underline"
                        onClick={() => setDrawerOrder(order)}
                      >
                        #{order.order_number}
                      </button>
                    </TableCell>
                    <TableCell>
                      <OrderItemsTooltip
                        items={order.items}
                        subtotal={order.subtotal}
                        vatAmount={order.vat_amount}
                        total={order.total_amount}
                      />
                    </TableCell>
                    <TableCell className="text-[13px]">
                      {ORDER_TYPE_LABELS[order.order_type] || order.order_type}
                    </TableCell>
                    <TableCell className="text-[13px] capitalize">
                      {order.payment_method ? PAYMENT_LABELS[order.payment_method] || order.payment_method : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {order.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {format(new Date(order.created_at), "HH:mm")}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.payment_status} blink={blinking} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {!isCancelled && (
                          <button
                            className="grid-action-btn"
                            title="Edit Order"
                            onClick={() =>
                              navigate("/pos", { state: { editOrderId: order.id } })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {isUnpaid && (
                          <button
                            className="grid-action-btn"
                            title="Collect Payment"
                            onClick={() => setPayOrder(order)}
                          >
                            <Banknote className="h-4 w-4" />
                          </button>
                        )}
                        {!isCancelled && (
                          <button
                            className="grid-action-btn danger"
                            title="Cancel Order"
                            onClick={() => setCancelOrder(order)}
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        {isManager && (
                          <button
                            className="grid-action-btn danger"
                            title="Delete Order"
                            onClick={() => setDeleteOrder(order)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {list.length > 0 && (
        <div className="sticky bottom-0 bg-background border-t border-border px-5 py-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {filters.page + 1}
          </span>
          <div className="flex gap-2">
            <TouchButton
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={filters.page === 0}
              onClick={() => updateFilter("page", filters.page - 1)}
            >
              Previous
            </TouchButton>
            <TouchButton
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={!hasNext}
              onClick={() => updateFilter("page", filters.page + 1)}
            >
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
      />

      {payOrder && (
        <CollectPaymentModal
          open={!!payOrder}
          onOpenChange={(v) => !v && setPayOrder(null)}
          orderId={payOrder.id}
          orderNumber={payOrder.order_number}
          totalAmount={payOrder.total_amount}
          onSuccess={() => setPayOrder(null)}
        />
      )}

      <CancelOrderModal
        open={!!cancelOrder}
        onOpenChange={(v) => !v && setCancelOrder(null)}
        onConfirm={handleCancel}
        isSubmitting={isCancelling}
      />

      {deleteOrder && (
        <DeleteOrderModal
          open={!!deleteOrder}
          onOpenChange={(v) => !v && setDeleteOrder(null)}
          orderId={deleteOrder.id}
          orderNumber={deleteOrder.order_number}
          onSuccess={() => setDeleteOrder(null)}
        />
      )}
    </div>
  );
}
