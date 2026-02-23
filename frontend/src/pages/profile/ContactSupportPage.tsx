import { useState } from "react";
import { MessageCircle, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const SUPPORT_CHANNELS = [
  {
    title: "WhatsApp",
    icon: MessageCircle,
    badge: "FASTEST",
    badgeClass: "bg-success/10 text-success border-success/20",
    highlight: "border-success/30 bg-success/5",
    detail: "+91 98765 43210",
    availability: "24/7 Support",
    buttonLabel: "Open WhatsApp",
    buttonClass: "bg-success text-primary-foreground hover:bg-success/90",
    href: "https://wa.me/919876543210",
  },
  {
    title: "Phone",
    icon: Phone,
    badge: null,
    badgeClass: "",
    highlight: "border-border",
    detail: "+91 98765 43210",
    availability: "Mon–Sat, 9AM–9PM IST",
    buttonLabel: "Call Now",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    href: "tel:+919876543210",
  },
  {
    title: "Email",
    icon: Mail,
    badge: null,
    badgeClass: "",
    highlight: "border-border",
    detail: "support@bitex.in",
    availability: "Response within 24 hours",
    buttonLabel: "Send Email",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    href: "mailto:support@bitex.in",
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
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmitTicket = () => {
    if (!subject || !category || !description) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Support ticket submitted!", description: "We'll get back to you within 24 hours." });
    setSubject(""); setCategory(""); setPriority(""); setDescription("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Contact & Support</h1>

      {/* Support channel cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {SUPPORT_CHANNELS.map((ch) => (
          <div key={ch.title} className={`bg-card border rounded-xl p-5 space-y-3 ${ch.highlight}`}>
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <ch.icon className="h-5 w-5 text-foreground" />
              </div>
              {ch.badge && (
                <Badge variant="outline" className={`text-[10px] ${ch.badgeClass}`}>{ch.badge}</Badge>
              )}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">{ch.title}</h3>
              <p className="text-sm font-medium text-foreground mt-1">{ch.detail}</p>
              <p className="text-xs text-muted-foreground">{ch.availability}</p>
            </div>
            <Button asChild size="sm" className={`w-full ${ch.buttonClass}`}>
              <a href={ch.href} target="_blank" rel="noopener noreferrer">{ch.buttonLabel}</a>
            </Button>
          </div>
        ))}
      </div>

      {/* Ticket form + FAQ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Support Ticket form */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-heading font-semibold text-foreground">Submit a Support Ticket</h3>
          <div className="space-y-3">
            <div>
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of your issue" className="mt-1.5" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue in detail..." className="mt-1.5 resize-none" rows={4} />
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSubmitTicket}>
              <Send className="h-4 w-4 mr-1.5" /> Submit Ticket
            </Button>
          </div>
        </div>

        {/* Quick Help FAQ */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Quick Help</h3>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
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
    </div>
  );
};

export default ContactSupportPage;
