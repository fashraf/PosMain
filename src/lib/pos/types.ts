// POS Module TypeScript Interfaces

export interface POSMenuItem {
  id: string;
  name_en: string;
  name_ar?: string | null;
  name_ur?: string | null;
  description_en?: string | null;
  category_id?: string | null;
  base_price: number;
  image_url?: string | null;
  is_customizable: boolean;
  is_favorite: boolean;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined relations
  ingredients?: POSItemIngredient[];
  replacements?: POSItemReplacement[];
}

export interface POSItemIngredient {
  id: string;
  menu_item_id: string;
  ingredient_name_en: string;
  ingredient_name_ar?: string | null;
  ingredient_name_ur?: string | null;
  extra_price: number;
  is_removable: boolean;
  can_add_extra: boolean;
  is_default_included: boolean;
  sort_order: number;
  created_at: string;
}

export interface POSItemReplacement {
  id: string;
  menu_item_id: string;
  replacement_group: string;
  replacement_name_en: string;
  replacement_name_ar?: string | null;
  replacement_name_ur?: string | null;
  price_difference: number;
  is_default: boolean;
  sort_order: number;
  created_at: string;
}

export interface POSOrder {
  id: string;
  order_number: number;
  order_type: OrderType;
  customer_mobile?: string | null;
  customer_name?: string | null;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method?: string | null;
  taken_by?: string | null;
  branch_id?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface POSOrderItem {
  id: string;
  order_id: string;
  menu_item_id?: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  customization_json?: CustomizationData | null;
  customization_hash?: string | null;
  line_total: number;
  created_at: string;
}

export interface ReplacementSelection {
  id: string;
  group: string;
  name: string;
  priceDiff: number;
}

// Cart types (client-side)
export interface CartItem {
  id: string; // Unique cart item ID
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  customization: CustomizationData;
  customizationHash: string;
  lineTotal: number;
}

export interface CustomizationData {
  extras: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  removals: Array<{
    id: string;
    name: string;
  }>;
  replacements: ReplacementSelection[];
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

// Enum types
export type OrderType = 'dine_in' | 'takeaway' | 'self_pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'card' | 'both' | 'pay_later';
export type PaymentStatus = 'pending' | 'paid' | 'cancelled';

// Category type (from maintenance)
export interface POSCategory {
  id: string;
  name_en: string;
  name_ar?: string | null;
  name_ur?: string | null;
  icon_class?: string | null;
  sort_order?: number | null;
  is_active: boolean;
}

// Customization state for the drawer
export interface CustomizationState {
  menuItem: POSMenuItem | null;
  extras: Set<string>;
  removals: Set<string>;
  replacement: string | null;
}

// Checkout form data
export interface CheckoutFormData {
  orderType: OrderType;
  customerMobile: string;
  customerName: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  tenderedAmount: number;
  cashAmount: number;
  takenBy: string;
  notes: string;
}
