import { useState } from "react";
import { SplitPanelContainer } from "@/components/pos/layout";
import { CategoryBar } from "@/components/pos/category";
import { ItemGrid } from "@/components/pos/items";
import { CartPanel } from "@/components/pos/cart";
import { usePOSCart } from "@/hooks/pos";
import { usePOSCategories, usePOSItems } from "@/hooks/pos";
import { CustomizeDrawer } from "@/components/pos/customization";
import { CheckoutDrawer } from "@/components/pos/checkout";
import type { POSMenuItem } from "@/lib/pos/types";

export default function POSMain() {
  // Category state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Customization drawer state
  const [customizeItem, setCustomizeItem] = useState<POSMenuItem | null>(null);
  const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null);

  // Checkout drawer state
  const [showCheckout, setShowCheckout] = useState(false);

  // Cart hook
  const cart = usePOSCart();

  // Data fetching
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
    if (item.is_customizable) {
      setCustomizeItem(item);
      setEditingCartItemId(null);
    } else {
      cart.addItem({
        menuItemId: item.id,
        name: item.name_en,
        basePrice: item.base_price,
        quantity: 1,
      });
    }
  };

  const handleCustomizeItem = (item: POSMenuItem) => {
    setCustomizeItem(item);
    setEditingCartItemId(null);
  };

  const handleEditCartItem = (cartItemId: string, item: POSMenuItem) => {
    setCustomizeItem(item);
    setEditingCartItemId(cartItemId);
  };

  const handleCloseCustomize = () => {
    setCustomizeItem(null);
    setEditingCartItemId(null);
  };

  const handlePay = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const handleOrderComplete = () => {
    cart.clearCart();
    setShowCheckout(false);
  };

  // Left panel content
  const leftPanel = (
    <div className="flex h-full flex-col">
      {/* Category Bar */}
      <CategoryBar
        categories={categories || []}
        selectedCategoryId={selectedCategoryId}
        showFavorites={showFavorites}
        onCategorySelect={handleCategorySelect}
        onFavoritesSelect={handleFavoritesSelect}
        isLoading={categoriesLoading}
      />

      {/* Item Grid */}
      <div className="flex-1 overflow-auto p-4">
        <ItemGrid
          items={items || []}
          isLoading={itemsLoading}
          onAddItem={handleAddItem}
          onCustomizeItem={handleCustomizeItem}
        />
      </div>
    </div>
  );

  // Right panel content
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

      {/* Customize Drawer */}
      <CustomizeDrawer
        open={!!customizeItem}
        onOpenChange={(open) => !open && handleCloseCustomize()}
        menuItem={customizeItem}
        editingCartItemId={editingCartItemId}
        cart={cart}
        onClose={handleCloseCustomize}
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
