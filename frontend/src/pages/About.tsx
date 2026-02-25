import MarketingLayout from "@/components/MarketingLayout";

const About = () => (
  <MarketingLayout>
    <section className="py-24">
      <div className="container max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-heading font-bold">About BiteX</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2 className="font-heading">Who We Are</h2>
        <p className="text-muted-foreground">
          BiteX is a restaurant SaaS platform that helps restaurants manage menus, orders,
          and billing workflows.
        </p>

        <h2 className="font-heading">Legal Entity</h2>
        <p className="text-muted-foreground">
          SHYARA TECH SOLUTION (OPC) PRIVATE LIMITED
          <br />
          Jai Hanuman Colony, Bazar Samiti, Mahendru, Sampatchak, Patna- 800006, Bihar
        </p>

        <h2 className="font-heading">Contact</h2>
        <p className="text-muted-foreground">Email: support@shyara.co.in</p>
        <p className="text-muted-foreground">Phone: +91 95846 61610</p>
      </div>
    </section>
  </MarketingLayout>
);

export default About;
