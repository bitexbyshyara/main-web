import { useState } from "react";
import { Search, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const TUTORIALS = [
  {
    id: "1",
    title: "Getting Started with BiteX",
    description: "Learn how to set up your restaurant account, add menu items, and configure your first table.",
    category: "Basics",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "Managing Your Menu",
    description: "Add categories, set prices, mark items as available or unavailable, and organize your digital menu.",
    category: "Menu",
    videoId: "jNQXAC9IVRw",
  },
  {
    id: "3",
    title: "Setting Up QR Codes",
    description: "Generate unique QR codes for each table and learn how to print and place them effectively.",
    category: "QR Codes",
    videoId: "9bZkp7q19f0",
  },
  {
    id: "4",
    title: "Processing Orders",
    description: "Understand the order flow from customer to kitchen, and how to manage order statuses efficiently.",
    category: "Orders",
    videoId: "kJQP7kiw5Fk",
  },
  {
    id: "5",
    title: "Understanding Analytics",
    description: "Track your restaurant's performance with detailed reports on orders, revenue, and customer behavior.",
    category: "Analytics",
    videoId: "RgKAFK5djSk",
  },
  {
    id: "6",
    title: "Integrating Payment Gateways",
    description: "Connect Razorpay, Stripe, or other payment providers to accept online payments seamlessly.",
    category: "Integrations",
    videoId: "JGwWNGJdvx8",
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
  const [selectedVideo, setSelectedVideo] = useState<typeof TUTORIALS[number] | null>(null);

  const filtered = TUTORIALS.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-heading font-bold text-foreground">How to Use BiteX</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Watch our video tutorials to get the most out of your BiteX restaurant management platform.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tutorials..."
          className="pl-10"
        />
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-foreground">Video Tutorials</h2>
        <button className="text-xs text-primary font-medium hover:underline">View All</button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tutorial) => (
          <button
            key={tutorial.id}
            onClick={() => setSelectedVideo(tutorial)}
            className="text-left bg-card border border-border rounded-xl overflow-hidden hover:shadow-soft transition-all group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-secondary">
              <img
                src={`https://img.youtube.com/vi/${tutorial.videoId}/mqdefault.jpg`}
                alt={tutorial.title}
                className="w-full h-full object-cover"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/10 transition-colors">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                </div>
              </div>
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-3">
                <p className="text-xs font-medium text-primary-foreground line-clamp-1">{tutorial.title}</p>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <Badge variant="secondary" className={`text-[10px] ${CATEGORY_COLORS[tutorial.category] || ""}`}>
                {tutorial.category}
              </Badge>
              <h3 className="text-sm font-heading font-semibold text-foreground line-clamp-1">{tutorial.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{tutorial.description}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10">
          <p className="text-sm text-muted-foreground">No tutorials found for "{search}"</p>
        </div>
      )}

      {/* Video modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          {selectedVideo && (
            <div>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <Badge variant="secondary" className={`text-[10px] mb-2 ${CATEGORY_COLORS[selectedVideo.category] || ""}`}>
                  {selectedVideo.category}
                </Badge>
                <h3 className="font-heading font-semibold text-foreground">{selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedVideo.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HowToUsePage;
