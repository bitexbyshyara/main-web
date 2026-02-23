import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  QrCode, Users, BookOpen, Split, Gamepad2, ClipboardList,
  LayoutDashboard, Grid3X3, CreditCard, Package, ShieldCheck,
  TrendingUp, BarChart3, PieChart, UserCheck, Joystick, FileText,
  Building2, UtensilsCrossed, Wallet, Palette, Sparkles,
  Check, Star, Smile, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MarketingLayout from "@/components/MarketingLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const categories = [
  { label: "Customer Features", icon: Users, id: "customer" },
  { label: "Staff Features", icon: LayoutDashboard, id: "staff" },
  { label: "Analytics Dashboard", icon: TrendingUp, id: "analytics" },
  { label: "Admin & Configuration", icon: Building2, id: "admin" },
];

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  bullets: string[];
  badge?: string;
}

interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  features: Feature[];
}

const sections: Section[] = [
  {
    id: "customer",
    icon: Users,
    title: "Customer Features",
    subtitle: "Tools your customers will love",
    features: [
      {
        icon: QrCode,
        title: "QR Code Ordering",
        description: "Customers scan, browse, and order from their phone — no app download needed.",
        bullets: [
          "Unique QR code per table",
          "Instant menu access on any device",
          "No app installation required",
          "Works with any smartphone camera",
        ],
      },
      {
        icon: Users,
        title: "Group Ordering Collaboration",
        description: "Everyone at the table adds items to one shared cart in real time.",
        bullets: [
          "Shared cart for the whole table",
          "Real-time sync across devices",
          "Individual item tagging",
          "Easy group coordination",
        ],
      },
      {
        icon: BookOpen,
        title: "Digital Menu",
        description: "Beautiful, always-updated menus with photos, descriptions, and dietary tags.",
        bullets: [
          "High-quality food images",
          "Dietary & allergen labels",
          "Real-time availability updates",
          "Multi-language support",
        ],
      },
      {
        icon: Split,
        title: "Bill Splitting",
        description: "Split the bill equally or by item — no awkward math at the table.",
        bullets: [
          "Split equally or by item",
          "Individual payment links",
          "Supports multiple payment methods",
          "Instant confirmation to each payer",
        ],
      },
      {
        icon: Gamepad2,
        title: "In-App Gaming",
        description: "Customers play fun mini-games while waiting — boosting happiness and your ratings.",
        bullets: [
          "Multiple game options available",
          "Reduces perceived wait time",
          "Improves customer ratings",
          "Keeps families & groups engaged",
        ],
        badge: "BiteX UNIQUE",
      },
      {
        icon: ClipboardList,
        title: "Order Tracking",
        description: "Live status updates so customers always know where their order is.",
        bullets: [
          "Real-time order status",
          "Push notifications on updates",
          "Estimated time remaining",
          "Full order history view",
        ],
      },
    ],
  },
  {
    id: "staff",
    icon: LayoutDashboard,
    title: "Staff Features",
    subtitle: "Make your team more efficient",
    features: [
      {
        icon: LayoutDashboard,
        title: "Unified Order Dashboard",
        description: "All orders from every table in one clean, real-time dashboard.",
        bullets: [
          "Live order feed across all tables",
          "Filter by status or table number",
          "One-click order confirmation",
          "Priority flagging for rush orders",
        ],
      },
      {
        icon: Grid3X3,
        title: "Table Management",
        description: "Visual table map with live status — occupied, available, or needs attention.",
        bullets: [
          "Drag-and-drop table layout",
          "Real-time occupancy status",
          "Table-specific order history",
          "Quick-assign servers to tables",
        ],
      },
      {
        icon: CreditCard,
        title: "Billing & Payments",
        description: "Generate bills instantly and accept payments via UPI, card, or cash.",
        bullets: [
          "Auto-generated bills from orders",
          "UPI, card & cash support",
          "WhatsApp bill delivery",
          "End-of-day reconciliation",
        ],
      },
      {
        icon: Package,
        title: "Inventory Management",
        description: "Track stock levels and get alerts before items run out.",
        bullets: [
          "Real-time stock tracking",
          "Low-stock alerts",
          "Auto-disable sold-out items",
          "Supplier order suggestions",
        ],
      },
      {
        icon: ShieldCheck,
        title: "Staff Accounts & Permissions",
        description: "Role-based access so every team member sees only what they need.",
        bullets: [
          "Owner, manager & staff roles",
          "Custom permission sets",
          "Activity audit logs",
          "Secure login per staff member",
        ],
      },
    ],
  },
  {
    id: "analytics",
    icon: TrendingUp,
    title: "Analytics Dashboard",
    subtitle: "Data-driven decisions",
    features: [
      {
        icon: TrendingUp,
        title: "Real-Time Sales Monitoring",
        description: "Watch your revenue, orders, and average ticket size update live.",
        bullets: [
          "Live revenue counter",
          "Orders per hour graph",
          "Average order value tracking",
          "Day-over-day comparisons",
        ],
      },
      {
        icon: BarChart3,
        title: "Table-Level Analytics",
        description: "See which tables generate the most revenue and how long guests stay.",
        bullets: [
          "Revenue per table breakdown",
          "Average session duration",
          "Table turnover rate",
          "Peak hour heatmaps",
        ],
        badge: "BiteX UNIQUE",
      },
      {
        icon: PieChart,
        title: "Menu & Item Performance",
        description: "Know your best sellers, slow movers, and most profitable items.",
        bullets: [
          "Top-selling items ranking",
          "Profit margin per item",
          "Category performance breakdown",
          "Seasonal trend analysis",
        ],
      },
      {
        icon: UserCheck,
        title: "Customer Insights",
        description: "Understand ordering patterns, repeat customers, and peak hours.",
        bullets: [
          "Repeat customer tracking",
          "Popular ordering times",
          "Average spend per customer",
          "Customer preference trends",
        ],
      },
      {
        icon: Joystick,
        title: "Gaming Engagement Metrics",
        description: "Track how games impact wait satisfaction and overall ratings.",
        bullets: [
          "Games played per session",
          "Wait time satisfaction scores",
          "Rating correlation data",
          "Most popular games report",
        ],
      },
      {
        icon: FileText,
        title: "Financial Reports",
        description: "Downloadable daily, weekly, and monthly financial summaries.",
        bullets: [
          "Daily P&L summaries",
          "Tax-ready reports",
          "Payment method breakdown",
          "Export to CSV or PDF",
        ],
      },
    ],
  },
  {
    id: "admin",
    icon: Building2,
    title: "Admin & Configuration",
    subtitle: "Full control over your setup",
    features: [
      {
        icon: Building2,
        title: "Restaurant Setup",
        description: "Configure your restaurant profile, hours, and table layout in minutes.",
        bullets: [
          "Business profile & branding",
          "Operating hours configuration",
          "Table layout designer",
          "Multi-location support",
        ],
      },
      {
        icon: UtensilsCrossed,
        title: "Menu Management",
        description: "Add, edit, and organize menu items with photos, prices, and categories.",
        bullets: [
          "Drag-and-drop menu editor",
          "Category & subcategory support",
          "Bulk import from spreadsheet",
          "Scheduled menu changes",
        ],
      },
      {
        icon: Wallet,
        title: "Payment Gateway Setup",
        description: "Connect your preferred payment provider with a few clicks.",
        bullets: [
          "Razorpay & Stripe support",
          "UPI direct integration",
          "Test mode for safe setup",
          "Automatic settlement tracking",
        ],
      },
      {
        icon: Palette,
        title: "Brand Customization",
        description: "Match the digital experience to your restaurant's brand identity.",
        bullets: [
          "Custom colors & logo",
          "Branded QR code design",
          "Custom domain support",
          "White-label option available",
        ],
      },
      {
        icon: Sparkles,
        title: "Gaming Customization",
        description: "Choose which games to offer and customize the gaming experience.",
        bullets: [
          "Select from game library",
          "Set play-time limits",
          "Brand games with your logo",
          "Enable/disable per table",
        ],
      },
    ],
  },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-40px" }}
    className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 card-hover"
  >
    {feature.badge && (
      <Badge variant="outline" className="w-fit text-xs font-semibold border-primary/40 text-primary">
        ✨ {feature.badge}
      </Badge>
    )}
    <div className="flex items-start gap-4">
      <div className="h-11 w-11 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
        <feature.icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-heading font-bold text-foreground">{feature.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
      </div>
    </div>
    <ul className="flex flex-col gap-2 mt-auto">
      {feature.bullets.map((b) => (
        <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 shrink-0 text-[hsl(var(--success))] mt-0.5" />
          {b}
        </li>
      ))}
    </ul>
  </motion.div>
);

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Features = () => (
  <MarketingLayout>
    {/* Hero */}
    <section className="relative hero-mesh py-20 md:py-28">
      <div className="container text-center max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-sm font-semibold text-primary tracking-wide uppercase mb-3"
        >
          Features
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl md:text-5xl font-heading font-extrabold text-foreground leading-tight"
        >
          Everything You Need to Run Your Restaurant
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
        >
          From customer-facing QR ordering to powerful analytics — BiteX gives you the tools to serve customers better and grow your business.
        </motion.p>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollTo(cat.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Feature Sections */}
    {sections.map((section, sIdx) => (
      <section
        key={section.id}
        id={section.id}
        className={sIdx % 2 === 1 ? "bg-secondary/30 py-16 md:py-24" : "py-16 md:py-24"}
      >
        <div className="container">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <section.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{section.title}</h2>
              <p className="text-muted-foreground text-sm mt-0.5">{section.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.features.map((feature, fIdx) => (
              <FeatureCard key={feature.title} feature={feature} index={fIdx} />
            ))}
          </div>
        </div>
      </section>
    ))}

    {/* Bottom CTA */}
    <section className="gradient-dark py-16 md:py-24">
      <div className="container text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[hsl(var(--dark-section-foreground))]">
          Ready to transform your restaurant?
        </h2>
        <p className="text-[hsl(var(--dark-section-foreground))]/70 mt-3 mb-8">
          Join hundreds of restaurants already using BiteX to delight customers and boost revenue.
        </p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8">
          <Link to="/register">Get Started Free</Link>
        </Button>
      </div>
    </section>
  </MarketingLayout>
);

export default Features;
