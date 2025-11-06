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
import Team from "./pages/Team";
import Developer from "./pages/Developer";
import Accessibility from "./pages/Accessibility";
import Support from "./pages/Support";
import Internationalization from "./pages/Internationalization";
import ChatbotManager from "./pages/ChatbotManager";
import EmailCampaigns from "./pages/EmailCampaigns";
import Analytics from "./pages/Analytics";
import InventoryManager from "./pages/InventoryManager";
import Discounts from "./pages/Discounts";
import AppointmentManager from "./pages/AppointmentManager";
import AffiliateProgram from "./pages/AffiliateProgram";

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
            <Route
              path="/team"
              element={
                <DashboardLayout>
                  <Team />
                </DashboardLayout>
              }
            />
            <Route
              path="/developer"
              element={
                <DashboardLayout>
                  <Developer />
                </DashboardLayout>
              }
            />
            <Route
              path="/accessibility"
              element={
                <DashboardLayout>
                  <Accessibility />
                </DashboardLayout>
              }
            />
            <Route
              path="/support"
              element={
                <DashboardLayout>
                  <Support />
                </DashboardLayout>
              }
            />
            <Route
              path="/chatbot-manager"
              element={
                <DashboardLayout>
                  <ChatbotManager />
                </DashboardLayout>
              }
            />
            <Route
              path="/internationalization"
              element={
                <DashboardLayout>
                  <Internationalization />
                </DashboardLayout>
              }
            />
            <Route path="/email-campaigns" element={<DashboardLayout><EmailCampaigns /></DashboardLayout>} />
            <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
            <Route path="/inventory" element={<DashboardLayout><InventoryManager /></DashboardLayout>} />
            <Route path="/discounts" element={<DashboardLayout><Discounts /></DashboardLayout>} />
            <Route path="/appointments" element={<DashboardLayout><AppointmentManager /></DashboardLayout>} />
            <Route path="/affiliates" element={<DashboardLayout><AffiliateProgram /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <OnboardingModal />
        </BrowserRouter>
      </BusinessProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
