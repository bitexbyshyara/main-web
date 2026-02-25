import MarketingLayout from "@/components/MarketingLayout";

const Privacy = () => (
  <MarketingLayout>
    <section className="py-24">
      <div className="container max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-heading font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2 className="font-heading">1. Introduction</h2>
        <p className="text-muted-foreground">
          BiteX is operated by SHYARA TECH SOLUTION (OPC) PRIVATE LIMITED. We take your privacy seriously
          and this page explains what data we collect and why.
        </p>

        <h2 className="font-heading">2. What We Collect</h2>
        <p className="text-muted-foreground">
          We collect account and contact details (name, email, phone), restaurant details, and usage data.
          We may also process order metadata on behalf of restaurants. We do not store card, UPI, or bank
          payment instrument data.
        </p>

        <h2 className="font-heading">3. How We Use It</h2>
        <p className="text-muted-foreground">
          We use your info to provide and improve the service, process orders, provide support,
          and maintain security and compliance. We never sell your data.
        </p>

        <h2 className="font-heading">4. Where We Store It</h2>
        <p className="text-muted-foreground">All data is stored on secure servers in India. Everything is encrypted.</p>

        <h2 className="font-heading">5. Third-Party Services</h2>
        <p className="text-muted-foreground">
          BiteX subscriptions are processed via Razorpay. We may add PayPal later.
          Restaurant customer payments are handled by each restaurant using their own payment gateway accounts.
          These providers have their own privacy policies.
        </p>

        <h2 className="font-heading">6. Sharing</h2>
        <p className="text-muted-foreground">
          We share data with service providers strictly to operate the platform, and with restaurants
          for order fulfillment. We do not sell personal data.
        </p>

        <h2 className="font-heading">7. Data Retention</h2>
        <p className="text-muted-foreground">
          We retain data for as long as required to provide the service and meet legal obligations.
          If you cancel, we may retain data for up to 30 days for support, compliance, or backups.
        </p>

        <h2 className="font-heading">8. Your Rights</h2>
        <p className="text-muted-foreground">
          You can ask us to view, update, or delete your data anytime. Just email support@shyara.co.in.
        </p>

        <h2 className="font-heading">9. Contact</h2>
        <p className="text-muted-foreground">Questions? Email support@shyara.co.in or call +91 95846 61610.</p>
        <p className="text-muted-foreground">
          Address: Jai Hanuman Colony, Bazar Samiti, Mahendru, Sampatchak, Patna- 800006, Bihar
        </p>
      </div>
    </section>
  </MarketingLayout>
);

export default Privacy;
