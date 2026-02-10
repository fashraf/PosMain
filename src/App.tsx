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
import Categories from "@/pages/Categories";
import CategoriesAdd from "@/pages/CategoriesAdd";
import CategoriesEdit from "@/pages/CategoriesEdit";
import ItemIngredientMapping from "@/pages/ItemIngredientMapping";
import ItemIngredientMappingEdit from "@/pages/ItemIngredientMappingEdit";
import ItemPricing from "@/pages/ItemPricing";
import Branches from "@/pages/Branches";
import BranchesAdd from "@/pages/BranchesAdd";
import BranchesEdit from "@/pages/BranchesEdit";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
// Inventory Module
import ItemMaster from "@/pages/inventory/ItemMaster";
import ItemMasterAdd from "@/pages/inventory/ItemMasterAdd";
import ItemMasterEdit from "@/pages/inventory/ItemMasterEdit";
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
import Users from "@/pages/Users";
import UsersAdd from "@/pages/UsersAdd";
import UsersEdit from "@/pages/UsersEdit";
import Roles from "@/pages/Roles";
import RolesAdd from "@/pages/RolesAdd";
import RolesEdit from "@/pages/RolesEdit";
// POS Module
import { POSMain, OrderComplete, OrderList, KitchenDisplay } from "@/pages/pos";
import { POSLayout } from "@/components/pos/layout";
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
                      <Route path="/sales-channels" element={<SalesChannels />} />
                      <Route path="/sales-channels/add" element={<SalesChannelsAdd />} />
                      <Route path="/sales-channels/:id/edit" element={<SalesChannelsEdit />} />
                      <Route path="/ingredients" element={<Ingredients />} />
                      <Route path="/ingredients/add" element={<IngredientsAdd />} />
                      <Route path="/ingredients/:id/edit" element={<IngredientsEdit />} />
                      <Route path="/items" element={<Items />} />
                      <Route path="/items/add" element={<ItemsAdd />} />
                      <Route path="/items/:id/edit" element={<ItemsEdit />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/categories/add" element={<CategoriesAdd />} />
                      <Route path="/categories/:id/edit" element={<CategoriesEdit />} />
                      <Route path="/item-ingredient-mapping" element={<ItemIngredientMapping />} />
                      <Route path="/item-ingredient-mapping/:id/edit" element={<ItemIngredientMappingEdit />} />
                      <Route path="/item-pricing" element={<ItemPricing />} />
                      <Route path="/branches" element={<Branches />} />
                      <Route path="/branches/add" element={<BranchesAdd />} />
                      <Route path="/branches/:id/edit" element={<BranchesEdit />} />
                      <Route path="/settings" element={<Settings />} />
                      {/* Inventory Module Routes */}
                      <Route path="/inventory/items" element={<ItemMaster />} />
                      <Route path="/inventory/items/add" element={<ItemMasterAdd />} />
                      <Route path="/inventory/items/:id/edit" element={<ItemMasterEdit />} />
                      <Route path="/inventory/ingredients" element={<IngredientMaster />} />
                      <Route path="/inventory/ingredients/add" element={<IngredientMasterAdd />} />
                      <Route path="/inventory/ingredients/:id/edit" element={<IngredientMasterEdit />} />
                      <Route path="/inventory/operations/issue" element={<StockIssue />} />
                      <Route path="/inventory/operations/transfer" element={<StockTransfer />} />
                      <Route path="/inventory/operations/adjustment" element={<StockAdjustment />} />
                      <Route path="/inventory/batch-expiry" element={<BatchExpiry />} />
                      <Route path="/inventory/reports" element={<ReportsAlerts />} />
                      {/* Maintenance Module Routes */}
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
                      <Route path="/users" element={<Users />} />
                      <Route path="/users/add" element={<UsersAdd />} />
                      <Route path="/users/:id/edit" element={<UsersEdit />} />
                      <Route path="/roles" element={<Roles />} />
                      <Route path="/roles/add" element={<RolesAdd />} />
                      <Route path="/roles/:id/edit" element={<RolesEdit />} />
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
