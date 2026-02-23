interface Tier {
  id: number;
  name: string;
  price: number;
  annualPrice: number;
  color: string;
  badge: string | null;
  badgeColor?: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  ctaLink: string;
}

export const TIERS: Tier[] = [
  {
    id: 1,
    name: "QR Menu",
    price: 999,
    annualPrice: 849,
    color: "primary",
    badge: null,
    description: "Customers scan and see your menu",
    features: [
      { text: "QR code menu for every table", included: true },
      { text: "Easy menu editor", included: true },
      { text: "Simple dashboard", included: true },
      { text: "Table management", included: true },
      { text: "Live ordering", included: false },
      { text: "Kitchen display board", included: false },
      { text: "Analytics", included: false },
      { text: "Payment gateway", included: false },
    ],
    cta: "Get Started",
    ctaLink: "/register?tier=1",
  },
  {
    id: 2,
    name: "Live Ordering",
    price: 1999,
    annualPrice: 1699,
    color: "primary",
    badge: "Popular",
    badgeColor: "bg-primary text-primary-foreground",
    description: "Orders go straight to your kitchen",
    features: [
      { text: "Everything in QR Menu", included: true },
      { text: "Customers order together", included: true },
      { text: "Kitchen sees orders instantly", included: true },
      { text: "See your top-selling items", included: true },
      { text: "Get notified on new orders", included: true },
      { text: "Table games (upgrade to unlock)", included: false },
      { text: "Payment integration", included: false },
      { text: "Advanced analytics", included: false },
    ],
    cta: "Get Started",
    ctaLink: "/register?tier=2",
  },
  {
    id: 3,
    name: "Full Experience",
    price: 3499,
    annualPrice: 2999,
    color: "gold",
    badge: "Best Value",
    badgeColor: "bg-gold text-primary-foreground",
    description: "Payments, games, and WhatsApp bills",
    features: [
      { text: "Everything in Live Ordering", included: true },
      { text: "Fun table games for customers", included: true },
      { text: "Accept online payments", included: true },
      { text: "Send bills via WhatsApp", included: true },
      { text: "Your logo and colors", included: true },
      { text: "Priority support", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Heatmaps & AI suggestions", included: false },
    ],
    cta: "Get Started",
    ctaLink: "/register?tier=3",
  },
  {
    id: 4,
    name: "Smart Analytics",
    price: 5999,
    annualPrice: 5099,
    color: "purple-tier",
    badge: "Enterprise",
    badgeColor: "bg-purple-tier text-foreground",
    description: "Know what sells and at what price",
    features: [
      { text: "Everything in Full Experience", included: true },
      { text: "Detailed sales reports", included: true },
      { text: "See what customers click most", included: true },
      { text: "Smart pricing suggestions", included: true },
      { text: "Revenue predictions", included: true },
      { text: "Manage multiple locations", included: true },
      { text: "Personal account manager", included: true },
      { text: "Custom integrations", included: true },
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
  },
];

export const STATS = [
  { label: "Restaurants", value: 500, suffix: "+" },
  { label: "Orders Served", value: 50000, suffix: "+" },
  { label: "Cities Live", value: 4, suffix: "" },
] as const;

export const FAQS = [
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes! You can upgrade your plan anytime from your dashboard. The change takes effect immediately and you'll only pay the difference.",
  },
  {
    question: "Is there a setup fee?",
    answer: "No, there are no setup fees. You only pay the monthly or annual subscription fee for your chosen plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe.",
  },
  {
    question: "How quickly can I get started?",
    answer: "You can be up and running in under 30 minutes. Just sign up, add your menu, print your QR codes, and start taking orders.",
  },
  {
    question: "What if I cancel my subscription?",
    answer: "You can cancel anytime. Your account will remain active until the end of your billing period. No cancellation fees.",
  },
  {
    question: "Is there a long-term contract?",
    answer: "No long-term contracts. All plans are month-to-month unless you choose annual billing for extra savings.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes! Save approximately 17% when you choose annual billing on any plan.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "Your data is retained for 30 days after cancellation. You can export it anytime before that. After 30 days, it's permanently deleted.",
  },
  {
    question: "Do you have a refund policy?",
    answer: "Yes. If you're not satisfied within the first 14 days, we offer a full refund — no questions asked.",
  },
];
