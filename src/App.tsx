import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import SalesChannels from "@/pages/SalesChannels";
import SalesChannelsAdd from "@/pages/SalesChannelsAdd";
import SalesChannelsEdit from "@/pages/SalesChannelsEdit";
import Ingredients from "@/pages/Ingredients";
import IngredientsAdd from "@/pages/IngredientsAdd";
import IngredientsEdit from "@/pages/IngredientsEdit";
import Items from "@/pages/Items";
import ItemsAdd from "@/pages/ItemsAdd";
import ItemsEdit from "@/pages/ItemsEdit";
import ItemPricing from "@/pages/ItemPricing";
import Branches from "@/pages/Branches";
import BranchesAdd from "@/pages/BranchesAdd";
import BranchesEdit from "@/pages/BranchesEdit";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
// Inventory Module
import IngredientMaster from "@/pages/inventory/IngredientMaster";
import IngredientMasterAdd from "@/pages/inventory/IngredientMasterAdd";
import IngredientMasterEdit from "@/pages/inventory/IngredientMasterEdit";
import StockIssue from "@/pages/inventory/StockIssue";
import StockTransfer from "@/pages/inventory/StockTransfer";
import StockAdjustment from "@/pages/inventory/StockAdjustment";
import BatchExpiry from "@/pages/inventory/BatchExpiry";
import ReportsAlerts from "@/pages/inventory/ReportsAlerts";
// Maintenance Module
import CategoriesPage from "@/pages/maintenance/Categories";
import SubcategoriesPage from "@/pages/maintenance/Subcategories";
import ServingTimesPage from "@/pages/maintenance/ServingTimes";
import AllergensPage from "@/pages/maintenance/Allergens";
import ItemTypesPage from "@/pages/maintenance/ItemTypes";
import ClassificationTypesPage from "@/pages/maintenance/ClassificationTypes";
import UnitsPage from "@/pages/maintenance/Units";
import StorageTypesPage from "@/pages/maintenance/StorageTypes";
import IngredientGroupsPage from "@/pages/maintenance/IngredientGroups";
import EmployeeTypesPage from "@/pages/maintenance/EmployeeTypes";
import ShiftsPage from "@/pages/maintenance/Shifts";
import ShiftsAdd from "@/pages/maintenance/ShiftsAdd";
import ShiftsEdit from "@/pages/maintenance/ShiftsEdit";
import PrintTemplatesPage from "@/pages/maintenance/PrintTemplates";
import PrintTemplatesAdd from "@/pages/maintenance/PrintTemplatesAdd";
import PrintTemplatesEdit from "@/pages/maintenance/PrintTemplatesEdit";
import Users from "@/pages/Users";
import UsersAdd from "@/pages/UsersAdd";
import UsersEdit from "@/pages/UsersEdit";
import Roles from "@/pages/Roles";
import RolesAdd from "@/pages/RolesAdd";
import RolesEdit from "@/pages/RolesEdit";
// POS Module
import { POSMain, OrderComplete, OrderList, KitchenDisplay } from "@/pages/pos";
import { POSLayout } from "@/components/pos/layout";
// Finance Module
import { FinanceOverview, RevenueReport, VATReport, CancellationsReport, ExpensesProfit } from "@/pages/finance";
import Profile from "@/pages/Profile";
import Audit from "@/pages/Audit";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* POS Module - separate layout */}
            <Route
              path="/pos"
              element={
                <ProtectedRoute>
                  <POSLayout>
                    <POSMain />
                  </POSLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pos/order-complete"
              element={
                <ProtectedRoute>
                  <POSLayout>
                    <OrderComplete />
                  </POSLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pos/orders"
              element={
                <ProtectedRoute>
                  <POSLayout>
                    <OrderList />
                  </POSLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pos/kitchen"
              element={
                <ProtectedRoute>
                  <POSLayout>
                    <KitchenDisplay />
                  </POSLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Protected routes with AdminLayout */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      
                      <Route path="/ingredients" element={<Ingredients />} />
                      <Route path="/ingredients/add" element={<IngredientsAdd />} />
                      <Route path="/ingredients/:id/edit" element={<IngredientsEdit />} />
                      <Route path="/items" element={<Items />} />
                      <Route path="/items/add" element={<ItemsAdd />} />
                      <Route path="/items/:id/edit" element={<ItemsEdit />} />
                      
                      <Route path="/item-pricing" element={<ItemPricing />} />
                      <Route path="/branches" element={<Branches />} />
                      <Route path="/branches/add" element={<BranchesAdd />} />
                      <Route path="/branches/:id/edit" element={<BranchesEdit />} />
                      <Route path="/settings" element={<Settings />} />
                      {/* Inventory Module Routes */}
                      <Route path="/inventory/ingredients" element={<IngredientMaster />} />
                      <Route path="/inventory/ingredients/add" element={<IngredientMasterAdd />} />
                      <Route path="/inventory/ingredients/:id/edit" element={<IngredientMasterEdit />} />
                      <Route path="/inventory/operations/issue" element={<StockIssue />} />
                      <Route path="/inventory/operations/transfer" element={<StockTransfer />} />
                      <Route path="/inventory/operations/adjustment" element={<StockAdjustment />} />
                      <Route path="/inventory/batch-expiry" element={<BatchExpiry />} />
                      <Route path="/inventory/reports" element={<ReportsAlerts />} />
                      {/* Maintenance Module Routes */}
                      <Route path="/maintenance/sales-channels" element={<SalesChannels />} />
                      <Route path="/maintenance/sales-channels/add" element={<SalesChannelsAdd />} />
                      <Route path="/maintenance/sales-channels/:id/edit" element={<SalesChannelsEdit />} />
                      <Route path="/maintenance/categories" element={<CategoriesPage />} />
                      <Route path="/maintenance/subcategories" element={<SubcategoriesPage />} />
                      <Route path="/maintenance/serving-times" element={<ServingTimesPage />} />
                      <Route path="/maintenance/allergens" element={<AllergensPage />} />
                      <Route path="/maintenance/item-types" element={<ItemTypesPage />} />
                      <Route path="/maintenance/classification-types" element={<ClassificationTypesPage />} />
                      <Route path="/maintenance/units" element={<UnitsPage />} />
                      <Route path="/maintenance/storage-types" element={<StorageTypesPage />} />
                      <Route path="/maintenance/ingredient-groups" element={<IngredientGroupsPage />} />
                      <Route path="/maintenance/employee-types" element={<EmployeeTypesPage />} />
                      <Route path="/maintenance/shifts" element={<ShiftsPage />} />
                      <Route path="/maintenance/shifts/add" element={<ShiftsAdd />} />
                      <Route path="/maintenance/shifts/:id/edit" element={<ShiftsEdit />} />
                      <Route path="/maintenance/print-templates" element={<PrintTemplatesPage />} />
                      <Route path="/maintenance/print-templates/add" element={<PrintTemplatesAdd />} />
                      <Route path="/maintenance/print-templates/:id/edit" element={<PrintTemplatesEdit />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/users/add" element={<UsersAdd />} />
                      <Route path="/users/:id/edit" element={<UsersEdit />} />
                      <Route path="/roles" element={<Roles />} />
                      <Route path="/roles/add" element={<RolesAdd />} />
                      <Route path="/roles/:id/edit" element={<RolesEdit />} />
                      {/* Finance Module Routes */}
                      <Route path="/finance" element={<FinanceOverview />} />
                      <Route path="/finance/revenue" element={<RevenueReport />} />
                      <Route path="/finance/vat" element={<VATReport />} />
                      <Route path="/finance/cancellations" element={<CancellationsReport />} />
                      <Route path="/finance/expenses" element={<ExpensesProfit />} />
                      {/* Profile & Audit */}
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/audit" element={<Audit />} />
                      {/* Catch-all for 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
