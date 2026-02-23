import { useQuery } from "@tanstack/react-query";
import {
  CreditCard, IndianRupee, Calendar, Download, Plus, Trash2, HeadphonesIcon,
  Loader2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import api from "@/lib/axios";
import { TIERS } from "@/lib/constants";

interface Subscription {
  id: string;
  razorpaySubscriptionId: string;
  razorpayPlanId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  tier: number;
  billingCycle: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  pdfUrl: string;
  createdAt: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  label: string;
  isDefault: boolean;
}

const formatRupees = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN")}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const statusColor: Record<string, string> = {
  paid: "bg-success/10 text-success",
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

const getStatusStyle = (status: string) =>
  statusColor[status.toLowerCase()] ?? "bg-muted text-muted-foreground";

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 flex items-center gap-3">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-52 bg-muted animate-pulse rounded" />
      <div className="h-36 bg-muted animate-pulse rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
      <div className="h-48 bg-muted animate-pulse rounded-xl" />
      <div className="h-64 bg-muted animate-pulse rounded-xl" />
    </div>
  );
}

const BillingPage = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const {
    data: subscription,
    isLoading: subLoading,
    isError: subError,
  } = useQuery<Subscription>({
    queryKey: ["billing", "subscription"],
    queryFn: () => api.get("/api/billing/subscription").then((r) => r.data),
    enabled: isAuthenticated,
  });

  const {
    data: invoices = [],
    isLoading: invLoading,
    isError: invError,
  } = useQuery<Invoice[]>({
    queryKey: ["billing", "invoices"],
    queryFn: () => api.get("/api/billing/invoices").then((r) => r.data),
    enabled: isAuthenticated,
  });

  const {
    data: paymentMethods = [],
    isLoading: pmLoading,
    isError: pmError,
  } = useQuery<PaymentMethod[]>({
    queryKey: ["billing", "payment-methods"],
    queryFn: () => api.get("/api/billing/payment-methods").then((r) => r.data),
    enabled: isAuthenticated,
  });

  const isLoading = subLoading || invLoading || pmLoading;

  if (isLoading) return <LoadingSkeleton />;

  const tierInfo = TIERS.find((t) => t.id === subscription?.tier);
  const tierName = tierInfo?.name ?? "Unknown";
  const isActive = subscription?.status?.toLowerCase() === "active";

  const totalSpent = invoices
    .filter((inv) => inv.status.toLowerCase() === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const lastPaidInvoice = invoices.find(
    (inv) => inv.status.toLowerCase() === "paid",
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">
        Billing &amp; Invoices
      </h1>

      {subError && (
        <ErrorCard message="Failed to load subscription details. Please try again later." />
      )}

      {/* Plan card */}
      {subscription && (
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  Current Plan
                </span>
                <span
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${getStatusStyle(subscription.status)}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-success" : "bg-muted-foreground"}`}
                  />
                  {subscription.status}
                </span>
              </div>
              <h2 className="text-xl font-heading font-bold text-foreground">
                {tierName} Plan
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Next renewal: {formatDate(subscription.currentPeriodEnd)}
              </p>
              <p className="text-sm text-muted-foreground">
                {tierInfo
                  ? `${formatRupees(
                      (subscription.billingCycle === "annual"
                        ? tierInfo.annualPrice
                        : tierInfo.price) * 100,
                    )}/${subscription.billingCycle === "annual" ? "year" : "month"}`
                  : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Change Plan
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Spent</span>
          </div>
          <p className="text-xl font-heading font-bold text-foreground">
            {formatRupees(totalSpent)}
          </p>
          <p className="text-xs text-muted-foreground">
            {invoices.filter((i) => i.status.toLowerCase() === "paid").length}{" "}
            payments
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Last Payment</span>
          </div>
          {lastPaidInvoice ? (
            <>
              <p className="text-xl font-heading font-bold text-foreground">
                {formatRupees(lastPaidInvoice.amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(lastPaidInvoice.createdAt)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No payments yet</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Next Payment</span>
          </div>
          {subscription ? (
            <>
              <p className="text-xl font-heading font-bold text-foreground">
                {tierInfo
                  ? formatRupees(
                      (subscription.billingCycle === "annual"
                        ? tierInfo.annualPrice
                        : tierInfo.price) * 100,
                    )
                  : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(subscription.currentPeriodEnd)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-foreground">
            Payment Methods
          </h3>
          <Button variant="outline" size="sm">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add New
          </Button>
        </div>

        {pmError && (
          <ErrorCard message="Failed to load payment methods." />
        )}

        {!pmError && paymentMethods.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No payment methods on file.
          </p>
        )}

        {paymentMethods.length > 0 && (
          <div className="divide-y divide-border">
            {paymentMethods.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {m.label || `${m.type} ending ${m.last4}`}
                      </p>
                      {m.isDefault && (
                        <Badge variant="secondary" className="text-[10px]">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                      {m.type}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-foreground">
            Invoice History
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Exporting invoices..." })}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export All
          </Button>
        </div>

        {invError && (
          <ErrorCard message="Failed to load invoices." />
        )}

        {!invError && invoices.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No invoices yet.
          </p>
        )}

        {invoices.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">
                    Invoice
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-3 font-medium text-foreground">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatDate(inv.createdAt)}
                    </td>
                    <td className="py-3 text-foreground">
                      {formatRupees(inv.amount)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusStyle(inv.status)}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors inline-flex"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Need help with billing?
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/profile/support">
            <HeadphonesIcon className="h-3.5 w-3.5 mr-1.5" /> Contact Support
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BillingPage;
