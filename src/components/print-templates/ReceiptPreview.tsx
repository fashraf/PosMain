import { cn } from "@/lib/utils";
import { QrCode } from "lucide-react";

export interface PrintTemplateData {
  name: string;
  show_logo: boolean;
  logo_url: string | null;
  logo_position: "left" | "center" | "right";
  logo_width: number;
  logo_height: number;
  show_branch_name: boolean;
  show_branch_mobile: boolean;
  show_order_id: boolean;
  show_order_taken_by: boolean;
  show_cr_number: boolean;
  show_vat_number: boolean;
  cr_number: string;
  vat_number: string;
  telephone: string;
  header_text: string;
  header_alignment: "left" | "center" | "right";
  show_item_name: boolean;
  show_qty: boolean;
  show_price: boolean;
  show_line_total: boolean;
  show_total_amount: boolean;
  show_discount: boolean;
  show_tax_breakdown: boolean;
  show_customization: boolean;
  show_qr: boolean;
  qr_content: string;
  qr_size: "small" | "medium" | "large";
  show_amount_above_qr: boolean;
  show_order_id_near_qr: boolean;
  show_footer: boolean;
  footer_text: string;
  footer_alignment: "left" | "center" | "right";
  restaurant_name_en: string;
  restaurant_name_ar: string;
  restaurant_name_ur: string;
}

interface DemoCustomization {
  type: "add" | "remove";
  name: string;
  cost: number;
}

interface DemoItem {
  name: string;
  qty: number;
  price: number;
  total: number;
  customizations: DemoCustomization[];
}

const DEMO_ITEMS: DemoItem[] = [
  {
    name: "Chicken Shawarma", qty: 2, price: 15.0, total: 32.0,
    customizations: [
      { type: "add", name: "Extra Cheese", cost: 2.00 },
      { type: "remove", name: "No Onion", cost: 0 },
    ],
  },
  {
    name: "Arabic Coffee", qty: 3, price: 5.0, total: 15.0,
    customizations: [],
  },
  {
    name: "Kunafa", qty: 1, price: 12.0, total: 13.50,
    customizations: [
      { type: "add", name: "Extra Cream", cost: 1.50 },
    ],
  },
];

const SUBTOTAL = 60.5;
const DISCOUNT = 5.0;
const VAT_RATE = 0.15;
const VAT_AMT = +(SUBTOTAL - DISCOUNT) * VAT_RATE;
const TOTAL = SUBTOTAL - DISCOUNT + VAT_AMT;

const qrSizeMap = { small: 48, medium: 64, large: 80 };

const alignClass = (a: string) =>
  a === "left" ? "text-left" : a === "right" ? "text-right" : "text-center";

function getRestaurantName(data: PrintTemplateData): string | null {
  return data.restaurant_name_en?.trim() || data.restaurant_name_ar?.trim() || data.restaurant_name_ur?.trim() || null;
}

