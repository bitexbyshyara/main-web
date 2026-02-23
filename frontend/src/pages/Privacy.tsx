import MarketingLayout from "@/components/MarketingLayout";

const Privacy = () => (
  <MarketingLayout>
    <section className="py-24">
      <div className="container max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-heading font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2 className="font-heading">1. Introduction</h2>
        <p className="text-muted-foreground">BiteX is built by Shyara Tech Solution. We take your privacy seriously and this page explains what data we collect and why.</p>

        <h2 className="font-heading">2. What We Collect</h2>
        <p className="text-muted-foreground">We collect your restaurant name, email, and phone when you sign up. We also track how you use the platform to make it better.</p>

        <h2 className="font-heading">3. How We Use It</h2>
        <p className="text-muted-foreground">We use your info to run the service, process orders, and send you important updates. We never sell your data.</p>

        <h2 className="font-heading">4. Where We Store It</h2>
        <p className="text-muted-foreground">All data is stored on secure servers in India. Everything is encrypted.</p>

        <h2 className="font-heading">5. Third-Party Services</h2>
        <p className="text-muted-foreground">We use Razorpay and PayPal for payments. They have their own privacy policies.</p>

        <h2 className="font-heading">6. Your Rights</h2>
        <p className="text-muted-foreground">You can ask us to view, update, or delete your data anytime. Just email support@shyara.co.in.</p>

        <h2 className="font-heading">7. Contact</h2>
        <p className="text-muted-foreground">Questions? Email support@shyara.co.in.</p>
      </div>
    </section>
  </MarketingLayout>
);

export default Privacy;
