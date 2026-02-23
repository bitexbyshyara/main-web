import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UtensilsCrossed } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { LoginResponse } from "@/types/auth";
import heroDashboard from "@/assets/hero-dashboard.png";

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or phone is required").max(255),
  password: z.string().min(1, "Password is required").max(128),
});

type LoginData = z.infer<typeof loginSchema>;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/api/auth/login", data);
      login(res.data.token, {
        userId: res.data.userId,
        tenantId: res.data.tenantId,
        tenantSlug: res.data.tenantSlug,
        role: res.data.role,
        email: data.identifier,
      });

      navigate("/profile");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.response?.data?.message || "Invalid credentials.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel - dark */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-dark items-center justify-center p-12">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
        <div className="absolute top-20 -left-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 max-w-md text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-heading font-bold text-white">BiteX</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">
            Welcome back
          </h2>
          <p className="mt-4 text-white/60">
            Your restaurant dashboard is one login away.
          </p>
          <img src={heroDashboard} alt="Dashboard preview" className="mt-8 rounded-xl shadow-2xl border border-white/10" loading="lazy" />
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground">BiteX</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to continue</p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="identifier">Email or Phone</Label>
              <Input id="identifier" {...form.register("identifier")} className="mt-1.5" />
              {form.formState.errors.identifier && <p className="text-sm text-destructive mt-1">{form.formState.errors.identifier.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} className="mt-1.5" />
              {form.formState.errors.password && <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-sm hover:scale-[1.02] transition-transform">
              {loading ? "Signing in…" : "Sign In"}
            </Button>
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => toast({ title: "Contact Support", description: "Please email support@shyara.co.in for password reset." })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </button>
              <p className="text-sm text-muted-foreground">
                New restaurant? <Link to="/register" className="text-foreground hover:underline font-medium">Register here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
