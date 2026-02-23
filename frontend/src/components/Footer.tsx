import { Link } from "react-router-dom";
import { UtensilsCrossed, Heart, Mail, Phone, MapPin } from "lucide-react";

const productLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/features" },
];

const companyLinks = [
  { label: "About Us", href: "/contact" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Payment Info", href: "/payment-info" },
];

const Footer = () => (
  <footer className="bg-[hsl(220,25%,11%)] text-white/80">
    <div className="container py-10 md:py-16">
      <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
        {/* Brand + contact — full width on mobile */}
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-white">BiteX</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed max-w-xs">
            QR menus, live orders, table games, and analytics for restaurants.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary shrink-0" /> support@shyara.co.in</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary shrink-0" /> +91 98765 43210</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary shrink-0" /> Gujarat, India</p>
          </div>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-heading font-semibold text-white mb-3 md:mb-4 text-sm uppercase tracking-wider">Product</h4>
          <ul className="space-y-2.5">
            {productLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-heading font-semibold text-white mb-3 md:mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2.5">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-heading font-semibold text-white mb-3 md:mb-4 text-sm uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2.5">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 md:mt-12 pt-5 md:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-center sm:text-left">
          © {new Date().getFullYear()} BiteX by Shyara Tech Solution. All rights reserved.
        </p>
        <p className="text-xs flex items-center gap-1">
          Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> for Indian Restaurants
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
