import MarketingLayout from "@/components/MarketingLayout";

const PaymentInfo = () => (
  <MarketingLayout>
    <section className="py-24">
      <div className="container max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-heading font-bold">Payment Information</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2 className="font-heading">The Key Point</h2>
        <p className="text-muted-foreground">BiteX does not touch customer payments. Money goes directly from your customer to your bank account via Razorpay or PayPal.</p>

        <h2 className="font-heading">How It Works</h2>
        <p className="text-muted-foreground">You connect your own Razorpay or PayPal account in the dashboard. When a customer pays, the money goes straight to you. We don't take a cut.</p>

        <h2 className="font-heading">BiteX Subscription</h2>
        <p className="text-muted-foreground">The only thing we charge is your monthly or annual subscription fee for using the platform.</p>

        <h2 className="font-heading">Security</h2>
        <p className="text-muted-foreground">All payments are handled by secure, trusted processors. We never store your card or bank details.</p>

        <h2 className="font-heading">Contact</h2>
        <p className="text-muted-foreground">Payment questions? Email support@shyara.co.in.</p>
      </div>
    </section>
  </MarketingLayout>
);

export default PaymentInfo;