export function ReceiptPreview({ data }: { data: PrintTemplateData }) {
  const visibleCols = [
    data.show_item_name && "name",
    data.show_qty && "qty",
    data.show_price && "price",
    data.show_line_total && "total",
  ].filter(Boolean) as string[];

  const restaurantName = getRestaurantName(data);

  return (
    <div className="sticky top-4">
      <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-1 bg-muted/20">
        <p className="text-[10px] text-muted-foreground text-center mb-1 font-medium">
          Live Preview
        </p>
        <div className="bg-white rounded-lg shadow-sm mx-auto max-w-[280px] px-4 py-5 font-mono text-[11px] leading-relaxed space-y-2">
          {/* LOGO */}
          {data.show_logo && data.logo_url && (
            <div className={cn("flex", data.logo_position === "left" ? "justify-start" : data.logo_position === "right" ? "justify-end" : "justify-center")}>
              <img
                src={data.logo_url}
                alt="Logo"
                style={{ width: data.logo_width, height: data.logo_height }}
                className="object-contain"
              />
            </div>
          )}

          {/* RESTAURANT NAME */}
          {restaurantName && (
            <p className="text-center font-bold text-[13px]">{restaurantName}</p>
          )}

          {/* BRANCH INFO */}
          <div className="text-center space-y-0.5">
            {data.show_branch_name && <p className="font-bold text-[12px]">{data.restaurant_name_en || "Sample Restaurant"}</p>}
            {data.show_branch_mobile && <p className="text-muted-foreground">+966 50 123 4567</p>}
            {(data.telephone) && <p className="text-muted-foreground">Tel: {data.telephone}</p>}
            {data.show_cr_number && <p className="text-muted-foreground">CR# {data.cr_number || "1010XXXXXX"}</p>}
            {data.show_vat_number && <p className="text-muted-foreground">VAT# {data.vat_number || "3100XXXXXXXX03"}</p>}
          </div>

          {/* HEADER TEXT */}
          {data.header_text && (
            <p className={cn("text-[10px] italic text-muted-foreground", alignClass(data.header_alignment))}>{data.header_text}</p>
          )}

          {/* ORDER INFO */}
          <div className="border-t border-dashed border-muted-foreground/30 pt-1.5 space-y-0.5">
            {data.show_order_id && <p>Order #: <span className="font-semibold">1042</span></p>}
            {data.show_order_taken_by && <p>Taken By: <span className="font-semibold">Ahmad</span></p>}
          </div>

          {/* ITEMS */}
          {visibleCols.length > 0 && (
            <div className="border-t border-dashed border-muted-foreground/30 pt-1.5">
              {/* Header row */}
              <div className="flex text-[9px] font-bold uppercase text-muted-foreground mb-1">
                {data.show_item_name && <span className="flex-1">Item</span>}
                {data.show_qty && <span className="w-8 text-center">Qty</span>}
                {data.show_price && <span className="w-12 text-right">Price</span>}
                {data.show_line_total && <span className="w-14 text-right">Total</span>}
              </div>
              {DEMO_ITEMS.map((item, i) => (
                <div key={i}>
                  <div className="flex text-[10px]">
                    {data.show_item_name && <span className="flex-1 truncate">{item.name}</span>}
                    {data.show_qty && <span className="w-8 text-center">x{item.qty}</span>}
                    {data.show_price && <span className="w-12 text-right">{item.price.toFixed(2)}</span>}
                    {data.show_line_total && <span className="w-14 text-right">{item.total.toFixed(2)}</span>}
                  </div>
                  {/* Customizations */}
                  {data.show_customization && item.customizations.length > 0 && (
                    <div className="pl-3 space-y-0">
                      {item.customizations.map((c, ci) => (
                        <div key={ci} className={cn("flex text-[9px]", c.type === "add" ? "text-green-600" : "text-muted-foreground")}>
                          <span className="flex-1">
                            {c.type === "add" ? "+" : "−"} {c.name}
                          </span>
                          {c.type === "add" && c.cost > 0 && (
                            <span className="text-right">+{c.cost.toFixed(2)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TOTALS */}
          <div className="border-t border-dashed border-muted-foreground/30 pt-1.5 space-y-0.5 text-[10px]">
            <div className="flex justify-between"><span>Subtotal</span><span>{SUBTOTAL.toFixed(2)}</span></div>
            {data.show_discount && <div className="flex justify-between text-red-600"><span>Discount</span><span>-{DISCOUNT.toFixed(2)}</span></div>}
            {data.show_tax_breakdown && <div className="flex justify-between"><span>VAT 15%</span><span>{VAT_AMT.toFixed(2)}</span></div>}
            {data.show_total_amount && (
              <div className="flex justify-between font-bold text-[12px] border-t border-muted-foreground/30 pt-1">
                <span>TOTAL</span><span>{TOTAL.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* QR */}
          {data.show_qr && (
            <div className="flex flex-col items-center gap-1 pt-1">
              {data.show_amount_above_qr && <p className="font-bold text-[12px]">{TOTAL.toFixed(2)} SAR</p>}
              <div
                style={{ width: qrSizeMap[data.qr_size], height: qrSizeMap[data.qr_size] }}
                className="rounded border border-dashed border-muted-foreground/40 flex items-center justify-center bg-muted/30"
              >
                <QrCode className="w-2/3 h-2/3 text-muted-foreground/60" />
              </div>
              {data.show_order_id_near_qr && <p className="text-[9px] text-muted-foreground">Order #1042</p>}
            </div>
          )}

          {/* FOOTER */}
          {data.show_footer && data.footer_text && (
            <div className="border-t border-dashed border-muted-foreground/30 pt-1.5">
              <p className={cn("text-[10px] text-muted-foreground", alignClass(data.footer_alignment))}>{data.footer_text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
