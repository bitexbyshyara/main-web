import MarketingLayout from "@/components/MarketingLayout";

const Terms = () => (
  <MarketingLayout>
    <section className="py-24">
      <div className="container max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-heading font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2 className="font-heading">1. Agreement</h2>
        <p className="text-muted-foreground">
          By using BiteX, you agree to these terms. BiteX is operated by SHYARA TECH SOLUTION (OPC) PRIVATE LIMITED.
        </p>
        <p className="text-muted-foreground">
          Address: Jai Hanuman Colony, Bazar Samiti, Mahendru, Sampatchak, Patna- 800006, Bihar
        </p>

        <h2 className="font-heading">2. What BiteX Does</h2>
        <p className="text-muted-foreground">
          BiteX provides software for restaurants to manage menus, ordering, billing workflows, and analytics.
          BiteX is a SaaS platform and is not the seller of food or services offered by restaurants.
        </p>

        <h2 className="font-heading">3. Restaurant Payments</h2>
        <p className="text-muted-foreground">
          Restaurant customer payments are processed directly by each restaurant using their own payment gateway accounts.
          BiteX does not route funds between restaurants and their customers and does not store card, UPI, or bank payment instrument data.
        </p>

        <h2 className="font-heading">4. Your Account</h2>
        <p className="text-muted-foreground">Keep your login details safe. Make sure the info you give us is accurate.</p>

        <h2 className="font-heading">5. Subscriptions & Auto-Renewal</h2>
        <p className="text-muted-foreground">
          BiteX subscriptions are billed monthly or yearly and renew automatically unless cancelled.
          You can cancel anytime; cancellation takes effect at the end of your current billing period.
          No refunds are provided once a billing period has started, except where required by law.
        </p>

        <h2 className="font-heading">6. Fair Use</h2>
        <p className="text-muted-foreground">Don't misuse the platform or try to hack it. We can suspend accounts that break these rules.</p>

        <h2 className="font-heading">7. Liability</h2>
        <p className="text-muted-foreground">BiteX is provided "as is". We're not responsible for indirect damages from using the service.</p>

        <h2 className="font-heading">8. Legal</h2>
        <p className="text-muted-foreground">These terms follow Indian law. Disputes are handled in Patna, India.</p>

        <h2 className="font-heading">9. Contact</h2>
        <p className="text-muted-foreground">Questions? Email support@shyara.co.in or call +91 95846 61610.</p>
      </div>
    </section>
  </MarketingLayout>
);

export default Terms;
