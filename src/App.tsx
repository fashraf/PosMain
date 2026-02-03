import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import SalesChannels from "@/pages/SalesChannels";
import Ingredients from "@/pages/Ingredients";
import Items from "@/pages/Items";
import ItemIngredientMapping from "@/pages/ItemIngredientMapping";
import ItemPricing from "@/pages/ItemPricing";
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
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/items" element={<Items />} />
            <Route path="/item-ingredients" element={<ItemIngredientMapping />} />
            <Route path="/item-pricing" element={<ItemPricing />} />
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
