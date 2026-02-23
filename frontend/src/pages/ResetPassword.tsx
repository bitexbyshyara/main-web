import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UtensilsCrossed, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";

const schema = z.object({
  newPassword: z
    .string()
    .min(8, "Minimum 8 characters")
    .max(72, "Maximum 72 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one digit"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast({ title: "Invalid link", description: "This reset link is invalid or has expired.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { token, newPassword: data.newPassword });
      setSuccess(true);
    } catch (err: any) {
      toast({
        title: "Reset failed",
        description: err.response?.data?.message || "This link may have expired. Please request a new one.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-heading font-bold text-foreground">Invalid Reset Link</h1>
          <p className="text-muted-foreground text-sm">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-foreground">BiteX</span>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Password Reset</h1>
              <p className="text-muted-foreground text-sm">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <div className="pt-4">
                <Button asChild className="bg-foreground text-background hover:bg-foreground/90 font-semibold">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-heading font-bold text-foreground">Set New Password</h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Choose a strong password for your account.
              </p>
            </>
          )}
        </div>

        {!success && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  {...form.register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.newPassword.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                8-72 characters, must include uppercase, lowercase, and a digit
              </p>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} className="mt-1.5" />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-sm"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
