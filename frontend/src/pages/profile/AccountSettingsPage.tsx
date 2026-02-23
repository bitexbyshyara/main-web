import { useState, useRef, useCallback, useMemo } from "react";
import {
  Building2, User, Shield, Bell, Camera, Phone, Mail,
  Globe, Key, Eye, EyeOff, AlertTriangle, ChevronDown, Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import api from "@/lib/axios";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: string;
  twoFaEnabled: boolean;
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
}

interface TenantSettings {
  tenantId: string;
  name: string;
  slug: string;
  logoUrl: string;
  businessType: string;
  phone: string;
  businessEmail: string;
  website: string;
  gstin: string;
  address: string;
  description: string;
  paymentGateway: string;
  tier: string;
  billingCycle: string;
  status: string;
}

interface NotificationPrefs {
  orderAlerts: boolean;
  staffUpdates: boolean;
  billingReminders: boolean;
  promotions: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      details?: Record<string, string>;
    };
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

const TABS = [
  { value: "personal", label: "Personal Info", icon: User },
  { value: "restaurant", label: "Restaurant Settings", icon: Building2 },
  { value: "security", label: "Security", icon: Shield },
  { value: "notifications", label: "Notifications", icon: Bell },
];

function getPasswordStrength(pw: string) {
  if (!pw) return { label: "", percent: 0, color: "bg-border" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", percent: 20, color: "bg-destructive" };
  if (score <= 3) return { label: "Medium", percent: 55, color: "bg-warning" };
  return { label: "Strong", percent: 100, color: "bg-success" };
}

function extractError(err: unknown): { message: string; details: Record<string, string> } {
  const e = err as ApiError;
  return {
    message: e.response?.data?.message || "Something went wrong",
    details: e.response?.data?.details || {},
  };
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-xs text-destructive mt-1">{error}</p>;
}

function FormSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <Skeleton className="h-20 w-20 rounded-xl" />
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: rows * 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Personal Info Tab ──────────────────────────────────────────────────────────

function PersonalInfoTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => (await api.get("/api/user/profile")).data,
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (profile && !initialized) {
    setFirstName(profile.firstName || "");
    setLastName(profile.lastName || "");
    setPersonalPhone(profile.phone || "");
    if (profile.avatarUrl) setAvatarPreview(profile.avatarUrl);
    setInitialized(true);
  }

  const mutation = useMutation({
    mutationFn: async (body: { firstName?: string; lastName?: string; phone?: string }) =>
      (await api.put("/api/user/profile", body)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setFieldErrors({});
      toast({ title: "Personal info saved!" });
    },
    onError: (err) => {
      const { message, details } = extractError(err);
      setFieldErrors(details);
      toast({ title: message, variant: "destructive" });
    },
  });

  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  }, []);

  if (isLoading) return <FormSkeleton rows={3} />;

  const initials =
    firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : "??";

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => avatarInputRef.current?.click()}
          className="relative group h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden flex-shrink-0"
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-primary font-heading font-bold text-xl">
              {initials}
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors rounded-full flex items-center justify-center">
            <Camera className="h-4 w-4 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        <div>
          <p className="text-sm font-medium text-foreground">{firstName} {lastName}</p>
          <p className="text-xs text-muted-foreground">Update your profile photo</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1.5" />
          <FieldError error={fieldErrors.firstName} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1.5" />
          <FieldError error={fieldErrors.lastName} />
        </div>
        <div>
          <Label>Email Address</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={profile?.email || ""} disabled className="pl-10 opacity-60" />
          </div>
        </div>
        <div>
          <Label>Phone Number</Label>
          <div className="relative mt-1.5">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={personalPhone} onChange={(e) => setPersonalPhone(e.target.value)} className="pl-10" />
          </div>
          <FieldError error={fieldErrors.phone} />
        </div>
        <div>
          <Label>Role</Label>
          <Input value={profile?.role || ""} disabled className="mt-1.5 opacity-60" />
        </div>
        <div>
          <Label>Tenant</Label>
          <Input value={profile?.tenantName || ""} disabled className="mt-1.5 opacity-60" />
        </div>
      </div>

      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate({ firstName, lastName, phone: personalPhone })}
      >
        {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Save Changes
      </Button>
    </div>
  );
}

// ─── Restaurant Settings Tab ────────────────────────────────────────────────────

function RestaurantSettingsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { data: tenant, isLoading } = useQuery<TenantSettings>({
    queryKey: ["tenant-settings"],
    queryFn: async () => (await api.get("/api/tenant/settings")).data,
  });

  const [form, setForm] = useState({
    name: "", businessType: "", phone: "", businessEmail: "",
    website: "", gstin: "", address: "", description: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (tenant && !initialized) {
    setForm({
      name: tenant.name || "",
      businessType: tenant.businessType || "",
      phone: tenant.phone || "",
      businessEmail: tenant.businessEmail || "",
      website: tenant.website || "",
      gstin: tenant.gstin || "",
      address: tenant.address || "",
      description: tenant.description || "",
    });
    if (tenant.logoUrl) setLogoPreview(tenant.logoUrl);
    setInitialized(true);
  }

  const mutation = useMutation({
    mutationFn: async (body: typeof form) =>
      (await api.put("/api/tenant/settings", body)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-settings"] });
      setFieldErrors({});
      toast({ title: "Restaurant settings saved!" });
    },
    onError: (err) => {
      const { message, details } = extractError(err);
      setFieldErrors(details);
      toast({ title: message, variant: "destructive" });
    },
  });

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  }, []);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (isLoading) return <FormSkeleton rows={4} />;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => logoInputRef.current?.click()}
          className="relative group h-20 w-20 rounded-xl bg-secondary border-2 border-dashed border-border hover:border-primary/50 transition-colors overflow-hidden flex-shrink-0"
        >
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground group-hover:text-primary transition-colors">
              <Camera className="h-5 w-5" />
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors rounded-xl flex items-center justify-center">
            <Camera className="h-4 w-4 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        <div>
          <p className="text-sm font-medium text-foreground">Restaurant Logo</p>
          <p className="text-xs text-muted-foreground">PNG or JPG, max 2MB</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Restaurant Name</Label>
          <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1.5" />
          <FieldError error={fieldErrors.name} />
        </div>
        <div>
          <Label>Business Type</Label>
          <Input value={form.businessType} onChange={(e) => update("businessType", e.target.value)} className="mt-1.5" />
          <FieldError error={fieldErrors.businessType} />
        </div>
        <div>
          <Label>Phone Number</Label>
          <div className="relative mt-1.5">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="pl-10" />
          </div>
          <FieldError error={fieldErrors.phone} />
        </div>
        <div>
          <Label>Business Email</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={form.businessEmail} onChange={(e) => update("businessEmail", e.target.value)} className="pl-10" />
          </div>
          <FieldError error={fieldErrors.businessEmail} />
        </div>
        <div>
          <Label>Website</Label>
          <div className="relative mt-1.5">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={form.website} onChange={(e) => update("website", e.target.value)} className="pl-10" />
          </div>
          <FieldError error={fieldErrors.website} />
        </div>
        <div>
          <Label>GSTIN</Label>
          <Input value={form.gstin} onChange={(e) => update("gstin", e.target.value)} className="mt-1.5" />
          <FieldError error={fieldErrors.gstin} />
        </div>
        <div className="sm:col-span-2">
          <Label>Address</Label>
          <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} className="mt-1.5 resize-none" rows={2} />
          <FieldError error={fieldErrors.address} />
        </div>
        <div className="sm:col-span-2">
          <Label>Restaurant Description</Label>
          <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="mt-1.5 resize-none" rows={3} />
          <FieldError error={fieldErrors.description} />
        </div>
      </div>

      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(form)}
      >
        {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Save Changes
      </Button>
    </div>
  );
}

// ─── Security Tab ───────────────────────────────────────────────────────────────

