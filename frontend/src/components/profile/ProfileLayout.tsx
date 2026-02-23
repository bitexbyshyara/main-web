import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  UtensilsCrossed, LayoutDashboard, CreditCard, Settings, BookOpen,
  HeadphonesIcon, ExternalLink, LogOut, Bell, ChevronDown, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/profile/dashboard", icon: LayoutDashboard },
  { label: "Billing & Invoices", path: "/profile/billing", icon: CreditCard },
  { label: "Account Settings", path: "/profile/settings", icon: Settings },
  { label: "How to Use", path: "/profile/how-to-use", icon: BookOpen },
  { label: "Contact & Support", path: "/profile/support", icon: HeadphonesIcon },
];

const ProfileLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "GF";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive(item.path)
                ? "text-primary bg-primary/5 border-l-4 border-primary -ml-px"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
            }`}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Open POS Dashboard link (cross-site) */}
        <a
          href={`${import.meta.env.VITE_POS_URL || "https://bitex-pos.shyara.co.in"}/dashboard`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-all mt-4"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          <span>Open POS Dashboard</span>
        </a>
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          to="/profile/settings"
          onClick={() => isMobile && setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top header bar */}
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <UtensilsCrossed className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-heading font-bold text-foreground">BiteX</span>
          </Link>
          <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Active
          </span>
        </div>

        {/* Center - Restaurant name + plan */}
        <div className="hidden sm:flex flex-col items-center">
          <span className="text-sm font-heading font-semibold text-foreground">The Golden Fork</span>
          <span className="text-[10px] text-muted-foreground">Professional Plan</span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-heading font-semibold text-xs">
              {initials}
            </div>
            <button className="hidden sm:flex items-center gap-1 text-sm font-medium text-foreground">
              <span>{user?.email?.split("@")[0] || "Admin"}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        {!isMobile && (
          <aside className="w-60 border-r border-border bg-background flex-shrink-0">
            <SidebarContent />
          </aside>
        )}

        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-foreground/20 z-40" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed left-0 top-14 bottom-0 w-64 bg-background border-r border-border z-50 overflow-y-auto">
              <SidebarContent />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
