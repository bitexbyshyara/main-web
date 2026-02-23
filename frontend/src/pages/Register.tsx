import { useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, UtensilsCrossed, Eye, EyeOff,
  Star, QrCode, LayoutDashboard, Share2, Sparkles, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TIERS } from "@/lib/constants";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterResponse } from "@/types/auth";

/* ── Schema ─────────────────────── */
const step1Schema = z.object({
  restaurantName: z.string().trim().min(2, "Restaurant name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(15).optional().or(z.literal("")),
  password: z.string()
    .min(8, "Minimum 8 characters")
    .max(72, "Maximum 72 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[0-9]/, "Must include a digit"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Step1Data = z.infer<typeof step1Schema>;

/* ── Password strength helper ─────────────────────────── */
function getPasswordStrength(pw: string): { label: string; percent: number; color: string } {
  if (!pw) return { label: "", percent: 0, color: "bg-border" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", percent: 20, color: "bg-destructive" };
  if (score <= 3) return { label: "Medium", percent: 55, color: "bg-warning" };
  return { label: "Strong", percent: 100, color: "bg-success" };
}

/* ── Dynamic left-panel content ───────────────────────── */
const STEP_PANELS: Record<number, { heading: string; sub: string; content: React.ReactNode }> = {
  1: {
    heading: "Join 500+ restaurants already growing with BiteX",
    sub: "",
    content: (
      <div className="space-y-6 mt-6">
        <div className="flex justify-center gap-6 text-center">
          {[
            { n: "500+", l: "Restaurants" },
            { n: "50K+", l: "Orders Served" },
            { n: "4", l: "Cities Live" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-heading font-bold text-primary">{s.n}</p>
              <p className="text-xs text-white/50">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-sm text-white/70 italic">
            "We set up BiteX in 10 minutes and got our first digital order the same evening. Customers love it."
          </p>
          <p className="text-xs text-white/40 mt-2">— Rajesh P., The Spice Room, Mumbai</p>
        </div>
      </div>
    ),
  },
  2: {
    heading: "Most restaurants pick Live Ordering",
    sub: "Upgrade anytime — no contracts, cancel whenever.",
    content: (
      <div className="space-y-4 mt-6">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-primary">↗ 73% of owners</span> choose Live Ordering or above for instant kitchen updates and analytics.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-xs text-white/50 mb-1">Why upgrade?</p>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Orders go straight to the kitchen</li>
            <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> See your bestsellers and revenue</li>
            <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Customers love the speed</li>
          </ul>
        </div>
      </div>
    ),
  },
  3: {
    heading: "You're almost live!",
    sub: "Here's what happens next:",
    content: (
      <div className="space-y-3 mt-6">
        {[
          { icon: LayoutDashboard, text: "Set up your menu and add tables" },
          { icon: QrCode, text: "Generate QR codes for each table" },
          { icon: Share2, text: "Print, place on tables, and go live" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-white/80">{text}</p>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-3 text-xs text-white/40">
          <Clock className="h-3.5 w-3.5" />
          <span>Takes under 2 minutes to go live</span>
        </div>
      </div>
    ),
  },
};

/* ── Component ────────────────────────────────────────── */
const Register = () => {
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const [selectedTier, setSelectedTier] = useState(Number(searchParams.get("tier")) || 2);
  const [formData, setFormData] = useState<Step1Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate("/profile", { replace: true });
    return null;
  }

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { restaurantName: "", email: "", phone: "", password: "" },
  });

  const watchPassword = form.watch("password");
  const pwStrength = useMemo(() => getPasswordStrength(watchPassword || ""), [watchPassword]);

  const onStep1 = (data: Step1Data) => { setFormData(data); setStep(2); };
  const onStep2 = () => setStep(3);

  const onSubmit = async () => {
    if (!formData) return;
    setLoading(true);
    try {
      const effectiveTier = Math.min(selectedTier, 2);
      const res = await api.post<RegisterResponse>("/api/auth/register", {
        restaurantName: formData.restaurantName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        tier: effectiveTier,
        billingCycle: billingCycle === "annual" ? "yearly" : "monthly",
      });
      login(res.data.token, res.data.refreshToken, {
        userId: res.data.userId,
        tenantId: res.data.tenantId,
        tenantSlug: res.data.tenantSlug,
        role: res.data.role,
        email: res.data.email,
      });
      toast({ title: "Welcome to BiteX!", description: "Your restaurant has been registered." });
      navigate("/profile?welcome=true");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.response?.data?.message || "Something went wrong.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const tierForDisplay = TIERS.find((t) => t.id === selectedTier);
  const tierPrice = billingCycle === "annual" ? tierForDisplay?.annualPrice : tierForDisplay?.price;
  const panel = STEP_PANELS[step];

  /* upsell nudge for tier 1 */
  const showUpsellNudge = selectedTier === 1;
  const tier2 = TIERS.find((t) => t.id === 2)!;
  const priceDiff = (billingCycle === "monthly" ? tier2.price : tier2.annualPrice) - (billingCycle === "monthly" ? TIERS[0].price : TIERS[0].annualPrice);

  return (
    <div className="min-h-screen flex">
      {/* ── Left brand panel — dynamic per step ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden gradient-dark items-center justify-center p-12">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
        <div className="absolute top-20 -left-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 max-w-md text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-heading font-bold text-white">BiteX</span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-white">{panel.heading}</h2>
            {panel.sub && <p className="mt-2 text-white/60 text-sm">{panel.sub}</p>}
            {panel.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col bg-background overflow-y-auto">
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-lg">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground">BiteX</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground text-center lg:text-left">
              Create Your Restaurant
            </h1>

            {/* Social proof strip */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-2 mb-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">Trusted by 500+ restaurants across 4 cities</span>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[
                { s: 1, label: "Details" },
                { s: 2, label: "Plan" },
                { s: 3, label: "Confirm" },
              ].map(({ s, label }) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step >= s ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                    }`}>
                      {step > s ? <Check className="h-4 w-4" /> : s}
                    </div>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">{label}</span>
                  </div>
                  {s < 3 && <div className={`w-10 sm:w-14 h-0.5 transition-colors mb-4 sm:mb-5 ${step > s ? "bg-foreground" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ── STEP 1 ── */}
              {step === 1 && (
                <motion.form key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  onSubmit={form.handleSubmit(onStep1)} className="space-y-4"
                >
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Takes under 2 minutes
                  </p>
                  <div>
                    <Label htmlFor="restaurantName">Restaurant Name</Label>
                    <Input id="restaurantName" {...form.register("restaurantName")} className="mt-1.5" />
                    {form.formState.errors.restaurantName && <p className="text-sm text-destructive mt-1">{form.formState.errors.restaurantName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Manager Email</Label>
                    <Input id="email" type="email" {...form.register("email")} className="mt-1.5" />
                    {form.formState.errors.email && <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" {...form.register("phone")} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1.5">
                      <Input id="password" type={showPassword ? "text" : "password"} {...form.register("password")} className="pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {watchPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${pwStrength.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pwStrength.percent}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className={`text-xs ${pwStrength.percent <= 20 ? 'text-destructive' : pwStrength.percent <= 55 ? 'text-warning' : 'text-success'}`}>
                          {pwStrength.label}
                        </p>
                      </div>
                    )}
                    {form.formState.errors.password && <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} className="mt-1.5" />
                    {form.formState.errors.confirmPassword && <p className="text-sm text-destructive mt-1">{form.formState.errors.confirmPassword.message}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-sm hover:scale-[1.02] transition-transform">
                    Next <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-foreground hover:underline font-medium">Log in</Link>
                  </p>
                </motion.form>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">Choose your plan</p>
                    {/* Annual toggle */}
                    <button
                      type="button"
                      onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className={billingCycle === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"}>Monthly</span>
                      <div className={`w-9 h-5 rounded-full relative transition-colors ${billingCycle === "annual" ? "bg-primary" : "bg-secondary"}`}>
                        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${billingCycle === "annual" ? "translate-x-4" : "translate-x-0.5"}`} />
                      </div>
                      <span className={billingCycle === "annual" ? "text-foreground font-medium" : "text-muted-foreground"}>
                        Annual
                        <span className="ml-1 text-primary font-semibold">Save 15%</span>
                      </span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {TIERS.map((tier) => {
                      const isSelected = selectedTier === tier.id;
                      const price = billingCycle === "annual" ? tier.annualPrice : tier.price;
                      const features = tier.features.filter((f) => f.included).slice(0, 4);
                      const isPopular = tier.id === 2;

                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedTier(tier.id)}
                          className={`w-full bg-card border rounded-xl p-4 text-left transition-all card-hover relative ${
                            isSelected
                              ? "ring-2 ring-foreground border-foreground shadow-md"
                              : "border-border hover:border-muted-foreground/30"
                          } ${isPopular && !isSelected ? "ring-1 ring-primary/30" : ""}`}
                        >
                          {/* Badge */}
                          {tier.badge && (
                            <span className={`absolute -top-2.5 right-4 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                              isPopular ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                            }`}>
                              {tier.badge}
                            </span>
                          )}

                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-heading font-semibold text-foreground">{tier.name}</h4>
                                {isPopular && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{tier.description}</p>
                              <ul className="mt-2 space-y-1">
                                {features.map((f) => (
                                  <li key={f.text} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                    <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                    {f.text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-heading font-bold text-foreground">₹{price}</p>
                              <p className="text-[10px] text-muted-foreground">/month</p>
                              {billingCycle === "annual" && (
                                <p className="text-[10px] text-muted-foreground line-through">₹{tier.price}</p>
                              )}
                            </div>
                          </div>

                          {tier.id > 2 && isSelected && (
                            <p className="mt-2 text-xs text-primary">Starts on Live Ordering. We'll upgrade you after a quick review.</p>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Upsell nudge */}
                  <AnimatePresence>
                    {showUpsellNudge && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-xs text-foreground">
                            For just <span className="font-bold text-primary">₹{priceDiff.toLocaleString("en-IN")} more</span>, get live ordering &amp; kitchen display.{" "}
                            <button type="button" onClick={() => setSelectedTier(2)} className="underline font-medium text-primary hover:text-primary-dark">
                              Switch to Live Ordering →
                            </button>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 pt-1">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={onStep2} className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-semibold">
                      Next <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3 ── */}
              {step === 3 && formData && (
                <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="space-y-5"
                >
                  {/* Order summary card */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                    <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" /> Review & Confirm
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Restaurant</span>
                        <span className="font-medium text-foreground">{formData.restaurantName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium text-foreground">{formData.email}</span>
                      </div>
                      {formData.phone && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="font-medium text-foreground">{formData.phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-medium text-foreground">{tierForDisplay?.name}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Price</span>
                        <div className="text-right">
                          <span className="font-bold text-foreground text-base">₹{tierPrice?.toLocaleString("en-IN")}/mo</span>
                          {billingCycle === "annual" && (
                            <span className="block text-xs text-muted-foreground line-through">₹{tierForDisplay?.price}/mo</span>
                          )}
                          {billingCycle === "annual" && (
                            <span className="block text-xs text-primary font-medium">Billed annually</span>
                          )}
                        </div>
                      </div>
                      {selectedTier > 2 && (
                        <p className="text-xs text-primary mt-2">You'll start on Live Ordering. We'll switch you to {tierForDisplay?.name} shortly.</p>
                      )}
                    </div>
                  </div>

                  {/* What happens next */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">What happens next:</p>
                    {[
                      { icon: LayoutDashboard, text: "Set up your menu and add tables" },
                      { icon: QrCode, text: "Generate QR codes for each table" },
                      { icon: Share2, text: "Print, place on tables, and go live" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Icon className="h-4 w-4 text-primary shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex gap-3 pt-1">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={onSubmit}
                      disabled={loading}
                      className="flex-1 gradient-orange text-primary-foreground hover:opacity-90 font-semibold shadow-lg shimmer-btn hover:scale-[1.02] transition-transform"
                    >
                      {loading ? "Creating…" : "Create My Restaurant 🚀"}
                    </Button>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">Cancel anytime · No long-term contracts</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
