import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-bold text-foreground">BiteX</span>
        </div>

        <h1 className="text-8xl font-heading font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! This page doesn't exist</p>
        <Button asChild className="bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-sm">
          <Link to="/"><Home className="mr-2 h-4 w-4" /> Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
