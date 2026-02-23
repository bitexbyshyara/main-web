import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageCircle, Phone, Mail, Send, Loader2, AlertCircle, Clock, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTicketPayload {
  subject: string;
  category: string;
  priority?: string;
  description: string;
}

const CATEGORIES = [
  { value: "billing", label: "Billing" },
  { value: "technical", label: "Technical Issue" },
  { value: "account", label: "Account" },
  { value: "feature", label: "Feature Request" },
  { value: "other", label: "Other" },
] as const;

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

const statusStyle: Record<string, { bg: string; icon: typeof Clock }> = {
  open: { bg: "bg-warning/10 text-warning", icon: Clock },
  "in-progress": { bg: "bg-primary/10 text-primary", icon: Loader2 },
  in_progress: { bg: "bg-primary/10 text-primary", icon: Loader2 },
  resolved: { bg: "bg-success/10 text-success", icon: CheckCircle2 },
  closed: { bg: "bg-muted text-muted-foreground", icon: CheckCircle2 },
};

const priorityStyle: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const SUPPORT_CHANNELS = [
  {
    title: "WhatsApp",
    icon: MessageCircle,
    badge: "FASTEST",
    badgeClass: "bg-success/10 text-success border-success/20",
    highlight: "border-success/30 bg-success/5",
    detail: "+91 95846 61610",
    availability: "24/7 Support",
    buttonLabel: "Open WhatsApp",
    buttonClass: "bg-success text-primary-foreground hover:bg-success/90",
    href: "https://wa.me/919584661610",
  },
  {
    title: "Phone",
    icon: Phone,
    badge: null,
    badgeClass: "",
    highlight: "border-border",
    detail: "+91 95846 61610",
    availability: "Mon–Sat, 9AM–9PM IST",
    buttonLabel: "Call Now",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    href: "tel:+919584661610",
  },
  {
    title: "Email",
    icon: Mail,
    badge: null,
    badgeClass: "",
    highlight: "border-border",
    detail: "support@shyara.co.in",
    availability: "Response within 24 hours",
    buttonLabel: "Send Email",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    href: "mailto:support@shyara.co.in",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I reset my POS dashboard password?",
    a: "Go to Account Settings → Security tab → Change Password. Enter your current password and set a new one. If you've forgotten your password, use the 'Forgot Password' link on the login page.",
  },
  {
    q: "Why are my QR codes not scanning?",
    a: "Make sure the QR codes are printed clearly and are large enough (at least 3×3 cm). Check that the table is active in your Table Management section. Try regenerating the QR code if the issue persists.",
  },
  {
    q: "Orders are not appearing on the Kitchen Board",
    a: "Verify that the customer session is active and the order status is 'New'. Check your internet connection and refresh the Kitchen Board page. Ensure WebSocket connection is established (green indicator in the header).",
  },
  {
    q: "How do I export my sales reports?",
    a: "Navigate to Analytics in your POS Dashboard. Select the date range and click 'Export' button. Reports are available in CSV and PDF formats.",
  },
];

const ContactSupportPage = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: tickets = [],
    isLoading: ticketsLoading,
    isError: ticketsError,
  } = useQuery<Ticket[]>({
    queryKey: ["support", "tickets"],
    queryFn: () => api.get("/api/support/tickets").then((r) => r.data),
    enabled: isAuthenticated,
  });

  const createTicket = useMutation<Ticket, Error, CreateTicketPayload>({
    mutationFn: (payload) =>
      api.post("/api/support/tickets", payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      toast({
        title: "Support ticket submitted!",
        description: "We'll get back to you within 24 hours.",
      });
      setSubject("");
      setCategory("");
      setPriority("");
      setDescription("");
    },
    onError: () => {
      toast({
        title: "Failed to submit ticket",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitTicket = () => {
    if (!subject || !category || !description) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createTicket.mutate({
      subject,
      category,
      priority: priority || undefined,
      description,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">
        Contact &amp; Support
      </h1>

      {/* Support channel cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {SUPPORT_CHANNELS.map((ch) => (
          <div
            key={ch.title}
            className={`bg-card border rounded-xl p-5 space-y-3 ${ch.highlight}`}
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <ch.icon className="h-5 w-5 text-foreground" />
              </div>
              {ch.badge && (
                <Badge
                  variant="outline"
                  className={`text-[10px] ${ch.badgeClass}`}
                >
                  {ch.badge}
                </Badge>
              )}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                {ch.title}
              </h3>
              <p className="text-sm font-medium text-foreground mt-1">
                {ch.detail}
              </p>
              <p className="text-xs text-muted-foreground">
                {ch.availability}
              </p>
            </div>
            <Button
              asChild
              size="sm"
              className={`w-full ${ch.buttonClass}`}
            >
              <a href={ch.href} target="_blank" rel="noopener noreferrer">
                {ch.buttonLabel}
              </a>
            </Button>
          </div>
        ))}
      </div>

      {/* Ticket form + FAQ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Support Ticket form */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-heading font-semibold text-foreground">
            Submit a Support Ticket
          </h3>
          <div className="space-y-3">
            <div>
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="mt-1.5 resize-none"
                rows={4}
              />
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSubmitTicket}
              disabled={createTicket.isPending}
            >
              {createTicket.isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-1.5" />
              )}
              {createTicket.isPending ? "Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </div>

        {/* Quick Help FAQ */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">
            Quick Help
          </h3>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-lg px-4"
              >
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-3">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-3">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Existing Tickets */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">
          Your Tickets
        </h3>

        {ticketsLoading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading tickets...</span>
          </div>
        )}

        {ticketsError && (
          <div className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">
              Failed to load tickets. Please try again later.
            </p>
          </div>
        )}

        {!ticketsLoading && !ticketsError && tickets.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No tickets yet. Submit a ticket above if you need help.
          </p>
        )}

        {tickets.length > 0 && (
          <div className="divide-y divide-border">
            {tickets.map((ticket) => {
              const style = statusStyle[ticket.status.toLowerCase()] ?? {
                bg: "bg-muted text-muted-foreground",
                icon: Clock,
              };
              const StatusIcon = style.icon;

              return (
                <div key={ticket.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground truncate">
                          {ticket.subject}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {ticket.status}
                        </span>
                        {ticket.priority && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                              priorityStyle[ticket.priority.toLowerCase()] ??
                              "bg-muted text-muted-foreground"
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {ticket.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="capitalize">{ticket.category}</span>
                        {" · "}
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSupportPage;
