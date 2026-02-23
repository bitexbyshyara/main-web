import { Link } from "react-router-dom";
import {
  ExternalLink,
  ArrowRight,
  MessageCircle,
  Mail,
  Phone,
  Check,
  AlertCircle,
  HeadphonesIcon,
  Receipt,
  ClipboardCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { TIERS } from "@/lib/constants";

interface DashboardData {
  subscriptionStatus: "ACTIVE" | "CREATED" | "CANCELLED" | "NONE";
  tier: 1 | 2;
  billingCycle: "monthly" | "yearly";
  onboardingComplete: boolean;
  supportTicketCount: number;
  latestInvoice: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
  } | null;
}

const QUICK_LINKS = [
  { label: "Watch Demo Video", to: "/profile/how-to-use" },
  { label: "View Documentation", to: "/profile/how-to-use" },
  { label: "Contact Support", to: "/profile/support" },
];

const STATUS_STYLES: Record<DashboardData["subscriptionStatus"], { dot: string; text: string; label: string }> = {
  ACTIVE: { dot: "bg-success", text: "text-success", label: "Active" },
  CREATED: { dot: "bg-yellow-500", text: "text-yellow-600", label: "Pending" },
  CANCELLED: { dot: "bg-destructive", text: "text-destructive", label: "Cancelled" },
  NONE: { dot: "bg-muted-foreground", text: "text-muted-foreground", label: "No Plan" },
};

function formatCurrency(amount: number, currency: string) {
  const symbol = currency.toUpperCase() === "INR" ? "₹" : currency.toUpperCase();
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-44" />
      </div>

      <Skeleton className="h-36 w-full rounded-xl" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>

      <Skeleton className="h-24 rounded-xl" />
    </div>
  );
}

const ProfileDashboard = () => {
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get<DashboardData>("/api/dashboard");
      return res.data;
    },
  });

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Unable to load dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Something went wrong while fetching your account data.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-1.5" /> Try Again
        </Button>
      </div>
    );
  }

  const tier = TIERS.find((t) => t.id === data.tier);
  const tierName = tier?.name ?? "Unknown";
  const tierPrice = data.billingCycle === "yearly" ? (tier?.annualPrice ?? 0) : (tier?.price ?? 0);
  const cycleLabel = data.billingCycle === "yearly" ? "/mo (annual)" : "/month";
  const status = STATUS_STYLES[data.subscriptionStatus];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.email ?? "Here's an overview of your account."}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a
            href={`${import.meta.env.VITE_POS_URL || "https://bitex-pos.shyara.co.in"}/dashboard`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open POS Dashboard <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </Button>
      </div>

      {/* Plan card */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                Current Plan
              </span>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 ${status.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} /> {status.label}
              </span>
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground mt-2">
              {tierName} Plan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Billed {data.billingCycle === "yearly" ? "annually" : "monthly"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-heading font-bold text-foreground">
              ₹{tierPrice.toLocaleString("en-IN")}
              <span className="text-sm font-normal text-muted-foreground">{cycleLabel}</span>
            </p>
            <Button asChild size="sm" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/profile/billing">Manage Billing</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-lg font-heading font-bold text-foreground">
            {data.onboardingComplete ? "Complete" : "In Progress"}
          </p>
          <p className="text-xs text-muted-foreground">Onboarding</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HeadphonesIcon className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-lg font-heading font-bold text-foreground">
            {data.supportTicketCount}
          </p>
          <p className="text-xs text-muted-foreground">Support Tickets</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Receipt className="h-4 w-4 text-primary" />
            </div>
          </div>
          {data.latestInvoice ? (
            <>
              <p className="text-lg font-heading font-bold text-foreground">
                {formatCurrency(data.latestInvoice.amount, data.latestInvoice.currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                Latest Invoice &middot;{" "}
                <span className="capitalize">{data.latestInvoice.status.toLowerCase()}</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-heading font-bold text-foreground">&mdash;</p>
              <p className="text-xs text-muted-foreground">No Invoices Yet</p>
            </>
          )}
        </div>
      </div>

      {/* Getting Started + Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Onboarding status */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Getting Started</h3>
          {data.onboardingComplete ? (
            <div className="flex flex-col items-center text-center py-4 space-y-2">
              <div className="h-10 w-10 rounded-full bg-success flex items-center justify-center">
                <Check className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Setup complete!
              </p>
              <p className="text-xs text-muted-foreground">
                Your account is fully configured and ready to use.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Onboarding incomplete
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Complete your setup to unlock all features and start taking orders.
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/profile/onboarding">Continue Setup</Link>
              </Button>
            </div>
          )}
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
