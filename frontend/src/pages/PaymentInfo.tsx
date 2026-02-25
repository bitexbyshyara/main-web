import MarketingLayout from "@/components/MarketingLayout";

const PaymentInfo = () => (
  <MarketingLayout>
    <section className="py-24">
      <div className="container max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-heading font-bold">Payment Information</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2 className="font-heading">The Key Point</h2>
        <p className="text-muted-foreground">
          BiteX does not route restaurant customer payments. Restaurants connect their own payment gateway
          accounts and receive funds directly in their bank accounts.
        </p>

        <h2 className="font-heading">How It Works</h2>
        <p className="text-muted-foreground">
          You connect your own payment gateway account in the dashboard. When a customer pays, the money
          goes straight to you. BiteX does not take a cut of customer payments.
        </p>

        <h2 className="font-heading">BiteX Subscription</h2>
        <p className="text-muted-foreground">
          The only thing we charge is your monthly or annual subscription fee for using the platform.
          Subscriptions are currently processed via Razorpay. We may add PayPal later.
        </p>

        <h2 className="font-heading">Security</h2>
        <p className="text-muted-foreground">
          All payments are handled by secure, trusted processors. BiteX does not store card, UPI, or bank details.
        </p>

        <h2 className="font-heading">Contact</h2>
        <p className="text-muted-foreground">Payment questions? Email support@shyara.co.in.</p>
      </div>
    </section>
  </MarketingLayout>
);

export default PaymentInfo;
