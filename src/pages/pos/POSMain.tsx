import { useState } from "react";
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

  // Customization drawer state
  const [customizeItem, setCustomizeItem] = useState<POSMenuItem | null>(null);
  const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null);

  // New modal states
  const [detailsItem, setDetailsItem] = useState<POSMenuItem | null>(null);
  const [customizeModalItem, setCustomizeModalItem] = useState<POSMenuItem | null>(null);

  const [showCheckout, setShowCheckout] = useState(false);

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

  const handleAddItem = (item: POSMenuItem) => {
    cart.addItem({
      menuItemId: item.id,
      name: item.name_en,
      basePrice: item.base_price,
      quantity: 1,
    });
  };

  const handleCustomizeItem = (item: POSMenuItem) => {
    setCustomizeModalItem(item);
  };

  const handleViewDetails = (item: POSMenuItem) => {
    setDetailsItem(item);
  };

  // Cart item edit (opens existing drawer)
  const handleEditCartItem = (cartItemId: string, item: POSMenuItem) => {
    setCustomizeItem(item);
    setEditingCartItemId(cartItemId);
  };

  const handleCloseCustomizeDrawer = () => {
    setCustomizeItem(null);
    setEditingCartItemId(null);
  };

  const handleCloseCustomizeModal = () => {
    setCustomizeModalItem(null);
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
      subtotal={cart.subtotal}
      vatRate={cart.vatRate}
      vatAmount={cart.vatAmount}
      total={cart.total}
      onIncrement={cart.incrementItem}
      onDecrement={cart.decrementItem}
      onRemove={cart.removeItem}
      onEditItem={handleEditCartItem}
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

      {/* Customize Modal (from card button) */}
      <CustomizeModal
        open={!!customizeModalItem}
        onOpenChange={(open) => !open && handleCloseCustomizeModal()}
        menuItem={customizeModalItem}
        cart={cart}
        onClose={handleCloseCustomizeModal}
      />

      {/* Customize Drawer (from cart edit) */}
      <CustomizeDrawer
        open={!!customizeItem}
        onOpenChange={(open) => !open && handleCloseCustomizeDrawer()}
        menuItem={customizeItem}
        editingCartItemId={editingCartItemId}
        cart={cart}
        onClose={handleCloseCustomizeDrawer}
      />

      {/* Checkout Drawer */}
      <CheckoutDrawer
        open={showCheckout}
        onOpenChange={(open) => !open && handleCloseCheckout()}
        cart={cart}
        onOrderComplete={handleOrderComplete}
      />
    </>
  );
}
