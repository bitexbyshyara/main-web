import MarketingLayout from "@/components/MarketingLayout";

const RefundPolicy = () => (
  <MarketingLayout>
    <section className="py-24">
      <div className="container max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-heading font-bold">Refund Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2 className="font-heading">Food Order Refunds</h2>
        <p className="text-muted-foreground">Customer payments go to the restaurant, not to us. For food order refunds, contact the restaurant directly using the details on your receipt or WhatsApp bill.</p>

        <h2 className="font-heading">How Long Do Refunds Take?</h2>
        <p className="text-muted-foreground">Refunds usually take 5–7 business days, depending on your bank.</p>

        <h2 className="font-heading">Subscription Refunds</h2>
        <p className="text-muted-foreground">Subscription fees are not refundable once the billing period starts. You can cancel anytime and keep access until the period ends.</p>

        <h2 className="font-heading">Contact</h2>
        <p className="text-muted-foreground">Billing issues? Email support@shyara.co.in.</p>
      </div>
    </section>
  </MarketingLayout>
);

export default RefundPolicy;
