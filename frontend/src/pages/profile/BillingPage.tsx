import { useState } from "react";
import {
  CreditCard, IndianRupee, Calendar, Download, Plus, Trash2, HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const MOCK_INVOICES = [
  { id: "INV-2025-001", date: "Feb 20, 2025", plan: "Professional", amount: 1999, status: "Paid" },
  { id: "INV-2025-002", date: "Jan 20, 2025", plan: "Professional", amount: 1999, status: "Paid" },
  { id: "INV-2025-003", date: "Dec 20, 2024", plan: "Professional", amount: 1999, status: "Paid" },
  { id: "INV-2025-004", date: "Nov 20, 2024", plan: "Professional", amount: 1999, status: "Paid" },
  { id: "INV-2025-005", date: "Oct 20, 2024", plan: "Starter", amount: 999, status: "Paid" },
];

const PAYMENT_METHODS = [
  { id: "pm1", type: "Visa", last4: "4242", expiry: "12/27", isDefault: true },
  { id: "pm2", type: "UPI", last4: "rajesh@upi", expiry: null, isDefault: false },
];

const BillingPage = () => {
  const { toast } = useToast();
  const [methods] = useState(PAYMENT_METHODS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Billing & Invoices</h1>

      {/* Plan card */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">Current Plan</span>
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
              </span>
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground">Professional Plan</h2>
            <p className="text-sm text-muted-foreground mt-1">Next renewal: March 20, 2026</p>
            <p className="text-sm text-muted-foreground">₹1,999/month + GST</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Change Plan</Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Cancel Subscription</Button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Spent (2025)</span>
          </div>
          <p className="text-xl font-heading font-bold text-foreground">₹9,995</p>
          <p className="text-xs text-muted-foreground">5 payments</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Last Payment</span>
          </div>
          <p className="text-xl font-heading font-bold text-foreground">₹1,999</p>
          <p className="text-xs text-muted-foreground">Feb 20, 2025</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Next Payment</span>
          </div>
          <p className="text-xl font-heading font-bold text-foreground">₹1,999</p>
          <p className="text-xs text-muted-foreground">Mar 20, 2026</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-foreground">Payment Methods</h3>
          <Button variant="outline" size="sm">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add New
          </Button>
        </div>
        <div className="divide-y divide-border">
          {methods.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {m.type} {m.expiry ? `ending ${m.last4}` : m.last4}
                    </p>
                    {m.isDefault && (
                      <Badge variant="secondary" className="text-[10px]">Default</Badge>
                    )}
                  </div>
                  {m.expiry && <p className="text-xs text-muted-foreground">Expires {m.expiry}</p>}
                </div>
              </div>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-foreground">Invoice History</h3>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Exporting invoices..." })}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Invoice</th>
                <th className="pb-3 font-medium text-muted-foreground">Date</th>
                <th className="pb-3 font-medium text-muted-foreground hidden sm:table-cell">Plan</th>
                <th className="pb-3 font-medium text-muted-foreground">Amount</th>
                <th className="pb-3 font-medium text-muted-foreground">Status</th>
                <th className="pb-3 font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 font-medium text-foreground">{inv.id}</td>
                  <td className="py-3 text-muted-foreground">{inv.date}</td>
                  <td className="py-3 text-muted-foreground hidden sm:table-cell">{inv.plan}</td>
                  <td className="py-3 text-foreground">₹{inv.amount.toLocaleString("en-IN")}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">{inv.status}</span>
                  </td>
                  <td className="py-3">
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Billing Information</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Business Name</p>
            <p className="font-medium text-foreground">The Golden Fork Pvt. Ltd.</p>
          </div>
          <div>
            <p className="text-muted-foreground">GSTIN</p>
            <p className="font-medium text-foreground">27AADCG1234F1ZH</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-muted-foreground">Billing Address</p>
            <p className="font-medium text-foreground">42, MG Road, Fort, Mumbai, Maharashtra 400001</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4">Update Billing Info</Button>
      </div>

      {/* Footer */}
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Need help with billing?</p>
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
