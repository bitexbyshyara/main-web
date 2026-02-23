import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  QrCode, Utensils, BarChart3, Gamepad2, ArrowRight, Play, CheckCircle2,
  Star, Users, ShoppingCart, TrendingUp,
  Check, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketingLayout from "@/components/MarketingLayout";
import heroDashboard from "@/assets/hero-dashboard-wide.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

const whyCards = [
  {
    icon: Users,
    title: "Group Ordering Made Simple",
    desc: "Let everyone at the table add items to a shared cart. No confusion, no missed orders.",
  },
  {
    icon: TrendingUp,
    title: "Increase Revenue per Order",
    desc: "Smart upsells and group ordering naturally boost your average order value by up to 30%.",
  },
  {
    icon: BarChart3,
    title: "Data That Actually Helps",
    desc: "See what sells, when it sells, and at what price. Make decisions backed by real numbers.",
  },
];

const featureCards = [
  { icon: QrCode, title: "QR Code Ordering", desc: "Customers scan and order from their phone. No app download needed." },
  { icon: Users, title: "Group Collaboration", desc: "Friends and families add items together to one shared order." },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Live dashboard showing orders, revenue, and customer trends." },
  { icon: Gamepad2, title: "Gaming Engagement", desc: "Fun mini-games keep customers entertained while they wait." },
];

const processSteps = [
  { icon: Building2, title: "Register Your Restaurant", desc: "Create your account and add basic restaurant details." },
  { icon: Utensils, title: "Setup Your Menu", desc: "Add categories, items, prices, and photos to your digital menu." },
  { icon: QrCode, title: "Generate QR Codes", desc: "Download unique QR codes for each table and print them." },
  { icon: ShoppingCart, title: "Start Taking Orders", desc: "Customers scan, order, and your kitchen sees it live." },
];

const Index = () => {
  return (
    <MarketingLayout>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent pointer-events-none" />
        <div className="container relative z-10 pt-6 pb-10 md:pt-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left — text content */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="order-1">
              {/* Enhanced trust badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-3 sm:px-4 py-2 mb-4 sm:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <div className="flex -space-x-1.5">
                  {["RP", "AS", "MA", "SK", "PD"].map((initials, i) => (
                    <div
                      key={i}
                      className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[9px] sm:text-[10px] font-semibold text-foreground"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">500+</span> restaurants growing with BiteX
                </p>
              </div>

              <h1 className="text-[1.6rem] leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
                More Orders, Less Chaos —{" "}
                <span className="text-primary">Automate</span> Your Restaurant
              </h1>

              <p className="mt-2 text-xs sm:text-sm font-medium text-primary">
                Zero commission. Zero app downloads. Just scan & order.
              </p>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
                Stop losing orders to busy phone lines. Let customers scan a QR code, order together as a group, and pay — while you focus on cooking great food.
              </p>

              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 shadow-xl w-full sm:w-auto">
                  <Link to="/register">Get Started Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-primary text-primary hover:bg-primary/5 font-semibold px-8 w-full sm:w-auto">
                  <Link to="/features"><Play className="mr-1 h-4 w-4" /> Watch 2-Min Demo</Link>
                </Button>
              </div>

              <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" /> Quick setup in 5 mins</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" /> Cancel anytime</span>
              </div>
            </motion.div>

            {/* Right — hero image with floating cards (visible on all screens) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative order-2"
            >
              <img
                src={heroDashboard}
                alt="BiteX Dashboard showing live orders, revenue analytics, and table management"
                className="rounded-xl lg:rounded-2xl shadow-2xl border border-border w-full"
                loading="eager"
              />


              {/* Mobile stats strip */}
              <div className="mt-4 grid grid-cols-3 rounded-xl border border-border bg-card shadow-sm lg:hidden">
                <div className="flex flex-col items-center py-3 px-2">
                  <p className="text-sm sm:text-base font-bold text-foreground">500+</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Restaurants</p>
                </div>
                <div className="flex flex-col items-center py-3 px-2 border-x border-border">
                  <p className="text-sm sm:text-base font-bold text-foreground">2M+</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="flex flex-col items-center py-3 px-2">
                  <p className="text-sm sm:text-base font-bold text-primary">30%</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">More Revenue</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Why Restaurant Owners Love BiteX ─── */}
      <section className="py-14 md:py-24 bg-background">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground">
              Why Restaurant Owners Love BiteX
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Built by people who understand the restaurant business.
            </p>
          </motion.div>

          <div className="mt-8 md:mt-14 grid gap-4 md:gap-8 md:grid-cols-3">
            {whyCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i + 1}
                className="bg-card border border-border rounded-xl p-6 md:p-8 text-center card-hover shadow-sm"
              >
                <div className="mx-auto h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 md:mb-5">
                  <card.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Packed with Features ─── */}
      <section className="py-14 md:py-24 bg-secondary/30">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground">
              Packed with Features You Need
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Everything to run your restaurant from a single dashboard.
            </p>
          </motion.div>

          <div className="mt-8 md:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {featureCards.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i + 1}
                className="bg-card border border-border rounded-xl p-4 sm:p-5 md:p-6 card-hover shadow-sm"
              >
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                  <f.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 md:mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5} className="mt-8 md:mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5 font-semibold px-8">
              <Link to="/features">Explore All Features <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── Get Started in 4 Steps ─── */}
      <section className="py-14 md:py-24 bg-background">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground">
              Get Started in 4 Simple Steps
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              From signup to your first order in less than 30 minutes
            </p>
          </motion.div>

          <div className="mt-10 md:mt-16 relative">
            {/* Connecting line — desktop horizontal */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-primary/30" />

            {/* Mobile: 2x2 grid, Desktop: 4 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={i + 1}
                  className="text-center relative"
                >
                  {/* Number badge */}
                  <div className="mx-auto mb-3 md:mb-4 relative">
                    <div className="h-8 w-8 md:h-10 md:w-10 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs md:text-sm font-bold shadow-md relative z-10">
                      {i + 1}
                    </div>
                  </div>

                  <div className="mx-auto h-11 w-11 md:h-14 md:w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                    <step.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Video Section ─── */}
      <section className="py-14 md:py-24 bg-background">
        <div className="container max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground">
              See BiteX in Action
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Watch how restaurants like yours use BiteX to streamline operations and boost revenue.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 md:mt-10"
          >
            <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-border bg-secondary flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Play className="h-6 w-6 text-primary ml-0.5" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Demo Video Coming Soon</p>
              </div>
            </div>
            <p className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
              BiteX Platform Demo — Restaurant Management Made Easy
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-14 md:py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground">
              Ready to Transform Your Restaurant?
            </h2>
            <p className="mt-3 md:mt-4 text-foreground/70 max-w-lg mx-auto text-sm sm:text-base">
              Join 500+ restaurants already using BiteX to serve smarter.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold px-8 shadow-lg w-full sm:w-auto">
                <Link to="/register">Register Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-foreground text-foreground hover:bg-foreground/10 font-semibold px-8 w-full sm:w-auto">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Index;
