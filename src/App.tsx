import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { OnboardingModalWrapper } from "@/components/OnboardingModalWrapper";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import DashboardEnhanced from "./pages/DashboardEnhanced";
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
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdsSponsors from "./pages/AdsSponsors";
import SupplierManager from "./pages/SupplierManager";
import { CustomerAuthProvider } from "@/contexts/CustomerAuthContext";
import CustomerLogin from "./pages/customer/auth/CustomerLogin";
import CustomerSignup from "./pages/customer/auth/CustomerSignup";
import ServicesDashboard from "./pages/customer/services/ServicesDashboard";
import EcommerceOrders from "./pages/customer/ecommerce/EcommerceOrders";
import BloggingReading from "./pages/customer/blogging/BloggingReading";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BusinessProvider>
        <BrowserRouter>
          <CustomerAuthProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <DashboardEnhanced />
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
            <Route path="/ads-sponsors" element={<DashboardLayout><AdsSponsors /></DashboardLayout>} />
            <Route path="/suppliers" element={<DashboardLayout><SupplierManager /></DashboardLayout>} />
            
            {/* Customer Portal Routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/signup" element={<CustomerSignup />} />
            <Route path="/customer/services/dashboard" element={<ServicesDashboard />} />
            <Route path="/customer/ecommerce/orders" element={<EcommerceOrders />} />
            <Route path="/customer/blogging/reading" element={<BloggingReading />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <OnboardingModalWrapper />
          </CustomerAuthProvider>
        </BrowserRouter>
      </BusinessProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
