import { useState, useRef, useCallback, useMemo } from "react";
import {
  Building2, User, CreditCard, Shield, Bell, Camera, Phone, Mail,
  Globe, Key, Eye, EyeOff, AlertTriangle, ChevronDown, Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const TABS = [
  { value: "restaurant", label: "Restaurant Profile", icon: Building2 },
  { value: "personal", label: "Personal Info", icon: User },
  { value: "payment", label: "Payment Gateway", icon: CreditCard },
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

const AccountSettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Restaurant Profile
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState("The Golden Fork");
  const [businessType, setBusinessType] = useState("Fine Dining");
  const [restaurantPhone, setRestaurantPhone] = useState("+91 98765 43210");
  const [businessEmail, setBusinessEmail] = useState("info@goldenfork.in");
  const [website, setWebsite] = useState("www.goldenfork.in");
  const [gstin, setGstin] = useState("27AADCG1234F1ZH");
  const [address, setAddress] = useState("42, MG Road, Fort, Mumbai, Maharashtra 400001");
  const [description, setDescription] = useState("Premium fine dining experience serving authentic Indian and Continental cuisine since 2018.");

  // Personal Info
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("Rajesh");
  const [lastName, setLastName] = useState("Patel");
  const [personalEmail] = useState(user?.email || "rajesh@goldenfork.in");
  const [personalPhone, setPersonalPhone] = useState("+91 98765 43210");

  // Security
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const pwStrength = useMemo(() => getPasswordStrength(newPw), [newPw]);

  // Notifications
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    staffUpdates: true,
    billingReminders: true,
    promotions: false,
    weeklyReports: true,
    securityAlerts: true,
  });

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  }, []);

  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  }, []);

  const initials = firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : "GF";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Account Settings</h1>

      <Tabs defaultValue="restaurant" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1 h-auto flex-wrap">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-background">
              <tab.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Restaurant Profile */}
        <TabsContent value="restaurant">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            {/* Logo upload */}
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => logoInputRef.current?.click()} className="relative group h-20 w-20 rounded-xl bg-secondary border-2 border-dashed border-border hover:border-primary/50 transition-colors overflow-hidden flex-shrink-0">
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
                <Input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Business Type</Label>
                <Input value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={restaurantPhone} onChange={(e) => setRestaurantPhone(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div>
                <Label>Business Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div>
                <Label>Website</Label>
                <div className="relative mt-1.5">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div>
                <Label>GSTIN</Label>
                <Input value={gstin} onChange={(e) => setGstin(e.target.value)} className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label>Address</Label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5 resize-none" rows={2} />
              </div>
              <div className="sm:col-span-2">
                <Label>Restaurant Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 resize-none" rows={3} />
              </div>
            </div>

            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast({ title: "Restaurant profile saved!" })}>
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Personal Info */}
        <TabsContent value="personal">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => avatarInputRef.current?.click()} className="relative group h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden flex-shrink-0">
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
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={personalEmail} disabled className="pl-10 opacity-60" />
                </div>
              </div>
              <div>
                <Label>Phone Number</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={personalPhone} onChange={(e) => setPersonalPhone(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div>
                <Label>Role</Label>
                <Input value="Owner / Manager" disabled className="mt-1.5 opacity-60" />
              </div>
              <div>
                <Label>Member Since</Label>
                <Input value="January 2024" disabled className="mt-1.5 opacity-60" />
              </div>
            </div>

            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast({ title: "Personal info saved!" })}>
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Payment Gateway */}
        <TabsContent value="payment">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-foreground">Payment Gateway Configuration</h3>
              <p className="text-sm text-muted-foreground mt-1">Connect your payment gateway to accept online payments from customers.</p>
            </div>

            {/* Warning banner */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Security Notice</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your payment credentials are encrypted and stored securely. We never share your keys with third parties.</p>
              </div>
            </div>

            <div className="max-w-sm space-y-4">
              <div>
                <Label>Select Payment Gateway</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choose a gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paytm">Paytm</SelectItem>
                    <SelectItem value="cashfree">Cashfree</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">Reset</Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Save Credentials</Button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <p className="text-sm font-medium text-foreground">Connection Status</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                No Gateway Connected
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
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
                    <Input type={showCurrentPw ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="pl-10 pr-10" />
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                      {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label>New Password</Label>
                  <div className="relative mt-1.5">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type={showNewPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} className="pl-10 pr-10" />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                      {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {newPw && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${pwStrength.color}`} initial={{ width: 0 }} animate={{ width: `${pwStrength.percent}%` }} transition={{ duration: 0.3 }} />
                      </div>
                      <p className={`text-xs ${pwStrength.percent <= 20 ? "text-destructive" : pwStrength.percent <= 55 ? "text-warning" : "text-success"}`}>{pwStrength.label}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <div className="relative mt-1.5">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="pl-10" />
                  </div>
                  {confirmPw && confirmPw !== newPw && <p className="text-xs text-destructive mt-1">Passwords don't match</p>}
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => {
                  if (!currentPw || !newPw) return;
                  if (newPw !== confirmPw) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
                  toast({ title: "Password updated!" });
                  setCurrentPw(""); setNewPw(""); setConfirmPw("");
                }}>
                  Update Password
                </Button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-heading font-semibold text-foreground">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">SMS Verification</p>
                  <p className="text-xs text-muted-foreground">Receive a code via SMS when signing in</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${smsEnabled ? "text-success" : "text-muted-foreground"}`}>
                    {smsEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
                </div>
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
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4 mr-1.5" /> Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete your account and all data. This cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => toast({ title: "Deletion request submitted" })}>
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h3 className="font-heading font-semibold text-foreground">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: "orderAlerts" as const, label: "Order Alerts", desc: "Get notified when new orders are placed" },
                { key: "staffUpdates" as const, label: "Staff Updates", desc: "Notifications about team member activity" },
                { key: "billingReminders" as const, label: "Billing Reminders", desc: "Payment due dates and invoice notifications" },
                { key: "promotions" as const, label: "Promotions & Offers", desc: "Special offers and feature announcements" },
                { key: "weeklyReports" as const, label: "Weekly Reports", desc: "Receive a weekly summary of your restaurant performance" },
                { key: "securityAlerts" as const, label: "Security Alerts", desc: "Login attempts and security-related notifications" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
                  />
                </div>
              ))}
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast({ title: "Notification preferences saved!" })}>
              Save Preferences
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettingsPage;
