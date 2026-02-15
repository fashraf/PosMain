import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Package,
  TrendingUp,
  Users,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ClipboardList,
  ChefHat,
  ArrowRightLeft,
  Calendar,
  BarChart3,
  Shield,
  Building2,
  Printer,
  Tag,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface SubItem {
  titleKey: string;
  url: string;
  subItems?: { titleKey: string; url: string }[];
}

interface NavModule {
  titleKey: string;
  icon: LucideIcon;
  url?: string;
  subItems?: SubItem[];
}

const sidebarModules: NavModule[] = [
  { titleKey: "nav.dashboard", icon: LayoutDashboard, url: "/" },
  { titleKey: "nav.orders", icon: ShoppingCart, url: "/pos" },
  { titleKey: "nav.orderList", icon: ClipboardList, url: "/pos/orders" },
  { titleKey: "nav.kitchen", icon: ChefHat, url: "/pos/kitchen" },
  {
    titleKey: "nav.menu", icon: UtensilsCrossed,
    subItems: [
      { titleKey: "maintenance.categories", url: "/maintenance/categories" },
      { titleKey: "maintenance.subcategories", url: "/maintenance/subcategories" },
      { titleKey: "nav.items", url: "/items" },
      { titleKey: "nav.itemPricing", url: "/item-pricing" },
      { titleKey: "maintenance.servingTimes", url: "/maintenance/serving-times" },
      { titleKey: "maintenance.allergens", url: "/maintenance/allergens" },
      { titleKey: "maintenance.itemTypes", url: "/maintenance/item-types" },
    ],
  },
  {
    titleKey: "nav.inventory", icon: Package,
    subItems: [
      { titleKey: "nav.ingredients", url: "/inventory/ingredients" },
      {
        titleKey: "nav.stockOperations", url: "/inventory/operations",
        subItems: [
          { titleKey: "nav.stockIssue", url: "/inventory/operations/issue" },
          { titleKey: "nav.stockTransfer", url: "/inventory/operations/transfer" },
          { titleKey: "nav.stockAdjustment", url: "/inventory/operations/adjustment" },
        ],
      },
      { titleKey: "nav.batchExpiry", url: "/inventory/batch-expiry" },
      { titleKey: "maintenance.storageTypes", url: "/maintenance/storage-types" },
      { titleKey: "maintenance.units", url: "/maintenance/units" },
      { titleKey: "nav.reportsAlerts", url: "/inventory/reports" },
    ],
  },
  {
    titleKey: "finance.title", icon: TrendingUp,
    subItems: [
      { titleKey: "finance.overview", url: "/finance" },
      { titleKey: "finance.revenue", url: "/finance/revenue" },
      { titleKey: "finance.vat", url: "/finance/vat" },
      { titleKey: "finance.expenses", url: "/finance/expenses" },
      { titleKey: "nav.salesChannels", url: "/maintenance/sales-channels" },
    ],
  },
  {
    titleKey: "nav.staff", icon: Users,
    subItems: [
      { titleKey: "nav.users", url: "/users" },
      { titleKey: "nav.roleMaster", url: "/roles" },
      { titleKey: "maintenance.employeeTypes", url: "/maintenance/employee-types" },
      { titleKey: "maintenance.shiftManagement", url: "/maintenance/shifts" },
    ],
  },
  {
    titleKey: "nav.settings", icon: Settings,
    subItems: [
      { titleKey: "branches.title", url: "/branches" },
      { titleKey: "maintenance.printTemplates", url: "/maintenance/print-templates" },
      { titleKey: "maintenance.classificationTypes", url: "/maintenance/classification-types" },
      { titleKey: "nav.maintenance", url: "/settings" },
    ],
  },
  { titleKey: "nav.audit", icon: FileText, url: "/audit" },
];

function isModuleActive(mod: NavModule, pathname: string): boolean {
  if (mod.url) return mod.url === "/" ? pathname === "/" : pathname.startsWith(mod.url);
  if (mod.subItems) {
    return mod.subItems.some((s) => {
      if (pathname === s.url || pathname.startsWith(s.url + "/")) return true;
      if (s.subItems) return s.subItems.some((n) => pathname === n.url || pathname.startsWith(n.url + "/"));
      return false;
    });
  }
  return false;
}

