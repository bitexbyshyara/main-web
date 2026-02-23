import MarketingLayout from "@/components/MarketingLayout";

const Terms = () => (
  <MarketingLayout>
    <section className="py-24">
      <div className="container max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-heading font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2 className="font-heading">1. Agreement</h2>
        <p className="text-muted-foreground">By using BiteX, you agree to these terms. BiteX is provided by Shyara Tech Solution.</p>

        <h2 className="font-heading">2. What BiteX Does</h2>
        <p className="text-muted-foreground">BiteX helps restaurants show their menu via QR codes, take live orders, manage the kitchen, and see sales reports.</p>

        <h2 className="font-heading">3. Your Account</h2>
        <p className="text-muted-foreground">Keep your login details safe. Make sure the info you give us is accurate.</p>

        <h2 className="font-heading">4. Billing</h2>
        <p className="text-muted-foreground">You pay monthly or yearly. You can upgrade, downgrade, or cancel anytime. Cancellations last until the end of your billing period.</p>

        <h2 className="font-heading">5. Fair Use</h2>
        <p className="text-muted-foreground">Don't misuse the platform or try to hack it. We can suspend accounts that break these rules.</p>

        <h2 className="font-heading">6. Liability</h2>
        <p className="text-muted-foreground">BiteX is provided "as is". We're not responsible for indirect damages from using the service.</p>

        <h2 className="font-heading">7. Legal</h2>
        <p className="text-muted-foreground">These terms follow Indian law. Disputes are handled in Gujarat, India.</p>

        <h2 className="font-heading">8. Contact</h2>
        <p className="text-muted-foreground">Questions? Email support@shyara.co.in.</p>
      </div>
    </section>
  </MarketingLayout>
);

export default Terms;
