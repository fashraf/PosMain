import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import SalesChannels from "@/pages/SalesChannels";
import SalesChannelsAdd from "@/pages/SalesChannelsAdd";
import SalesChannelsEdit from "@/pages/SalesChannelsEdit";
import Ingredients from "@/pages/Ingredients";
import IngredientsAdd from "@/pages/IngredientsAdd";
import IngredientsEdit from "@/pages/IngredientsEdit";
import Items from "@/pages/Items";
import ItemsAdd from "@/pages/ItemsAdd";
import ItemsEdit from "@/pages/ItemsEdit";
import ItemIngredientMapping from "@/pages/ItemIngredientMapping";
import ItemPricing from "@/pages/ItemPricing";
import Branches from "@/pages/Branches";
import BranchesAdd from "@/pages/BranchesAdd";
import BranchesEdit from "@/pages/BranchesEdit";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            <Route path="/item-ingredients" element={<ItemIngredientMapping />} />
            <Route path="/item-pricing" element={<ItemPricing />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/branches/add" element={<BranchesAdd />} />
            <Route path="/branches/:id/edit" element={<BranchesEdit />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
