import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PaymentInfo from "./pages/PaymentInfo";
import RefundPolicy from "./pages/RefundPolicy";
import Features from "./pages/Features";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileLayout from "./components/profile/ProfileLayout";
import ProfileDashboard from "./pages/profile/ProfileDashboard";
import BillingPage from "./pages/profile/BillingPage";
import AccountSettingsPage from "./pages/profile/AccountSettingsPage";
import HowToUsePage from "./pages/profile/HowToUsePage";
import ContactSupportPage from "./pages/profile/ContactSupportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Marketing routes */}
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/payment-info" element={<PaymentInfo />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />

            {/* Profile portal routes — requires authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<Navigate to="/profile/dashboard" replace />} />
                <Route path="dashboard" element={<ProfileDashboard />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="settings" element={<AccountSettingsPage />} />
                <Route path="how-to-use" element={<HowToUsePage />} />
                <Route path="support" element={<ContactSupportPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