export function AppSidebar() {
  const { t, isRTL } = useLanguage();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  const pathname = location.pathname;

  // Track which modules are open
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [openNested, setOpenNested] = useState<Record<string, boolean>>({});

  const toggleModule = (key: string) => setOpenModules((p) => ({ ...p, [key]: !p[key] }));
  const toggleNested = (key: string) => setOpenNested((p) => ({ ...p, [key]: !p[key] }));

  const isOpen = (key: string) => openModules[key] ?? isModuleActive(sidebarModules.find((m) => m.titleKey === key)!, pathname);

  return (
    <Sidebar
      collapsible="icon"
      className={cn("border-sidebar-border bg-sidebar", isRTL && "border-l border-r-0")}
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-lg font-bold text-sidebar-primary-foreground">P</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">POS Admin</span>
              <span className="text-xs text-sidebar-foreground/60">Management System</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarModules.map((mod) => {
                const active = isModuleActive(mod, pathname);

                // Standalone link (no sub-items)
                if (mod.url && !mod.subItems) {
                  return (
                    <SidebarMenuItem key={mod.titleKey}>
                      <SidebarMenuButton asChild tooltip={t(mod.titleKey)}>
                        <NavLink
                          to={mod.url}
                          end={mod.url === "/"}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
                            active && "border-l-[3px] border-sidebar-primary bg-sidebar-accent font-semibold text-sidebar-primary"
                          )}
                          activeClassName="border-l-[3px] border-sidebar-primary bg-sidebar-accent font-semibold text-sidebar-primary"
                        >
                          <mod.icon className="h-5 w-5 shrink-0" />
                          {!isCollapsed && <span>{t(mod.titleKey)}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // Collapsible module
                const moduleOpen = isOpen(mod.titleKey) && !isCollapsed;
                return (
                  <Collapsible
                    key={mod.titleKey}
                    open={moduleOpen}
                    onOpenChange={() => toggleModule(mod.titleKey)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={t(mod.titleKey)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full",
                            active && "border-l-[3px] border-sidebar-primary bg-sidebar-accent font-semibold text-sidebar-primary"
                          )}
                        >
                          <mod.icon className="h-5 w-5 shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left">{t(mod.titleKey)}</span>
                              <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", moduleOpen && "rotate-180")} />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 border-l border-dotted border-sidebar-border pl-2">
                          {mod.subItems!.map((sub) => {
                            // Nested collapsible (Stock Operations)
                            if (sub.subItems) {
                              const nestedKey = sub.titleKey;
                              const nestedOpen = openNested[nestedKey] ?? sub.subItems.some((n) => pathname === n.url);
                              return (
                                <SidebarMenuSubItem key={sub.url}>
                                  <Collapsible open={nestedOpen} onOpenChange={() => toggleNested(nestedKey)}>
                                    <CollapsibleTrigger asChild>
                                      <SidebarMenuSubButton className="flex items-center justify-between w-full hover:bg-sidebar-accent/50 rounded-md transition-colors">
                                        <span>{t(sub.titleKey)}</span>
                                        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", nestedOpen && "rotate-180")} />
                                      </SidebarMenuSubButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                      <div className="ml-3 border-l border-dotted border-sidebar-border pl-2 space-y-0.5 mt-0.5">
                                        {sub.subItems.map((nested) => (
                                          <SidebarMenuSubButton asChild key={nested.url}>
                                            <NavLink
                                              to={nested.url}
                                              className="flex items-center px-2 py-1.5 text-sm rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                                              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                                            >
                                              {t(nested.titleKey)}
                                            </NavLink>
                                          </SidebarMenuSubButton>
                                        ))}
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </SidebarMenuSubItem>
                              );
                            }

                            // Regular sub-item
                            return (
                              <SidebarMenuSubItem key={sub.url}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={sub.url}
                                    end={sub.url === "/finance"}
                                    className="flex items-center px-2 py-1.5 text-sm rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                                  >
                                    {t(sub.titleKey)}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
