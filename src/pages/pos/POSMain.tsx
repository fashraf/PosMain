import { useState, useRef, useCallback } from "react";
import { SplitPanelContainer } from "@/components/pos/layout";
import { CategoryBar } from "@/components/pos/category";
import { POSItemGrid } from "@/components/pos/items";
import { CartPanel } from "@/components/pos/cart";
import { usePOSCart } from "@/hooks/pos";
import { usePOSCategories, usePOSItems } from "@/hooks/pos";
import { CustomizeDrawer } from "@/components/pos/customization";
import { ItemDetailsModal, CustomizeModal } from "@/components/pos/modals";
import { CheckoutDrawer } from "@/components/pos/checkout";
import type { POSMenuItem } from "@/lib/pos/types";

export default function POSMain() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Modal states
  const [detailsItem, setDetailsItem] = useState<POSMenuItem | null>(null);
  const [customizeModalItem, setCustomizeModalItem] = useState<POSMenuItem | null>(null);
  const [editingCartItemIdForModal, setEditingCartItemIdForModal] = useState<string | null>(null);

  const [showCheckout, setShowCheckout] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>();

  const cart = usePOSCart();

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

  const handleAddItem = useCallback((item: POSMenuItem) => {
    cart.addItem({
      menuItemId: item.id,
      name: item.name_en,
      basePrice: item.base_price,
      quantity: 1,
    });
    // Find the cart item that matches this menuItemId (after state updates, use the ID pattern)
    // Since addToCart merges by hash, the matching item will have this menuItemId
    const matchingItem = cart.items.find((i) => i.menuItemId === item.id);
    const idToHighlight = matchingItem?.id ?? item.id;
    clearTimeout(highlightTimer.current);
    setHighlightedItemId(idToHighlight);
    highlightTimer.current = setTimeout(() => setHighlightedItemId(null), 2000);
  }, [cart]);

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
      highlightedItemId={highlightedItemId}
      subtotal={cart.subtotal}
      vatRate={cart.vatRate}
      vatAmount={cart.vatAmount}
      total={cart.total}
      onIncrement={cart.incrementItem}
      onDecrement={cart.decrementItem}
      onRemove={cart.removeItem}
      onEditCustomization={handleEditCartItemCustomization}
      onClearAll={cart.clearCart}
      onPay={handlePay}
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
    </>
  );
}
