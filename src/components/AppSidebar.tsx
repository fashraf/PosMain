import { useState } from "react";
import { 
  LayoutDashboard, 
  Store, 
  Carrot, 
  UtensilsCrossed, 
  DollarSign, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Link2,
  Building2,
  Tag,
  Package,
  ClipboardList,
  ArrowRightLeft,
  Sliders,
  Calendar,
  BarChart3,
  Wrench,
   Users,
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

const mainNavItems = [
  { titleKey: "nav.dashboard", url: "/", icon: LayoutDashboard },
  { titleKey: "nav.salesChannels", url: "/sales-channels", icon: Store },
   { titleKey: "nav.ingredients", url: "/inventory/ingredients", icon: Carrot },
];

const inventorySubItems = [
  { titleKey: "nav.itemMaster", url: "/inventory/items", icon: Package },
  { 
    titleKey: "nav.stockOperations", 
    url: "/inventory/operations",
    icon: ArrowRightLeft,
    subItems: [
      { titleKey: "nav.stockIssue", url: "/inventory/operations/issue" },
      { titleKey: "nav.stockTransfer", url: "/inventory/operations/transfer" },
      { titleKey: "nav.stockAdjustment", url: "/inventory/operations/adjustment" },
    ]
  },
  { titleKey: "nav.batchExpiry", url: "/inventory/batch-expiry", icon: Calendar },
  { titleKey: "nav.reportsAlerts", url: "/inventory/reports", icon: BarChart3 },
];

const maintenanceSubItems = [
  { titleKey: "maintenance.categories", url: "/maintenance/categories" },
  { titleKey: "maintenance.subcategories", url: "/maintenance/subcategories" },
  { titleKey: "maintenance.servingTimes", url: "/maintenance/serving-times" },
  { titleKey: "maintenance.allergens", url: "/maintenance/allergens" },
  { titleKey: "maintenance.itemTypes", url: "/maintenance/item-types" },
  { titleKey: "maintenance.classificationTypes", url: "/maintenance/classification-types" },
  { titleKey: "maintenance.units", url: "/maintenance/units" },
  { titleKey: "maintenance.storageTypes", url: "/maintenance/storage-types" },
  { titleKey: "maintenance.ingredientGroups", url: "/maintenance/ingredient-groups" },
];

const otherNavItems = [
   { titleKey: "nav.users", url: "/users", icon: Users },
  { titleKey: "nav.items", url: "/items", icon: UtensilsCrossed },
  { titleKey: "nav.categories", url: "/categories", icon: Tag },
  { titleKey: "nav.itemIngredients", url: "/item-ingredient-mapping", icon: Link2 },
  { titleKey: "nav.itemPricing", url: "/item-pricing", icon: DollarSign },
  { titleKey: "branches.title", url: "/branches", icon: Building2 },
  { titleKey: "nav.settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { t, isRTL } = useLanguage();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [operationsOpen, setOperationsOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-sidebar-border bg-sidebar",
        isRTL && "border-l border-r-0"
      )}
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
              {/* Main nav items */}
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={t(item.titleKey)}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Inventory Menu - Collapsible */}
              <Collapsible
                open={inventoryOpen && !isCollapsed}
                onOpenChange={setInventoryOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={t("nav.inventory")}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full"
                    >
                      <Package className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{t("nav.inventory")}</span>
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            inventoryOpen && "rotate-180"
                          )} />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {inventorySubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.url}>
                          {subItem.subItems ? (
                            <Collapsible
                              open={operationsOpen}
                              onOpenChange={setOperationsOpen}
                            >
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton
                                  className="flex items-center justify-between w-full"
                                >
                                  <span className="flex items-center gap-2">
                                    <subItem.icon className="h-4 w-4" />
                                    {t(subItem.titleKey)}
                                  </span>
                                  <ChevronDown className={cn(
                                    "h-3 w-3 transition-transform",
                                    operationsOpen && "rotate-180"
                                  )} />
                                </SidebarMenuSubButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="ps-6 space-y-1 mt-1">
                                  {subItem.subItems.map((nestedItem) => (
                                    <SidebarMenuSubButton asChild key={nestedItem.url}>
                                      <NavLink
                                        to={nestedItem.url}
                                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                                      >
                                        {t(nestedItem.titleKey)}
                                      </NavLink>
                                    </SidebarMenuSubButton>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          ) : (
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to={subItem.url}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                              >
                                <subItem.icon className="h-4 w-4" />
                                {t(subItem.titleKey)}
                              </NavLink>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Maintenance Menu - Collapsible */}
              <Collapsible
                open={maintenanceOpen && !isCollapsed}
                onOpenChange={setMaintenanceOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={t("maintenance.title")}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full"
                    >
                      <Wrench className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{t("maintenance.title")}</span>
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            maintenanceOpen && "rotate-180"
                          )} />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {maintenanceSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.url}>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={subItem.url}
                              className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                            >
                              {t(subItem.titleKey)}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Other nav items */}
              {otherNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={t(item.titleKey)}>
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
