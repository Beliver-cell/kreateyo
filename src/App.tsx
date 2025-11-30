import { Toaster } from "@/components/ui/toaster";
import POS from "@/pages/POS";
import Payroll from "@/pages/Payroll";
import Branches from "@/pages/Branches";
import Subscriptions from "@/pages/Subscriptions";
import Memberships from "@/pages/Memberships";
import Invoices from "@/pages/Invoices";
import Messaging from "@/pages/Messaging";
import AIAutomation from "@/pages/AIAutomation";
import ServiceBuilder from "@/pages/ServiceBuilder";
import BookingCalendar from "@/pages/BookingCalendar";
import Upsells from "@/pages/Upsells";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingModalWrapper } from "@/components/OnboardingModalWrapper";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
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
import ClientChat from "./pages/ClientChat";
import Posts from "./pages/Posts";
import MarketingAI from "./pages/MarketingAI";
import ThemeCustomizer from "./pages/ThemeCustomizer";
import ChatSupport from "./pages/ChatSupport";
import Checkout from "./pages/Checkout";
import Logistics from "./pages/Logistics";
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
import DigitalProducts from "./pages/DigitalProducts";
import MarketingCampaigns from "./pages/MarketingCampaigns";
import DesignProjects from "./pages/DesignProjects";
import ContentCalendar from "./pages/ContentCalendar";
import Billing from "./pages/Billing";
import MultiBusiness from "./pages/MultiBusiness";
import LeadEngine from "./pages/LeadEngine";
import LeadHistory from "./pages/LeadHistory";
import SocialHub from "./pages/SocialHub";
import ContentStudio from "./pages/ContentStudio";
import AIConversationsUnified from "./pages/AIConversationsUnified";
import Broadcasts from "./pages/Broadcasts";
import Reviews from "./pages/Reviews";
import ConversationsInbox from "./pages/ConversationsInbox";
import EmailSettings from "./pages/EmailSettings";
import { CustomerAuthProvider } from "@/contexts/CustomerAuthContext";
import CustomerLogin from "./pages/customer/auth/CustomerLogin";
import CustomerSignup from "./pages/customer/auth/CustomerSignup";
import CustomerForgotPassword from "./pages/customer/auth/CustomerForgotPassword";
import CustomerResetPassword from "./pages/customer/auth/CustomerResetPassword";
import ServicesDashboard from "./pages/customer/services/ServicesDashboard";
import EcommerceOrders from "./pages/customer/ecommerce/EcommerceOrders";
import BloggingReading from './pages/customer/blogging/BloggingReading';
import CustomerServicePortal from './components/customer/CustomerServicePortal';
import CustomerReferral from './pages/customer/CustomerReferral';
import CustomerDisputes from './pages/customer/CustomerDisputes';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerPortalLayout from './components/customer/CustomerPortalLayout';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BusinessProvider>
            <CustomerAuthProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/old-home" element={<Index />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DashboardEnhanced />
                      </DashboardLayout>
                    </AuthGuard>
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
              path="/marketing-ai"
              element={
                <DashboardLayout>
                  <MarketingAI />
                </DashboardLayout>
              }
            />
            <Route
              path="/theme"
              element={
                <DashboardLayout>
                  <ThemeCustomizer />
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
                  <ProtectedRoute requiredPlan="pro" route="/team">
                    <Team />
                  </ProtectedRoute>
                </DashboardLayout>
              }
            />
            <Route
              path="/developer"
              element={
                <DashboardLayout>
                  <ProtectedRoute requiredPlan="pro" route="/developer">
                    <Developer />
                  </ProtectedRoute>
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
            <Route path="/client-chat" element={<AuthGuard><DashboardLayout><ClientChat /></DashboardLayout></AuthGuard>} />
            <Route path="/email-campaigns" element={<AuthGuard><DashboardLayout><EmailCampaigns /></DashboardLayout></AuthGuard>} />
            <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
            <Route path="/inventory" element={<DashboardLayout><InventoryManager /></DashboardLayout>} />
            <Route path="/discounts" element={<DashboardLayout><Discounts /></DashboardLayout>} />
            <Route path="/appointments" element={<DashboardLayout><AppointmentManager /></DashboardLayout>} />
            <Route path="/affiliates" element={<DashboardLayout><AffiliateProgram /></DashboardLayout>} />
            <Route path="/affiliate-program" element={<DashboardLayout><AffiliateProgram /></DashboardLayout>} />
            <Route path="/ads-sponsors" element={<DashboardLayout><AdsSponsors /></DashboardLayout>} />
            <Route path="/suppliers" element={<DashboardLayout><SupplierManager /></DashboardLayout>} />
            <Route path="/digital-products" element={<DashboardLayout><DigitalProducts /></DashboardLayout>} />
            <Route path="/marketing-campaigns" element={<DashboardLayout><MarketingCampaigns /></DashboardLayout>} />
            <Route path="/design-projects" element={<DashboardLayout><DesignProjects /></DashboardLayout>} />
            <Route path="/content-calendar" element={<DashboardLayout><ContentCalendar /></DashboardLayout>} />
            <Route path="/billing" element={<DashboardLayout><Billing /></DashboardLayout>} />
            <Route path="/calendar" element={<DashboardLayout><Calendar /></DashboardLayout>} />
            <Route path="/marketing-ai" element={<DashboardLayout><ProtectedRoute requiredPlan="pro" route="/marketing-ai"><MarketingAI /></ProtectedRoute></DashboardLayout>} />
            <Route path="/theme" element={<DashboardLayout><ThemeCustomizer /></DashboardLayout>} />
            <Route path="/chat-support" element={<DashboardLayout><ChatSupport /></DashboardLayout>} />
            <Route path="/checkout" element={<DashboardLayout><Checkout /></DashboardLayout>} />
            <Route path="/logistics" element={<DashboardLayout><Logistics /></DashboardLayout>} />
            <Route path="/pos" element={<DashboardLayout><ProtectedRoute requiredPlan="enterprise" route="/pos"><POS /></ProtectedRoute></DashboardLayout>} />
            <Route path="/payroll" element={<DashboardLayout><Payroll /></DashboardLayout>} />
            <Route path="/branches" element={<DashboardLayout><Branches /></DashboardLayout>} />
            <Route path="/subscriptions" element={<DashboardLayout><Subscriptions /></DashboardLayout>} />
            <Route path="/memberships" element={<DashboardLayout><Memberships /></DashboardLayout>} />
            <Route path="/invoices" element={<DashboardLayout><Invoices /></DashboardLayout>} />
            <Route path="/messaging" element={<DashboardLayout><ProtectedRoute requiredPlan="pro" route="/messaging"><Messaging /></ProtectedRoute></DashboardLayout>} />
            <Route path="/ai-automation" element={<DashboardLayout><AIAutomation /></DashboardLayout>} />
            <Route path="/media-library" element={<DashboardLayout><MediaLibrary /></DashboardLayout>} />
            <Route path="/service-builder" element={<DashboardLayout><ServiceBuilder /></DashboardLayout>} />
            <Route path="/booking-calendar" element={<DashboardLayout><BookingCalendar /></DashboardLayout>} />
            <Route path="/upsells" element={<DashboardLayout><Upsells /></DashboardLayout>} />
            <Route path="/supplier-manager" element={<DashboardLayout><SupplierManager /></DashboardLayout>} />
            <Route path="/email-campaigns" element={<DashboardLayout><ProtectedRoute requiredPlan="pro" route="/email-campaigns"><EmailCampaigns /></ProtectedRoute></DashboardLayout>} />
            <Route path="/multi-business" element={<DashboardLayout><ProtectedRoute requiredPlan="enterprise" route="/multi-business"><MultiBusiness /></ProtectedRoute></DashboardLayout>} />
            
            {/* Marketing & Automation Routes */}
            <Route path="/lead-engine" element={<DashboardLayout><ProtectedRoute requiredPlan="pro" route="/lead-engine"><LeadEngine /></ProtectedRoute></DashboardLayout>} />
            <Route path="/lead-history" element={<DashboardLayout><ProtectedRoute requiredPlan="pro" route="/lead-history"><LeadHistory /></ProtectedRoute></DashboardLayout>} />
            <Route path="/social-hub" element={<DashboardLayout><ProtectedRoute requiredPlan="pro" route="/social-hub"><SocialHub /></ProtectedRoute></DashboardLayout>} />
            <Route path="/content-studio" element={<DashboardLayout><ProtectedRoute requiredPlan="pro" route="/content-studio"><ContentStudio /></ProtectedRoute></DashboardLayout>} />
            <Route path="/ai-conversations" element={<DashboardLayout><ProtectedRoute requiredPlan="pro" route="/ai-conversations"><AIConversationsUnified /></ProtectedRoute></DashboardLayout>} />
            
            {/* Messaging & Communication Routes */}
            <Route path="/broadcasts" element={<DashboardLayout><Broadcasts /></DashboardLayout>} />
            <Route path="/reviews" element={<DashboardLayout><Reviews /></DashboardLayout>} />
            <Route path="/inbox" element={<DashboardLayout><ConversationsInbox /></DashboardLayout>} />
            <Route path="/email-settings" element={<DashboardLayout><EmailSettings /></DashboardLayout>} />
            
            {/* Customer Portal Routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/signup" element={<CustomerSignup />} />
            <Route path="/customer/forgot-password" element={<CustomerForgotPassword />} />
            <Route path="/customer/reset-password" element={<CustomerResetPassword />} />
            <Route path="/customer/services/dashboard" element={<ServicesDashboard />} />
            <Route path="/customer/ecommerce/orders" element={<EcommerceOrders />} />
            <Route path="/customer/blog/:slug" element={<BloggingReading />} />
            <Route path="/customer/services/:businessId" element={<CustomerServicePortal />} />
            <Route path="/customer/referral" element={<CustomerPortalLayout><CustomerReferral /></CustomerPortalLayout>} />
            <Route path="/customer/disputes" element={<CustomerPortalLayout><CustomerDisputes /></CustomerPortalLayout>} />
            <Route path="/customer/profile" element={<CustomerPortalLayout><CustomerProfile /></CustomerPortalLayout>} />
            <Route path="/customer/dashboard" element={<CustomerPortalLayout><ServicesDashboard /></CustomerPortalLayout>} />
            <Route path="/customer/orders" element={<CustomerPortalLayout><EcommerceOrders /></CustomerPortalLayout>} />
            <Route path="/customer/appointments" element={<CustomerPortalLayout><ServicesDashboard /></CustomerPortalLayout>} />
            
              <Route path="*" element={<NotFound />} />
            </Routes>
            <OnboardingModalWrapper />
          </CustomerAuthProvider>
        </BusinessProvider>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
);

export default App;
