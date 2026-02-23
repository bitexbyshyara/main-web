import { useState } from "react";
import { Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TUTORIALS = [
  {
    id: "1",
    title: "Getting Started with BiteX",
    description: "Learn how to set up your restaurant account, add menu items, and configure your first table.",
    category: "Basics",
  },
  {
    id: "2",
    title: "Managing Your Menu",
    description: "Add categories, set prices, mark items as available or unavailable, and organize your digital menu.",
    category: "Menu",
  },
  {
    id: "3",
    title: "Setting Up QR Codes",
    description: "Generate unique QR codes for each table and learn how to print and place them effectively.",
    category: "QR Codes",
  },
  {
    id: "4",
    title: "Processing Orders",
    description: "Understand the order flow from customer to kitchen, and how to manage order statuses efficiently.",
    category: "Orders",
  },
  {
    id: "5",
    title: "Understanding Analytics",
    description: "Track your restaurant's performance with detailed reports on orders, revenue, and customer behavior.",
    category: "Analytics",
  },
  {
    id: "6",
    title: "Integrating Payment Gateways",
    description: "Connect Razorpay or other payment providers to accept online payments seamlessly.",
    category: "Integrations",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Basics: "bg-primary/10 text-primary",
  Menu: "bg-success/10 text-success",
  "QR Codes": "bg-info/10 text-info",
  Orders: "bg-warning/10 text-warning",
  Analytics: "bg-destructive/10 text-destructive",
  Integrations: "bg-secondary text-muted-foreground",
};

const HowToUsePage = () => {
  const [search, setSearch] = useState("");

  const filtered = TUTORIALS.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-heading font-bold text-foreground">How to Use BiteX</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Video tutorials are being prepared to help you get the most out of your BiteX platform. Check back soon!
        </p>
      </div>

      <div className="max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tutorials..."
          className="pl-10"
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-foreground">Video Tutorials</h2>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Coming Soon</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tutorial) => (
          <div
            key={tutorial.id}
            className="text-left bg-card border border-border rounded-xl overflow-hidden opacity-75"
          >
            <div className="relative aspect-video bg-secondary flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Coming Soon</p>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <Badge variant="secondary" className={`text-[10px] ${CATEGORY_COLORS[tutorial.category] || ""}`}>
                {tutorial.category}
              </Badge>
              <h3 className="text-sm font-heading font-semibold text-foreground line-clamp-1">{tutorial.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{tutorial.description}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10">
          <p className="text-sm text-muted-foreground">No tutorials found for "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default HowToUsePage;
