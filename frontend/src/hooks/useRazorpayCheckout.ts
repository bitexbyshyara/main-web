import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
  prefill?: { email?: string; contact?: string };
  theme?: { color?: string };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface CheckoutData {
  razorpaySubscriptionId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  planName: string;
  tier: number;
  billingCycle: string;
}

interface CheckoutParams {
  tier?: number;
  billingCycle?: string;
  email?: string;
  phone?: string;
}

export function useRazorpayCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const startCheckout = useCallback(
    async (params: CheckoutParams = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!window.Razorpay) {
          throw new Error("Payment service not loaded. Please refresh the page and try again.");
        }

        const checkoutRes = await api.post<CheckoutData>("/api/billing/checkout", {
          tier: params.tier,
          billingCycle: params.billingCycle,
        });

        const data = checkoutRes.data;

        return new Promise<boolean>((resolve) => {
          const options: RazorpayOptions = {
            key: data.razorpayKeyId,
            subscription_id: data.razorpaySubscriptionId,
            name: "BiteX by Shyara",
            description: data.planName,
            handler: async (response: RazorpayResponse) => {
              try {
                await api.post("/api/billing/verify-payment", {
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySubscriptionId: response.razorpay_subscription_id,
                  razorpaySignature: response.razorpay_signature,
                });

                queryClient.invalidateQueries({ queryKey: ["billing"] });
                queryClient.invalidateQueries({ queryKey: ["dashboard"] });

                toast({
                  title: "Payment successful!",
                  description: "Your subscription is now active.",
                });

                setIsLoading(false);
                resolve(true);
              } catch {
                toast({
                  title: "Payment verification failed",
                  description: "Your payment was received but verification failed. Please contact support.",
                  variant: "destructive",
                });
                setIsLoading(false);
                resolve(false);
              }
            },
            modal: {
              ondismiss: () => {
                setIsLoading(false);
                resolve(false);
              },
            },
            prefill: {
              email: params.email,
              contact: params.phone,
            },
            theme: { color: "#F97316" },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        });
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || "Failed to start checkout";
        setError(msg);
        toast({
          title: "Checkout failed",
          description: msg,
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    },
    [queryClient, toast]
  );

  return { startCheckout, isLoading, error };
}
