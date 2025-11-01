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
import Collections from "./pages/Collections";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Calendar from "./pages/Calendar";
import Clients from "./pages/Clients";
import Posts from "./pages/Posts";
import Pages from "./pages/Pages";
import Subscribers from "./pages/Subscribers";
import Tools from "./pages/Tools";
import Payments from "./pages/Payments";
import MediaLibrary from "./pages/MediaLibrary";
import TemplatePreview from "./pages/TemplatePreview";
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
                  <Collections />
                </DashboardLayout>
              }
            />
            <Route
              path="/customers"
              element={
                <DashboardLayout>
                  <Customers />
                </DashboardLayout>
              }
            />
            <Route
              path="/services"
              element={
                <DashboardLayout>
                  <Services />
                </DashboardLayout>
              }
            />
            <Route
              path="/calendar"
              element={
                <DashboardLayout>
                  <Calendar />
                </DashboardLayout>
              }
            />
            <Route
              path="/clients"
              element={
                <DashboardLayout>
                  <Clients />
                </DashboardLayout>
              }
            />
            <Route
              path="/tools"
              element={
                <DashboardLayout>
                  <Tools />
                </DashboardLayout>
              }
            />
            <Route
              path="/payments"
              element={
                <DashboardLayout>
                  <Payments />
                </DashboardLayout>
              }
            />
            <Route
              path="/posts"
              element={
                <DashboardLayout>
                  <Posts />
                </DashboardLayout>
              }
            />
            <Route
              path="/pages"
              element={
                <DashboardLayout>
                  <Pages />
                </DashboardLayout>
              }
            />
            <Route
              path="/subscribers"
              element={
                <DashboardLayout>
                  <Subscribers />
                </DashboardLayout>
              }
            />
            <Route
              path="/media"
              element={
                <DashboardLayout>
                  <MediaLibrary />
                </DashboardLayout>
              }
            />
            <Route
              path="/template-preview"
              element={
                <DashboardLayout>
                  <TemplatePreview />
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
