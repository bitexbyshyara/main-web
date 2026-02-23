import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, UtensilsCrossed, User, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <nav className={cn("container flex items-center justify-between transition-all duration-300", scrolled ? "h-14" : "h-16")}>
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-bold text-foreground">
            BiteX
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-secondary",
                location.pathname === l.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {l.label}
              {location.pathname === l.href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                <a href={`${import.meta.env.VITE_POS_URL || "https://bitex-pos.shyara.co.in"}/dashboard`} target="_blank" rel="noopener noreferrer"><LayoutDashboard className="mr-1.5 h-4 w-4" /> Dashboard</a>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-sm">
                    <User className="mr-1.5 h-4 w-4" /> Profile <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link to="/profile"><User className="mr-2 h-4 w-4" /> My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile overlay + menu */}
      {open && (
        <>
          <div className="fixed inset-0 z-[-1] md:hidden" onClick={() => setOpen(false)} />
          <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-xl">
            <div className="container flex flex-col gap-2 py-6">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    location.pathname === l.href
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" asChild>
                      <a href={`${import.meta.env.VITE_POS_URL || "https://bitex-pos.shyara.co.in"}/dashboard`} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}><LayoutDashboard className="mr-1.5 h-4 w-4" /> Dashboard</a>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/profile" onClick={() => setOpen(false)}><User className="mr-1.5 h-4 w-4" /> Profile</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/profile/settings" onClick={() => setOpen(false)}><Settings className="mr-1.5 h-4 w-4" /> Settings</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 justify-start"
                      onClick={() => { setOpen(false); handleLogout(); }}
                    >
                      <LogOut className="mr-1.5 h-4 w-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="bg-foreground text-background hover:bg-foreground/90 font-semibold">
                      <Link to="/register" onClick={() => setOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
