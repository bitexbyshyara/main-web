import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
  </div>
);

export default MarketingLayout;
