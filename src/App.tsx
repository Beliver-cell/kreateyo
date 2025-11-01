import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { OnboardingModal } from "@/components/OnboardingModal";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import BuildSite from "./pages/BuildSite";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BusinessProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/products"
              element={
                <DashboardLayout>
                  <Products />
                </DashboardLayout>
              }
            />
            <Route
              path="/orders"
              element={
                <DashboardLayout>
                  <Orders />
                </DashboardLayout>
              }
            />
            <Route
              path="/build"
              element={
                <DashboardLayout>
                  <BuildSite />
                </DashboardLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              }
            />
            <Route
              path="/collections"
              element={
                <DashboardLayout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Collections</h2>
                    <p className="text-muted-foreground mt-2">Coming soon</p>
                  </div>
                </DashboardLayout>
              }
            />
            <Route
              path="/customers"
              element={
                <DashboardLayout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Customers</h2>
                    <p className="text-muted-foreground mt-2">Coming soon</p>
                  </div>
                </DashboardLayout>
              }
            />
            <Route
              path="/tools"
              element={
                <DashboardLayout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Tools</h2>
                    <p className="text-muted-foreground mt-2">Coming soon</p>
                  </div>
                </DashboardLayout>
              }
            />
            <Route
              path="/payments"
              element={
                <DashboardLayout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Payment Gateway</h2>
                    <p className="text-muted-foreground mt-2">Coming soon</p>
                  </div>
                </DashboardLayout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <OnboardingModal />
        </BrowserRouter>
      </BusinessProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
