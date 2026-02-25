import MarketingLayout from "@/components/MarketingLayout";

const RefundPolicy = () => (
  <MarketingLayout>
    <section className="py-24">
      <div className="container max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-heading font-bold">Refund Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2 className="font-heading">BiteX Subscription Refunds</h2>
        <p className="text-muted-foreground">
          BiteX subscription fees are non-refundable once a billing period has started.
          You can cancel anytime and your access will continue until the end of the current billing cycle.
        </p>

        <h2 className="font-heading">Billing Errors</h2>
        <p className="text-muted-foreground">
          If you believe you were charged incorrectly, contact us within 7 days of the charge.
          If a refund is approved, we will initiate it within 5 business days and it typically reflects
          in 5-7 business days depending on your bank or payment method.
        </p>

        <h2 className="font-heading">Restaurant Order Refunds</h2>
        <p className="text-muted-foreground">
          BiteX does not process customer food-order payments. Refunds for food orders are handled
          by each restaurant according to their policies. Please contact the restaurant directly.
        </p>

        <h2 className="font-heading">Contact</h2>
        <p className="text-muted-foreground">Billing issues? Email support@shyara.co.in or call +91 95846 61610.</p>
      </div>
    </section>
  </MarketingLayout>
);

export default RefundPolicy;
