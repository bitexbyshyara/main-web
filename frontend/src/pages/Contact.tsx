import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import MarketingLayout from "@/components/MarketingLayout";
import { Mail, MessageSquare, Phone, ArrowRight, Clock, Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(15).optional().or(z.literal("")),
  restaurant: z.string().trim().max(100).optional().or(z.literal("")),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

type ContactData = z.infer<typeof contactSchema>;

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "support@shyara.co.in",
    description: "For general inquiries",
    action: "Send Email",
    href: "mailto:support@shyara.co.in",
  },
  {
    icon: MessageSquare,
    label: "WhatsApp",
    value: "+91 98765 43210",
    description: "Chat with us in real-time",
    action: "Open WhatsApp",
    href: "https://wa.me/919876543210",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    description: "Call us Mon-Fri, 9 AM - 6 PM IST",
    action: "Call Now",
    href: "tel:+919876543210",
  },
];

const responseTimes = [
  { channel: "WhatsApp", time: "< 30 minutes" },
  { channel: "Email", time: "1-2 hours" },
  { channel: "Phone", time: "< 1 hour" },
  { channel: "Chat", time: "Instant" },
];

const businessHours = [
  { day: "Monday - Friday", hours: "9 AM - 6 PM IST" },
  { day: "Saturday", hours: "10 AM - 4 PM IST" },
  { day: "Sunday", hours: "Closed (Email only)" },
];

const subjects = [
  "General Inquiry",
  "Sales & Pricing",
  "Technical Support",
  "Feature Request",
  "Partnership",
  "Other",
];

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", restaurant: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactData) => {
    setLoading(true);
    try {
      await api.post("/api/contact", {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        restaurant: data.restaurant || undefined,
        subject: data.subject,
        message: data.message,
      });
      toast({ title: "Message sent!", description: "We'll get back to you within 2 hours." });
      form.reset();
    } catch (err: any) {
      toast({
        title: "Failed to send",
        description: err.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container relative py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Get in Touch
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-lg">
            Have questions? We'd love to hear from you! Our team typically responds within 2 hours.
          </p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="container -mt-8 mb-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {channels.map((ch) => (
            <div
              key={ch.label}
              className="bg-card border border-border rounded-xl p-8 text-center space-y-3 shadow-sm"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <ch.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground">{ch.label}</h3>
              <a href={ch.href} className="text-primary font-medium text-sm hover:underline block">
                {ch.value}
              </a>
              <p className="text-xs text-muted-foreground">{ch.description}</p>
              <a
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline pt-2"
              >
                {ch.action} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Support info */}
      <section className="container pb-24">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
              Send us a Message
            </h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input id="name" placeholder="Raj Kumar" {...form.register("name")} className="mt-1.5" />
                  {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="raj@example.com" {...form.register("email")} className="mt-1.5" />
                  {form.formState.errors.email && <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" {...form.register("phone")} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="restaurant">Restaurant Name</Label>
                  <Input id="restaurant" placeholder="The Golden Fork" {...form.register("restaurant")} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  onValueChange={(val) => form.setValue("subject", val, { shouldValidate: true })}
                  value={form.watch("subject")}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.subject && <p className="text-sm text-destructive mt-1">{form.formState.errors.subject.message}</p>}
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" rows={5} placeholder="Tell us how we can help you..." {...form.register("message")} className="mt-1.5" />
                {form.formState.errors.message && <p className="text-sm text-destructive mt-1">{form.formState.errors.message.message}</p>}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm hover:scale-[1.02] transition-transform"
              >
                {loading ? "Sending..." : <>Send Message <Send className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>
          </div>

          {/* Support info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Support Information
            </h2>

            {/* Response times */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Average Response Times</h3>
              </div>
              <div className="space-y-3">
                {responseTimes.map((r) => (
                  <div key={r.channel} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{r.channel}</span>
                    <span className="font-semibold text-foreground">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business hours */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Business Hours</h3>
              </div>
              <div className="space-y-3">
                {businessHours.map((b) => (
                  <div key={b.day} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{b.day}</span>
                    <span className="font-semibold text-primary">{b.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Contact;
