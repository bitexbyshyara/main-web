import { Link } from "react-router-dom";
import {
  ExternalLink, MapPin, Table2, Users, HeadphonesIcon, Check,
  ArrowRight, MessageCircle, Mail, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { label: "Locations", value: "1", icon: MapPin },
  { label: "Tables", value: "12", icon: Table2 },
  { label: "Staff", value: "3", icon: Users },
  { label: "Support", value: "Professional", icon: HeadphonesIcon },
];

const CHECKLIST = [
  { label: "Upload restaurant logo", done: true },
  { label: "Configure payment gateway", done: true },
  { label: "Add menu items", done: true },
  { label: "Generate QR codes", done: false },
  { label: "Setup staff accounts", done: false },
];

const QUICK_LINKS = [
  { label: "Watch Demo Video", to: "/profile/how-to-use" },
  { label: "View Documentation", to: "/profile/how-to-use" },
  { label: "Contact Support", to: "/profile/support" },
];

const ProfileDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Welcome back, The Golden Fork! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here's an overview of your restaurant account.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={`${import.meta.env.VITE_POS_URL || "https://bitex-pos.shyara.co.in"}/dashboard`} target="_blank" rel="noopener noreferrer">
            Open POS Dashboard <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </Button>
      </div>

      {/* Plan card */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">Current Plan</span>
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
              </span>
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground mt-2">Professional Plan</h2>
            <p className="text-sm text-muted-foreground mt-1">Renews on March 20, 2026 · 27 days remaining</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-heading font-bold text-foreground">
              ₹1,999<span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
            <Button asChild size="sm" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/profile/billing">Manage Billing</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-lg font-heading font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Getting Started + Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Getting Started checklist */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Getting Started</h3>
          <div className="space-y-3">
            {CHECKLIST.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.done ? "bg-success text-primary-foreground" : "border-2 border-border"
                }`}>
                  {item.done && <Check className="h-3 w-3" />}
                </div>
                <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Quick Links</h3>
          <div className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <span className="text-sm text-foreground">{link.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer banner */}
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-semibold text-foreground">Questions? We're here to help!</h3>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +91 98765 43210</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> support@bitex.in</span>
          </div>
        </div>
        <Button asChild className="bg-success text-primary-foreground hover:bg-success/90">
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-1.5" /> Chat with us
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProfileDashboard;
