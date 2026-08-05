"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, LogOut, Shield, User } from "lucide-react";
import { CrestImage } from "@/components/ui/crest-image";
import { AVATAR_IMAGE } from "@/lib/images";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { crestStore } from "@/lib/data/store";
import { useCrestData } from "@/hooks/use-crest-data";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";

export default function ProfilePage() {
  const { data: appData } = useCrestData();
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const profile = appData?.profile;

  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [emailNotif, setEmailNotif] = useState(profile?.settings.emailNotifications ?? true);
  const [pushNotif, setPushNotif] = useState(profile?.settings.pushNotifications ?? true);

  const handleSave = () => {
    crestStore.updateProfile({ name, email, phone });
    queryClient.invalidateQueries({ queryKey: ["crest"] });
    toast({ title: "Profile updated", variant: "success" });
  };

  const handleSettingsSave = () => {
    crestStore.updateSettings({ emailNotifications: emailNotif, pushNotifications: pushNotif });
    queryClient.invalidateQueries({ queryKey: ["crest"] });
    toast({ title: "Settings saved", variant: "success" });
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      </motion.div>

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-white/[0.06]">
          <CrestImage src={profile?.avatar ?? AVATAR_IMAGE} alt="Avatar" fill className="object-cover" />
        </div>
        <div>
          <p className="text-lg font-semibold">{profile?.name}</p>
          <p className="text-sm text-white/50">{profile?.email}</p>
        </div>
        <Badge variant="live" className="ml-auto">KYC Verified</Badge>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal"><User className="h-3.5 w-3.5 mr-1.5" />Personal</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="h-3.5 w-3.5 mr-1.5" />Documents</TabsTrigger>
          <TabsTrigger value="kyc"><Shield className="h-3.5 w-3.5 mr-1.5" />KYC</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 mt-4">
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6">
            <p className="text-sm text-white/50 mb-2">Businesses</p>
            <p className="text-2xl font-semibold">{appData?.dashboardStats.businesses ?? 0}</p>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="rounded-2xl border border-white/[0.06] bg-card overflow-hidden">
            {profile?.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-white/40" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-white/40">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="live">{doc.status}</Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kyc" className="mt-4">
          <div className="rounded-2xl border border-white/[0.06] bg-card p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold">Identity Verified</h3>
            <p className="text-sm text-white/50">Your KYC verification is complete. You have full access to all CREST OS features.</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-white/40">Receive updates via email</p>
              </div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-white/40">Real-time alerts</p>
              </div>
              <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
            </div>
            <Button onClick={handleSettingsSave}>Save Settings</Button>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-card p-6">
            <h3 className="font-medium mb-2">Support</h3>
            <p className="text-sm text-white/50 mb-4">Need help? Our team is available 24/7.</p>
            <Button variant="secondary" onClick={() => toast({ title: "Support ticket created", description: "We'll respond within 2 hours." })}>
              Contact Support
            </Button>
          </div>

          <Button variant="destructive" onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
