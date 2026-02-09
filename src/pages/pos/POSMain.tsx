import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SplitPanelContainer } from "@/components/pos/layout";
import { CategoryBar } from "@/components/pos/category";
import { POSItemGrid } from "@/components/pos/items";
import { CartPanel } from "@/components/pos/cart";
import { usePOSCart } from "@/hooks/pos";
import { usePOSCategories, usePOSItems } from "@/hooks/pos";
import { CustomizeDrawer } from "@/components/pos/customization";
import { ItemDetailsModal, CustomizeModal } from "@/components/pos/modals";
import { CheckoutModal } from "@/components/pos/checkout";
import { supabase } from "@/integrations/supabase/client";
import type { POSMenuItem } from "@/lib/pos/types";

export default function POSMain() {
  const location = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Edit mode state
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editingOrderNumber, setEditingOrderNumber] = useState<number | null>(null);

  // Modal states
  const [detailsItem, setDetailsItem] = useState<POSMenuItem | null>(null);
  const [customizeModalItem, setCustomizeModalItem] = useState<POSMenuItem | null>(null);
  const [editingCartItemIdForModal, setEditingCartItemIdForModal] = useState<string | null>(null);

  const [showCheckout, setShowCheckout] = useState(false);
  const [highlight, setHighlight] = useState<{ id: string; color: 'green' | 'red'; tick: number } | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>();

  const cart = usePOSCart();

  // Detect edit mode from navigation state
  useEffect(() => {
    const state = location.state as { editOrderId?: string } | null;
    if (!state?.editOrderId) return;

    const orderId = state.editOrderId;
    // Clear the state so refreshing doesn't re-trigger
    window.history.replaceState({}, document.title);

    const loadOrder = async () => {
      const { data: order } = await supabase
        .from("pos_orders")
        .select("id, order_number")
        .eq("id", orderId)
        .single();

      if (!order) return;

      const { data: orderItems } = await supabase
        .from("pos_order_items")
        .select("*")
        .eq("order_id", orderId);

      if (!orderItems) return;

      cart.clearCart();
      for (const item of orderItems) {
        cart.addItem({
          menuItemId: item.menu_item_id || "",
          name: item.item_name,
          basePrice: item.unit_price,
          quantity: item.quantity,
        });
      }

      setEditingOrderId(order.id);
      setEditingOrderNumber(order.order_number);
    };

    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const triggerHighlight = useCallback((id: string, color: 'green' | 'red') => {
    clearTimeout(highlightTimer.current);
    setHighlight(prev => ({ id, color, tick: (prev?.tick ?? 0) + 1 }));
    highlightTimer.current = setTimeout(() => setHighlight(null), 2000);
  }, []);

  const handleAddItem = useCallback((item: POSMenuItem) => {
    cart.addItem({
      menuItemId: item.id,
      name: item.name_en,
      basePrice: item.base_price,
      quantity: 1,
    });
    const matchingItem = cart.items.find((i) => i.menuItemId === item.id);
    const idToHighlight = matchingItem?.id ?? item.id;
    triggerHighlight(idToHighlight, 'green');
  }, [cart, triggerHighlight]);

  const handleIncrement = useCallback((itemId: string) => {
    cart.incrementItem(itemId);
    triggerHighlight(itemId, 'green');
  }, [cart, triggerHighlight]);

  const handleDecrement = useCallback((itemId: string) => {
    cart.decrementItem(itemId);
    triggerHighlight(itemId, 'red');
  }, [cart, triggerHighlight]);

  const handleRemove = useCallback((itemId: string) => {
    triggerHighlight(itemId, 'red');
    setTimeout(() => cart.removeItem(itemId), 300);
  }, [cart, triggerHighlight]);

  const { data: categories, isLoading: categoriesLoading } = usePOSCategories();
  const { data: items, isLoading: itemsLoading } = usePOSItems({
    categoryId: showFavorites ? null : selectedCategoryId,
    favoritesOnly: showFavorites,
  });

  // Handlers
  const handleCategorySelect = (categoryId: string | null) => {
    setShowFavorites(false);
    setSelectedCategoryId(categoryId);
  };

  const handleFavoritesSelect = () => {
    setShowFavorites(true);
    setSelectedCategoryId(null);
  };

  const handleCustomizeItem = (item: POSMenuItem) => {
    setEditingCartItemIdForModal(null);
    setCustomizeModalItem(item);
  };

  const handleViewDetails = (item: POSMenuItem) => {
    setDetailsItem(item);
  };

  // Cart item edit icon → open CustomizeModal with matching POSMenuItem
  const handleEditCartItemCustomization = (cartItemId: string) => {
    const cartItem = cart.items.find((i) => i.id === cartItemId);
    if (!cartItem) return;

    // Find the matching POSMenuItem from the loaded items list
    const menuItem = (items || []).find((i) => i.id === cartItem.menuItemId);
    if (!menuItem) return;

    setEditingCartItemIdForModal(cartItemId);
    setCustomizeModalItem(menuItem);
  };

  const handleCloseCustomizeModal = () => {
    setCustomizeModalItem(null);
    setEditingCartItemIdForModal(null);
  };

  const handlePay = () => setShowCheckout(true);
  const handleCloseCheckout = () => setShowCheckout(false);
  const handleOrderComplete = () => {
    cart.clearCart();
    setEditingOrderId(null);
    setEditingOrderNumber(null);
    setShowCheckout(false);
  };

  const leftPanel = (
    <div className="flex h-full flex-col">
      <CategoryBar
        categories={categories || []}
        selectedCategoryId={selectedCategoryId}
        showFavorites={showFavorites}
        onCategorySelect={handleCategorySelect}
        onFavoritesSelect={handleFavoritesSelect}
        isLoading={categoriesLoading}
      />
      <div className="flex-1 overflow-auto p-4">
        <POSItemGrid
          items={items || []}
          isLoading={itemsLoading}
          onAddItem={handleAddItem}
          onCustomizeItem={handleCustomizeItem}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );

  const rightPanel = (
    <CartPanel
      items={cart.items}
      highlight={highlight}
      subtotal={cart.subtotal}
      vatRate={cart.vatRate}
      vatAmount={cart.vatAmount}
      total={cart.total}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      onRemove={handleRemove}
      onEditCustomization={handleEditCartItemCustomization}
      onClearAll={cart.clearCart}
      onPay={handlePay}
      editingOrderNumber={editingOrderNumber}
    />
  );

  return (
    <>
      <SplitPanelContainer leftPanel={leftPanel} rightPanel={rightPanel} />

      {/* Item Details Modal (read-only) */}
      <ItemDetailsModal
        open={!!detailsItem}
        onOpenChange={(open) => !open && setDetailsItem(null)}
        menuItem={detailsItem}
      />

      {/* Customize Modal (from card button OR cart edit icon) */}
      <CustomizeModal
        open={!!customizeModalItem}
        onOpenChange={(open) => !open && handleCloseCustomizeModal()}
        menuItem={customizeModalItem}
        cart={cart}
        onClose={handleCloseCustomizeModal}
        editingCartItemId={editingCartItemIdForModal}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        open={showCheckout}
        onOpenChange={setShowCheckout}
        cart={cart}
        onOrderComplete={handleOrderComplete}
        onEditCustomization={handleEditCartItemCustomization}
        editingOrderId={editingOrderId}
        editingOrderNumber={editingOrderNumber}
      />
    </>
  );
}