function SecurityTab() {
  const { toast } = useToast();

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => (await api.get("/api/user/profile")).data,
  });

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const pwStrength = useMemo(() => getPasswordStrength(newPw), [newPw]);

  const passwordMutation = useMutation({
    mutationFn: async (body: { currentPassword: string; newPassword: string }) =>
      (await api.put("/api/user/password", body)).data,
    onSuccess: (data: { message: string }) => {
      setFieldErrors({});
      toast({ title: data.message || "Password updated!" });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    },
    onError: (err) => {
      const { message, details } = extractError(err);
      setFieldErrors(details);
      toast({ title: message, variant: "destructive" });
    },
  });

  const handlePasswordUpdate = () => {
    if (!currentPw || !newPw) return;
    if (newPw.length > 72) {
      toast({ title: "Password too long", description: "Maximum 72 characters allowed.", variant: "destructive" });
      return;
    }
    if (!/[A-Z]/.test(newPw) || !/[a-z]/.test(newPw) || !/[0-9]/.test(newPw)) {
      toast({ title: "Weak password", description: "Must include uppercase, lowercase, and a digit.", variant: "destructive" });
      return;
    }
    if (newPw !== confirmPw) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    passwordMutation.mutate({ currentPassword: currentPw, newPassword: newPw });
  };

  return (
    <div className="space-y-5">
      {/* Change Password */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Key className="h-4 w-4" /> Change Password
        </h3>
        <div className="max-w-sm space-y-3">
          <div>
            <Label>Current Password</Label>
            <div className="relative mt-1.5">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showCurrentPw ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FieldError error={fieldErrors.currentPassword} />
          </div>
          <div>
            <Label>New Password</Label>
            <div className="relative mt-1.5">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showNewPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FieldError error={fieldErrors.newPassword} />
            {newPw && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${pwStrength.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pwStrength.percent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className={`text-xs ${pwStrength.percent <= 20 ? "text-destructive" : pwStrength.percent <= 55 ? "text-warning" : "text-success"}`}>
                  {pwStrength.label}
                </p>
              </div>
            )}
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <div className="relative mt-1.5">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="pl-10"
              />
            </div>
            {confirmPw && confirmPw !== newPw && (
              <p className="text-xs text-destructive mt-1">Passwords don't match</p>
            )}
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={passwordMutation.isPending}
            onClick={handlePasswordUpdate}
          >
            {passwordMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Password
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-semibold text-foreground">Two-Factor Authentication</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Coming Soon</span>
        </div>
        <div className="flex items-center justify-between opacity-50">
          <div>
            <p className="text-sm font-medium text-foreground">SMS Verification</p>
            <p className="text-xs text-muted-foreground">Receive a code via SMS when signing in. This feature is under development.</p>
          </div>
          <Switch checked={false} disabled />
        </div>
      </div>

      {/* Danger Zone */}
      <Collapsible>
        <CollapsibleTrigger className="w-full">
          <div className="bg-card border border-destructive/20 rounded-xl px-6 py-4 flex items-center justify-between hover:bg-destructive/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h3 className="font-heading font-semibold text-destructive text-sm">Danger Zone</h3>
            </div>
            <ChevronDown className="h-4 w-4 text-destructive" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border border-t-0 border-destructive/20 rounded-b-xl px-6 py-4 space-y-3 -mt-2">
            <p className="text-sm text-muted-foreground">
              To permanently delete your account and all associated data, please contact our support team. This action cannot be undone.
            </p>
            <Button asChild variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
              <a href="mailto:support@shyara.co.in?subject=Account%20Deletion%20Request">
                <Mail className="h-4 w-4 mr-1.5" /> Contact Support to Delete Account
              </a>
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// ─── Notifications Tab ──────────────────────────────────────────────────────────

const NOTIFICATION_ITEMS = [
  { key: "orderAlerts" as const, label: "Order Alerts", desc: "Get notified when new orders are placed" },
  { key: "staffUpdates" as const, label: "Staff Updates", desc: "Notifications about team member activity" },
  { key: "billingReminders" as const, label: "Billing Reminders", desc: "Payment due dates and invoice notifications" },
  { key: "promotions" as const, label: "Promotions & Offers", desc: "Special offers and feature announcements" },
  { key: "weeklyReports" as const, label: "Weekly Reports", desc: "Receive a weekly summary of your restaurant performance" },
  { key: "securityAlerts" as const, label: "Security Alerts", desc: "Login attempts and security-related notifications" },
] as const;

function NotificationsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<NotificationPrefs>({
    queryKey: ["notification-prefs"],
    queryFn: async () => (await api.get("/api/user/notifications")).data,
  });

  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [initialized, setInitialized] = useState(false);

  if (data && !initialized) {
    setPrefs(data);
    setInitialized(true);
  }

  const mutation = useMutation({
    mutationFn: async (body: Partial<NotificationPrefs>) =>
      (await api.put("/api/user/notifications", body)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-prefs"] });
      toast({ title: "Notification preferences saved!" });
    },
    onError: (err) => {
      const { message } = extractError(err);
      toast({ title: message, variant: "destructive" });
    },
  });

  if (isLoading || !prefs) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <h3 className="font-heading font-semibold text-foreground">Notification Preferences</h3>
      <div className="space-y-4">
        {NOTIFICATION_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch
              checked={prefs[item.key]}
              onCheckedChange={(checked) =>
                setPrefs((prev) => (prev ? { ...prev, [item.key]: checked } : prev))
              }
            />
          </div>
        ))}
      </div>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(prefs)}
      >
        {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Save Preferences
      </Button>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

const AccountSettingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Account Settings</h1>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1 h-auto flex-wrap">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-background"
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoTab />
        </TabsContent>

        <TabsContent value="restaurant">
          <RestaurantSettingsTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettingsPage;
