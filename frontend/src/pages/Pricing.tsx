import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X as XIcon, ArrowRight, HelpCircle, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketingLayout from "@/components/MarketingLayout";
import { TIERS, FAQS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const plans = TIERS.map((tier) => ({
  name: tier.name,
  subtitle: tier.description,
  price: tier.price,
  yearlyPrice: tier.annualPrice,
  popular: tier.id === 2,
  cta: tier.cta,
  ctaLink: tier.ctaLink,
  features: tier.features.filter((f) => f.included).map((f) => f.text),
  comingSoon: tier.id > 2,
}));

const comparisonRows = [
  { feature: "QR Code Menu", values: [true, true, true, true] },
  { feature: "Table Management", values: [true, true, true, true] },
  { feature: "Live Ordering", values: [false, true, true, true] },
  { feature: "Kitchen Display", values: [false, true, true, true] },
  { feature: "Table Games", values: [false, false, true, true] },
  { feature: "Online Payments", values: [false, false, true, true] },
  { feature: "WhatsApp Bills", values: [false, false, true, true] },
  { feature: "Custom Branding", values: [false, false, true, true] },
  { feature: "Advanced Analytics", values: [false, false, false, true] },
  { feature: "Multi-Location", values: [false, false, false, true] },
  { feature: "AI Suggestions", values: [false, false, false, true] },
  { feature: "Priority Support", values: [false, false, true, true] },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <MarketingLayout>
      {/* Header */}
      <section className="pt-28 pb-20 relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="container relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-primary uppercase tracking-wider"
          >
            Pricing
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-2 text-4xl md:text-5xl font-heading font-bold text-foreground"
          >
            Choose the Perfect Plan for Your Restaurant
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground max-w-lg mx-auto"
          >
            Flexible pricing that grows with your business. No hidden fees, cancel anytime.
          </motion.p>

          {/* Pill toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                !annual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="rounded-full bg-green-500 text-white text-[10px] font-bold px-2 py-0.5">
                Save 17%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 -mt-4">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`relative bg-card rounded-2xl p-6 flex flex-col border-2 transition-shadow ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-bold uppercase tracking-wider">
                      <Star className="h-3 w-3 fill-current" /> Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-heading font-bold text-foreground mt-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.subtitle}</p>

                <div className="mt-5 mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">₹</span>
                    <span className="text-4xl font-heading font-bold text-foreground">
                      {(annual ? plan.yearlyPrice : plan.price).toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>

                {plan.comingSoon ? (
                  <Button disabled className="w-full rounded-full font-semibold" variant="outline">
                    Coming Soon
                  </Button>
                ) : (
                  <Button
                    asChild
                    className={`w-full rounded-full font-semibold group ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link to={plan.ctaLink}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                )}

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-24 bg-secondary/30">
        <div className="container max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-heading font-bold text-center mb-12 text-foreground"
          >
            Feature Comparison
          </motion.h2>

          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                  {TIERS.map((tier) => (
                    <th key={tier.id} className={`p-4 font-semibold text-center ${tier.id === 2 ? "text-primary" : "text-foreground"}`}>
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-secondary/20" : ""}
                  >
                    <td className="p-4 font-medium text-foreground">{row.feature}</td>
                    {row.values.map((val, idx) => (
                      <td key={idx} className="p-4 text-center">
                        {val ? (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XIcon className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-border font-bold">
                  <td className="p-4 text-foreground">Price (Monthly)</td>
                  {TIERS.map((tier) => (
                    <td key={tier.id} className={`p-4 text-center ${tier.id === 2 ? "text-primary" : "text-foreground"}`}>
                      ₹{tier.price.toLocaleString("en-IN")}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-heading font-bold text-center mb-12 text-foreground"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
                className="border border-border rounded-xl bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="flex-1 font-medium text-foreground">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pl-15 text-sm text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-heading font-bold text-primary-foreground">
            Still Have Questions?
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-md mx-auto">
            Our team is here to help you choose the right plan for your restaurant.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary group"
            >
              <Link to="/contact">
                Talk to Sales <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Pricing;
